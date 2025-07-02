// src/components/Card.jsx
"use client";


// --- Star SVG Path ---
const STAR_SVG_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z";


// --- Card Component ---
const Card = ({ book, index, isActive, onCardClick }) => { // isActive prop is for internal slider logic, not visual styling here
  // Ensure book is defined before accessing its properties
  if (!book) {

    return null;
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={`star-full-${i}`} className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d={STAR_SVG_PATH} />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={`star-half-${i}`} className="relative">
            <svg className="w-3 h-3 text-gray-300 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d={STAR_SVG_PATH} />
            </svg>
            <svg
              className="w-3 h-3 text-yellow-400 absolute top-0 left-0 sm:w-4 sm:h-4"
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
          <svg key={`star-empty-${i}`} className="w-3 h-3 text-gray-300 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d={STAR_SVG_PATH} />
          </svg>
        );
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    // Main Card Design - Using your original classes
    <div
      className={`
        flex-none w-[200px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[220px] /* Original responsive widths */
        bg-sky-400/15 rounded-xl
        flex flex-col p-4
        transition-all duration-500 ease-out transform cursor-pointer /* Increased duration for smoother entry */
        shadow-md /* Base styling for all cards, no active/inactive branches */
        hover:scale-[1.01] hover:shadow-lg
      `}
      onClick={() => onCardClick?.(index)}> {/* Use optional chaining for onCardClick */}

      {/* Book Image */}
      <img
        src={book.image || "https://placehold.co/140x180/cccccc/333333?text=Book+Cover"} // Placeholder size adjusted to new card dimensions
        alt={book.title || "Book Cover"} // Added fallback for alt text
        className="w-full h-[180px] sm:h-auto object-cover rounded-md mb-3 sm:mb-4" /* Set fixed height for mobile, auto for larger */
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/140x180/cccccc/333333?text=Error" }} // Error placeholder adjusted
        loading="lazy"
      />

      {/* Book Title */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 text-left line-clamp-2">{book.title || "Untitled"}</h3> {/* Smaller font for mobile */}

      {/* Author and Rating */}
      <div className="flex items-center justify-start w-full mb-1 sm:mb-2"> {/* Reduced mb for mobile */}
        {book.author && <p className="text-xs sm:text-sm text-gray-600 mr-2">{book.author}</p>} {/* Smaller font for mobile */}
        <div className="flex-shrink-0">
          {renderStars(book.rating)}
        </div>
      </div>

      {/* Price */}
      <p className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 text-left">{book.price || "N/A"}</p> {/* Smaller font for mobile */}

      {/* Add to Cart Button */}
      <button className="w-full bg-gray-900 text-white py-1 px-3 rounded-lg sm:py-2 sm:px-4 /* Smaller padding for button */
                          text-sm sm:text-base /* Smaller font for button */
                          hover:bg-gray-700 active:scale-[0.98] transition-all duration-200
                          flex items-center justify-center space-x-1 sm:space-x-2 shadow-md hover:shadow-lg cursor-pointer">
        {/* Using placeholder SVG for the icon. If you have a /icons/Vector.svg, replace this. */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add To Cart</span>
      </button>
    </div>
  );
};

export default Card;
