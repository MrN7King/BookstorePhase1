//file: frontend/src/sections/info_Homepage.jsx
import React from 'react';

const Info_Homepage = () => {
  const mainImage = '/assets/Info_Homepage.jpg';

  return (
    <section className="flex flex-col md:flex-row justify-center items-start py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16  bg-[var(--Info-Background)] font-sans w-full max-w-6xl mx-auto">
      {/* Image Column - Centered on mobile */}
      <div className="flex justify-center mx-auto mb-8 md:mb-0 w-full max-w-[280px] sm:max-w-xs md:w-2/5 md:mr-6 lg:mr-8 flex-shrink-0">
        <img
          src={mainImage}
          alt="Main illustrative image for homepage"
          className="w-full h-auto object-contain rounded-lg max-h-[16rem] sm:max-h-[18rem] md:max-h-[20rem]"
        />
      </div>

      {/* Content Column */}
      <div className="flex-1 text-center md:text-left md:w-3/5">
        {/* Title with adjusted sizes for larger screens */}
        <h2 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-[var(--Primary-Text)] mb-3 leading-tight">
          Find Your Favorite <br />
          <span className="text-[var(--Accent-text)]">Books And Premium Accounts Here!</span>
        </h2>

        <p className="text-xs sm:text-sm md:text-sm text-gray-600 leading-normal mb-6">
          Discover a curated collection of top-rated eBooks and exclusive premium accounts, all in one place. Whether you're here to learn, explore, or upgrade your digital lifestyle, we've got what you need.
        </p>

        <div className="grid grid-cols-3 gap-x-4 sm:gap-x-6 mb-7">
          <div className="text-center md:text-left">
            <span className="block text-lg sm:text-xl font-bold text-gray-800">800+</span>
            <span className="text-[0.65rem] sm:text-xs md:text-xs uppercase text-gray-500 tracking-wide">Book Listing</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-lg sm:text-xl font-bold text-gray-800">550+</span>
            <span className="text-[0.65rem] sm:text-xs md:text-xs uppercase text-gray-500 tracking-wide">Register User</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-lg sm:text-xl font-bold text-gray-800">1,200+</span>
            <span className="text-[0.65rem] sm:text-xs md:text-xs uppercase text-gray-500 tracking-wide">Books Sold</span>
          </div>
        </div>

        <button className="bg-[var(--cta-color)] hover:bg-[#218838] text-white py-2 px-5 rounded-md text-sm cursor-pointer transition-colors duration-300 ease-in-out">
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default Info_Homepage;