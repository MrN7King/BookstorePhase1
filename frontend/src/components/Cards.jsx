"use client";

const STAR_SVG_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z";

const Card = ({ book, index, onCardClick }) => {
  if (!book) return null;

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
    return <div className="flex space-x-[2px]">{stars}</div>;
  };

  return (
    <div
      onClick={() => onCardClick?.(index)}
      className="
  relative group flex flex-col w-full max-w-[250px]
  rounded-2xl shadow-md border border-white/10 overflow-hidden cursor-pointer
  bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#e3fff9]
  transition-shadow hover:shadow-xl duration-300
"
 >
      {/* Book Cover */}
      <div className="relative w-full md:h-[300px] overflow-hidden ">
        <img
          src={book.image || "https://placehold.co/160x220/eeeeee/444444?text=Book"}
          alt={book.title || "Book Cover"}
          className="w-full h-full object-cover  duration-500 hover:scale-105 "
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x220/eeeeee/444444?text=Error"; }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/70 backdrop-blur-md px-2 py-0.5 text-xs font-semibold rounded-full text-gray-700">
          {book.genre || "Genre"}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{book.title || "Untitled Book"}</h3>
        <p className="text-sm text-gray-600">{book.author || "Unknown Author"}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-sky-700">{book.price ? `${book.price}` : "Free"}</span>
          {renderStars(book.rating || 0)}
          
        </div>
      </div>

      {/* Add to Cart */}
      <div className="px-4 pb-4 mt-auto">
        <button className="w-full py-2 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
