// src/sections/BestSellerSlider.jsx
"use client";

import { Spinner } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../components/Cards';
import useCart from '../hooks/useCart';

const BestSellerSlider = ({ headingText = "Best Sellers", fetchType = "random" }) => {
    const sliderRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate
    const { addOrUpdateItem } = useCart();
    const [books, setBooks] = useState([]); // State to hold fetched books
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0); // State to manage the active card's index (for dots/scrolling logic)

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            let endpoint = fetchType === 'newest'
                ? 'http://localhost:5000/api/slider-ebooks/newest'
                : 'http://localhost:5000/api/slider-ebooks/random';

            try {
                const response = await axios.get(endpoint);
                if (response.data.success) {
                    setBooks(response.data.ebooks);
                } else {
                    setError(response.data.message || 'Failed to fetch books.');
                }
            } catch (err) {
                console.error(`Error fetching ${fetchType} books:`, err.response?.data || err.message);
                setError(`Failed to load ${headingText}. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [fetchType, headingText]);

    // --- Only navigate when a card is clicked ---
    const handleCardClick = (bookId) => {
        navigate(`/product/${bookId}`);
    };

    // --- Only scroll cards, do NOT navigate ---
    const scroll = (direction) => {
        if (!sliderRef.current || books.length === 0) return;

        const cardsToMove = 4;
        let targetIndex = direction === 'left'
            ? Math.max(0, activeCardIndex - cardsToMove)
            : Math.min(books.length - 1, activeCardIndex + cardsToMove);

        if (targetIndex === activeCardIndex) {
            targetIndex = direction === 'left' && activeCardIndex > 0
                ? activeCardIndex - 1
                : direction === 'right' && activeCardIndex < books.length - 1
                    ? activeCardIndex + 1
                    : activeCardIndex;
        }

        if (targetIndex !== activeCardIndex) {
            setActiveCardIndex(targetIndex);
            const cardElements = Array.from(sliderRef.current.children);
            const cardElement = cardElements[targetIndex];
            if (cardElement) {
                const cardOffsetLeft = cardElement.offsetLeft;
                const cardWidth = cardElement.offsetWidth;
                const containerWidth = sliderRef.current.offsetWidth;
                const scrollLeftPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
                sliderRef.current.scrollTo({ left: scrollLeftPosition, behavior: 'smooth' });
            }
        }
    };

    // --- Update activeCardIndex on scroll ---
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

            if (scrollLeft < 1) closestCardIndex = 0;
            else if (scrollLeft + clientWidth >= scrollWidth - 1) closestCardIndex = books.length - 1;

            if (closestCardIndex !== activeCardIndex) setActiveCardIndex(closestCardIndex);
        };

        slider.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => slider.removeEventListener('scroll', handleScroll);
    }, [books.length, activeCardIndex]);

    if (loading) return (
        <section className="pt-10 px-4 md:px-8 lg:px-12 flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" />
            <p className="ml-4 text-lg text-gray-700">Loading {headingText}...</p>
        </section>
    );

    if (error) return (
        <section className="pt-10 px-4 md:px-8 lg:px-12 text-center text-red-600">
            <p className="text-xl font-semibold">Error loading {headingText}:</p>
            <p>{error}</p>
        </section>
    );

    if (books.length === 0) return (
        <section className="pt-10 px-4 md:px-8 lg:px-12 text-center text-gray-600">
            <p className="text-xl font-semibold">No {headingText.toLowerCase()} found.</p>
        </section>
    );

    return (
        <section className="pt-10 px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-2">{headingText}</h2>
                <a
                    href="/Books"
                    className="flex items-center text-black hover:text-blue-600 transition-colors duration-200 font-semibold text-lg md:text-xl group"
                >
                    <h2 className="mt-2 text-base sm:text-lg md:text-xl">View More</h2>
                    <span className="ml-2 text-2xl sm:text-3xl md:text-4xl">›</span>
                </a>
            </div>

            {/* Slider + Arrows */}
            <div className="relative flex items-center justify-center px-4 md:px-8 lg:px-16 group">
                {/* Left Arrow */}
                <button
                    onClick={(e) => { e.stopPropagation(); scroll('left'); }}
                    className="absolute left-0 lg:left-4 z-30 p-4 rounded-full bg-white border border-gray-200 shadow-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-x-1 hover:scale-110 opacity-0 group-hover:opacity-100 hidden sm:block"
                    aria-label="Previous books"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            {/* Scrollable Cards */}
            <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto overflow-y-hidden px-2 sm:px-4 md:px-6 lg:px-8 py-4 space-x-4 sm:space-x-6 md:space-x-8 scrollbar-hide"
                    style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                >
                    {books.map((book) => (
                        <div key={book._id} className="scroll-snap-align-center flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-52">
                            <Cards
                                book={{
                                    id: book._id,
                                    title: book.name,
                                    author: book.author,
                                    rating: book.rating || 0,
                                    price: `LKR ${book.price.toFixed(2)}`,
                                    image: book.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
                                }}
                                onCardClick={handleCardClick}
                            />
                        </div>
                    ))}
                </div>
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
                                        price: book.price,
                                        image: book.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
                                    }}
                                    onCardClick={handleCardClick} // Pass the handleCardClick for redirection
                                    onAddToCart={(payload) => {
                                        // productPayload comes from Card and includes id/_id
                                        // pass the original/normalized product object to the hook
                                        addOrUpdateItem(payload, 1);
                                    }}
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
