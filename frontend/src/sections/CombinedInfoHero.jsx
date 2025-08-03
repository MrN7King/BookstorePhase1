// src/sections/CombinedHero.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const CombinedHero = () => {
  const navigate = useNavigate();
  const mainImage = '/assets/Info_Homepage.jpg'; // Using the image from Info_Homepage

  return (
    <section className="bg-white py-12 md:py-20 font-sans w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Add a gap for tablet and up */}
      <div className="flex flex-col md:flex-row items-center justify-between p-5 md:gap-12">
        
        {/* Left Column: Text Content and Buttons */}
        {/* Explicitly set md:w-1/2 */}
        <div className="md:w-1/2 lg:w-3/5 text-center md:text-left mb-10 md:mb-0">
          {/* Reduce font size for md screens */}
          <h1 className="text-3xl sm:text-4xl md:text-2xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Find Your Next Great Read,
            <span className="text-sky-600"> And More.</span>
          </h1>
          {/* Reduce font size for md screens */}
          <p className="mt-4 text-base sm:text-lg md:text-base lg:text-lg text-gray-600">
            Discover a curated collection of top-rated eBooks, exclusive premium accounts, and a world of knowledge waiting to be explored.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate('/AllBooks')}
              className="bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200 
                         shadow-md hover:shadow-lg text-sm md:px-3 lg:text-xl font-semibold whitespace-nowrap"
            >
              Explore Our Books
            </button>
            <button
              onClick={() => navigate('/AllPremiumAccounts')}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-200 
                         shadow-md hover:shadow-lg text-sm md:px-3 lg:text-xl  font-semibold whitespace-nowrap"
            >
              Explore Premium Accounts
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-12 grid grid-cols-3 gap-x-4 sm:gap-x-6">
            <div className="text-center md:text-left">
              <span className="block text-xl sm:text-2xl font-bold text-gray-800 md:text-xl lg:text-3xl">800+</span>
              <span className="text-xs sm:text-sm uppercase text-gray-500 tracking-wide">Book Listings</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xl sm:text-2xl font-bold text-gray-800 md:text-xl lg:text-3xl">550+</span>
              <span className="text-xs sm:text-sm uppercase text-gray-500 tracking-wide">Registered Users</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xl sm:text-2xl font-bold text-gray-800 md:text-xl lg:text-3xl">1,200+</span>
              <span className="text-xs sm:text-sm uppercase text-gray-500 tracking-wide">Books Sold</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        {/* Explicitly set md:w-1/2 */}
        <div className="md:w-1/2 lg:w-2/5 flex justify-center md:justify-end">
          <img
            src={mainImage}
            alt="Illustrative image of a person reading books"
            className="w-full max-w-[400px] h-auto object-contain rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CombinedHero;