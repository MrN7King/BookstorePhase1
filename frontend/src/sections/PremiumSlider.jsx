// src/sections/BestSellerSlider.jsx (Premium Version)
"use client";

import { Spinner } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../components/Cards';
import useCart from '../hooks/useCart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BestSellerSlider = ({ headingText = "Premium Accounts" }) => {
  const sliderRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addOrUpdateItem } = useCart();

  // --- Data Fetching Effect - Updated to use active endpoint ---
  useEffect(() => {
    const fetchPremiumProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch only active premium accounts for the slider
        const response = await axios.get(`${API_BASE_URL}/premium/active?limit=8`);
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setError("Unexpected data format from API.");
        }
      } catch (err) {
        console.error("Error fetching active premium products for slider:", err);
        setError("Failed to load premium accounts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumProducts();
  }, []);

  const handleCardClick = (id, slug) => {
    navigate(`/premium-product/${id}/${slug}`);
  };

  const scroll = (direction) => {
    if (sliderRef.current && products.length > 0) {
      const cardsToMove = 4;

      let targetIndex;
      if (direction === 'left') {
        targetIndex = Math.max(0, activeCardIndex - cardsToMove);
      } else {
        targetIndex = Math.min(products.length - 1, activeCardIndex + cardsToMove);
      }

      if (targetIndex === activeCardIndex) {
        if (direction === 'left' && activeCardIndex > 0) {
          targetIndex = activeCardIndex - 1;
        } else if (direction === 'right' && activeCardIndex < products.length - 1) {
          targetIndex = activeCardIndex + 1;
        }
      }

      if (targetIndex !== activeCardIndex) {
        setActiveCardIndex(targetIndex);
        if (sliderRef.current) {
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
      }
    }
  };

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
        closestCardIndex = products.length - 1;
      }

      if (closestCardIndex !== activeCardIndex) {
        setActiveCardIndex(closestCardIndex);
      }
    };

    slider.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [products.length, activeCardIndex]);

  return (
    <section className="pt-10 px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
        <h2 className="text-2xl md:text-4xl lg:text-4x1 font-bold text-gray-800 text-left mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {headingText}
        </h2>
        <a
          href="/premium-accounts"
          className="flex items-center text-black hover:text-blue-600 transition-colors duration-200
                       font-semibold text-lg md:text-xl group"
        >
          <h2 className='mt-2 text-base sm:text-lg md:text-xl'>View More</h2>
          <span className="ml-2 text-2xl sm:text-3xl md:text-4xl">›</span>
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner className="h-10 w-10" />
          <p className="ml-4 text-lg text-gray-700">Loading best sellers...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">
          <p className="text-xl font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-4 text-gray-600">
          <p className="text-xl font-semibold">No best sellers found.</p>
        </div>
      ) : (
        <div className="relative flex items-center justify-center px-4 md:px-8 lg:px-16 group">
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

          <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto overflow-y-hidden px-4 sm:px-8 py-4 space-x-10 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
            >
              {products.map((product) => (
                <div key={product._id} className="scroll-snap-align-start flex-shrink-0 w-64">
                  <Cards
                    book={{
                      id: product._id,
                      title: product.name || "Untitled Account",
                      author: product.platform || "N/A",
                      rating: product.rating || 0,
                      price: product.price ?? 0,
                      image: product.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
                      genre: product.platform || "Platform",
                      slug: product.slug,
                    }}
                    topRightPillText={product.platform}
                    onCardClick={handleCardClick}
                    onAddToCart={(payload) => {
                      addOrUpdateItem(payload, 1);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

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
      )}
    </section>
  );
};

export default BestSellerSlider;