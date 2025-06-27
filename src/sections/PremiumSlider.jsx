// src/sections/Slider.jsx
import { useRef } from 'react';
import Card from '../components/Cards';

const Slider = () => {
  const sliderRef = useRef(null);

  //account
  const templateBook = {
    image: "/assets/account1.png",
    title: "QuillBot Premium Account",
    rating: 4.5,
    price: "RS 1075.00",
    description: "Want to level up your online communication? Experience the power of QuillBot",
  };

  // Creates an array of the same thing but increments the index only
  const bestSellerBooks = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    ...templateBook,
  }));

  // Function to handle horizontal scrolling
  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 240; 
      const spaceBetweenCards = 16; 
      const scrollAmount = cardWidth + spaceBetweenCards;

      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section >
        
      <h2 className="pt-16 text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Best Selling Premium Accounts</h2>

      <div className="relative flex items-center justify-center">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards Container - Horizontal Scroll */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-8 md:space-x-8 lg:space-x-12 px-12 py-2"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          {bestSellerBooks.map((book) => (
            <div key={book.id} className="scroll-snap-align-start flex-shrink-0">
              <Card book={book} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-gray-900 text-white py-3 px-8 rounded-lg
                           hover:bg-gray-700 transition-colors duration-200
                           shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          View More
        </button>
      </div>
    </section>
  );
};

export default Slider;