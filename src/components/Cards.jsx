"use client";
import { useEffect, useRef, useState } from 'react'; // Import useRef, useEffect, and useState

//star svg
const STAR_SVG_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z";

const Card = ({ book, index, current, onCardClick }) => {
  // Actively chosen card
  const isActive = index === current;

  // For animation on scroll
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the card is intersecting (entering the viewport)
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Optionally, unobserve once it's visible if you only want it to animate once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No extra margin
        threshold: 0.1, // Trigger when 10% of the item is visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Star Rating Renderer
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={`star-full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d={STAR_SVG_PATH} />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={`star-half-${i}`} className="relative">
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d={STAR_SVG_PATH} />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-400 absolute top-0 left-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
              <path d={STAR_SVG_PATH} />
            </svg>
          </div>
        );
      } else {
        stars.push(
          <svg key={`star-empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d={STAR_SVG_PATH} />
          </svg>
        );
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    // Main Card Design
    <div
      ref={cardRef} // Attach ref to the main div
      className={`
        flex-none w-[200px] sm:w-[180px] md:w-[200px] lg:w-[250px] xl:w-[250px]
        bg-sky-400/15 rounded-xl my-4
        flex flex-col p-4
        transition-all duration-500 ease-out transform
        ${isActive
          ? 'shadow-lg hover:shadow-xl hover:scale-[1.01]' // Current card has shadow and hover effect
          : 'opacity-70 grayscale hover:scale-100'}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} // Changed to translate-y
      `}
      onClick={() => onCardClick(index)}>

      {/* Book Image */}
      <img
        src={book.image || "/assets/book1.jpg"}
        alt={book.title}
        className="w-full h-auto object-cover rounded-md mb-4"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x200/cccccc/333333?text=Error" }}
        loading="lazy"
      />

      {/* Book Title */}
      <h3 className="text-base font-semibold text-gray-800 mb-1 text-left">{book.title}</h3>

      {/* Author and Rating */}
      <div className="flex items-center justify-start w-full mb-2">
        {book.author && <p className="text-sm text-gray-600 mr-2">{book.author}</p>}
        <div className="flex-shrink-0">
          {renderStars(book.rating)}
        </div>
      </div>

      {/* Price */}
      <p className="text-lg font-bold text-gray-900 mb-3 text-left">{book.price}</p>

      {/* Add to Cart Button */}
      <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg
                           hover:bg-gray-700 active:scale-[0.98] transition-all duration-200
                           flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer">
        <img src="/icons/Vector.svg" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }}></img>
        <span>Add To Cart</span>
      </button>
    </div>
  );
};

export default Card;