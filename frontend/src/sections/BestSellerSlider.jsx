// src/sections/BestSellerSlider.jsx
"use client";

import { Spinner } from '@material-tailwind/react'; // Assuming you have Material Tailwind Spinner
import axios from 'axios'; // Import axios
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cards from '../components/Cards';

// --- BestSellerSlider Component (4 Cards Scroll + All Cards In Color) ---

// fetchType can be 'newest', 'random', 'bestseller', 'popular'
const BestSellerSlider = ({ headingText = "Best Sellers", fetchType = "random" }) => {
  const sliderRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [books, setBooks] = useState([]); // State to hold fetched books
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // State to manage the active card's index (for dots/scrolling logic)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      let endpoint = '';

      // Determine the API endpoint based on fetchType
      if (fetchType === 'newest') {
        endpoint = 'http://localhost:5000/api/slider-ebooks/newest';
      } else if (fetchType === 'random' || fetchType === 'bestseller' || fetchType === 'popular') {
        // For 'bestseller' and 'popular', we can use 'random' as a fallback if no specific logic exists
        endpoint = 'http://localhost:5000/api/slider-ebooks/random';
      } else {
        setError('Invalid fetch type provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setBooks(response.data.ebooks); // Assuming 'ebooks' array in response
        } else {
          setError(response.data.message || 'Failed to fetch books.');
        }
      } catch (err) {
        console.error(`Error fetching ${fetchType} books:`, err.response?.data || err.message);
        setError(`Failed to load ${fetchType} books. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [fetchType]); // Re-fetch when fetchType changes


  // Handles clicking a card to center it and set it as active, and also redirects
  const handleCardClick = (bookId) => {
    // Find the index of the clicked book to update activeCardIndex for dot logic
    const clickedIndex = books.findIndex(book => book.id === bookId);
    if (clickedIndex !== -1) {
      setActiveCardIndex(clickedIndex);
      if (sliderRef.current) {
        const cardElements = Array.from(sliderRef.current.children);
        const cardElement = cardElements[clickedIndex];
        if (cardElement) {
          const cardOffsetLeft = cardElement.offsetLeft;
          const cardWidth = cardElement.offsetWidth;
          const containerWidth = sliderRef.current.offsetWidth;
          const scrollLeftPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
          sliderRef.current.scrollTo({ left: scrollLeftPosition, behavior: 'smooth' });
        }
      }
    }
    // Redirect to the product detail page
    navigate(`/product/${bookId}`);
  };

  // Smarter Scrolling Logic for arrows
  const scroll = (direction) => {
    if (sliderRef.current && books.length > 0) {
      const cardsToMove = 4; // Scroll exactly 4 cards at once

      let targetIndex;
      if (direction === 'left') {
        targetIndex = Math.max(0, activeCardIndex - cardsToMove);
      } else { // direction === 'right'
        targetIndex = Math.min(books.length - 1, activeCardIndex + cardsToMove);
      }

      if (targetIndex === activeCardIndex) {
          if (direction === 'left' && activeCardIndex > 0) {
              targetIndex = activeCardIndex - 1;
          } else if (direction === 'right' && activeCardIndex < books.length - 1) {
              targetIndex = activeCardIndex + 1;
          }
      }

      if (targetIndex !== activeCardIndex) { // Only scroll if the target is different
          handleCardClick(books[targetIndex].id); // Pass the ID for scrolling and redirection
      }
    }
  };


  // Effect to update activeCardIndex based on scroll position for dot indicators
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const clientWidth = slider.clientWidth;
      const scrollWidth = slider.scrollWidth;
      const cardElements = Array.from(slider.children);

      let closestCardIndex = 0;
      let minDistance = Infinity;

      cardElements.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const viewportCenter = scrollLeft + clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCardIndex = index;
        }
      });

      if (scrollLeft < 1) {
        closestCardIndex = 0;
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        closestCardIndex = books.length - 1;
      }

      if (closestCardIndex !== activeCardIndex) {
        setActiveCardIndex(closestCardIndex);
      }
    };

    slider.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial active state calculation on mount

    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [books.length, activeCardIndex]);


  if (loading) {
    return (
      <section className="pt-10 px-4 md:px-8 lg:px-12 flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
        <p className="ml-4 text-lg text-gray-700">Loading {headingText}...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-10 px-4 md:px-8 lg:px-12 text-center text-red-600">
        <p className="text-xl font-semibold">Error loading {headingText}:</p>
        <p>{error}</p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="pt-10 px-4 md:px-8 lg:px-12 text-center text-gray-600">
        <p className="text-xl font-semibold">No {headingText.toLowerCase()} found.</p>
      </section>
    );
  }


  return (
    <section className="pt-10 px-4 md:px-8 lg:px-12">

      <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
        <h2 className="text-2xl md:text-4xl lg:text-4x1 font-bold text-gray-800 text-left mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {headingText}
        </h2>
        <a
          href="#" // Replace with your actual "view all" page URL
          className="flex items-center text-black hover:text-blue-600 transition-colors duration-200
                     font-semibold text-lg md:text-xl group"
        >
          <h2 className='mt-2 text-base sm:text-lg md:text-xl'>View More</h2>
          <span className="ml-2 text-2xl sm:text-3xl md:text-4xl">›</span>
        </a>
      </div>


      {/* Slider Area: Controls and Scrollable Content */}
      <div className="relative flex items-center justify-center px-4 md:px-8 lg:px-16 group">

        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 lg:left-4 z-30 p-4 rounded-full bg-white border border-gray-200 shadow-md
                     text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-x-1 hover:scale-110
                     opacity-0 group-hover:opacity-100 hidden sm:block"
          aria-label="Previous books"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
          {/* Actual Scrollable Content */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto overflow-y-hidden px-4 sm:px-8 py-4 space-x-10"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {books.map((book, index) => (
              <div key={book._id} className="scroll-snap-align-center flex-shrink-0 w-[260px]"> {/* Added fixed width here */}
                <Cards
                  book={{
                    id: book._id, // Pass _id as id
                    title: book.name,
                    author: book.author,
                    rating: book.rating || 0,
                    price: `LKR ${book.price.toFixed(2)}`,
                    image: book.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
                  }}
                  onCardClick={handleCardClick} // Pass the handleCardClick for redirection
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 lg:right-4 z-30 p-4 rounded-full bg-white border border-gray-200 shadow-md
                     text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1 hover:scale-110
                     opacity-0 group-hover:opacity-100 hidden sm:block"
          aria-label="Next books"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default BestSellerSlider;
