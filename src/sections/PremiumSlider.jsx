// src/sections/BestSellerSlider.jsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Cards from '../components/Cards';

// --- BestSellerSlider Component (4 Cards Scroll + All Cards In Color) ---

const BestSellerSlider = ({ headingText = "Best Sellers" }) => {
  const sliderRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // State to manage the active card's index (for dots/scrolling logic)

  // >>> PRESERVED ORIGINAL BOOK DATA LOOP AS REQUESTED <<<
  const templateBook = {
    image: "/assets/account1.png",
    title: "QuillBot",
    author: "Supercell",
    rating: 4.5,
    price: "RS 1075.00",
  };

  const bestSellerBooks = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    ...templateBook,
  }));
  // >>> END OF PRESERVED ORIGINAL BOOK DATA LOOP <<<


  // Handles clicking a card to center it and set it as active
  const handleCardClick = (index) => {
    setActiveCardIndex(index);
    if (sliderRef.current) {
      const cardElements = Array.from(sliderRef.current.children);
      const cardElement = cardElements[index];
      if (cardElement) {
        const cardOffsetLeft = cardElement.offsetLeft;
        const cardWidth = cardElement.offsetWidth;
        const containerWidth = sliderRef.current.offsetWidth;
        // Calculate scroll position to center the card within the visible area.
        const scrollLeftPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
        sliderRef.current.scrollTo({ left: scrollLeftPosition, behavior: 'smooth' });
      }
    }
  };

  // Smarter Scrolling Logic for arrows
  const scroll = (direction) => {
    if (sliderRef.current && bestSellerBooks.length > 0) {
      const cardsToMove = 4; // FIXED: Scroll exactly 4 cards at once

      let targetIndex;
      if (direction === 'left') {
        targetIndex = Math.max(0, activeCardIndex - cardsToMove);
      } else { // direction === 'right'
        targetIndex = Math.min(bestSellerBooks.length - 1, activeCardIndex + cardsToMove);
      }


      if (targetIndex === activeCardIndex) {
          if (direction === 'left' && activeCardIndex > 0) {
              targetIndex = activeCardIndex - 1;
          } else if (direction === 'right' && activeCardIndex < bestSellerBooks.length - 1) {
              targetIndex = activeCardIndex + 1;
          }
      }

      if (targetIndex !== activeCardIndex) { // Only scroll if the target is different
          handleCardClick(targetIndex);
      }
    }
  };


  // Effect to update activeCardIndex based on scroll position for dot indicators
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const clientWidth = slider.clientWidth; // Get client width to check scroll end accurately
      const scrollWidth = slider.scrollWidth;
      const cardElements = Array.from(slider.children);

      let closestCardIndex = 0;
      let minDistance = Infinity;

      // Find the card closest to the center of the viewport
      cardElements.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const viewportCenter = scrollLeft + clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCardIndex = index;
        }
      });

      // Handle edge cases for the very first and very last cards
      if (scrollLeft < 1) { // If scrolled almost to the very beginning
        closestCardIndex = 0;
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) { // If scrolled almost to the very end
        closestCardIndex = bestSellerBooks.length - 1;
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
  }, [bestSellerBooks.length, activeCardIndex]); // Re-run if number of books changes or active index changes


  return (
    <section className="pt-10 px-4 md:px-8 lg:px-12">

      <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
        <h2 className="text-2xl md:text-4xl lg:text-4x1 font-bold text-gray-800 text-left mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {headingText}
        </h2>
        <a
          href="#" // Replace with your actual "view all" page URL
          className="flex items-center text-black hover:text-blue-600 transition-colors duration-200
                             font-semibold text-lg md:text-xl group" // Added group for hover effect on arrow
        >
          <h2 className='mt-2 text-base sm:text-lg md:text-xl'>View More</h2> {/* Adjusted font sizes for responsiveness */}
          <span className="ml-2 text-2xl sm:text-3xl md:text-4xl">›</span> {/* Adjusted arrow size for responsiveness */}
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
        <div className="relative w-full max-w-7xl mx-auto overflow-hiddenS">
          {/* Actual Scrollable Content */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto overflow-y-hidden px-4 sm:px-8 py-4 space-x-10" /* Added overflow-y-hidden */
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {bestSellerBooks.map((book, index) => (
              <div key={book.id} className="scroll-snap-align-center flex-shrink-0">
                <Cards // Using the inlined 'Card' component
                  book={book}
                  index={index}
                  isActive={index === activeCardIndex} // Pass isActive prop (for dot logic, not card styling now)
                  onCardClick={handleCardClick}
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
