// src/components/GenreCard.jsx
"use client";


/**
 * GenreCard Component for displaying a single book genre.
 * Features a circular image, genre title, and interactive hover effects.
 *
 * @param {object} props - The component props.
 * @param {object} props.genre - The genre data object containing:
 * - {string} image: URL to the genre's representative image.
 * - {string} title: The title of the genre (e.g., "Science Fiction").
 * - {number} id: Unique ID for the genre.
 * @param {boolean} props.isActive - True if this card is currently considered "active" (e.g., centered in the slider).
 * @param {function} props.onClick - Function to call when the card is clicked.
 */
const Genre = ({ genre, isActive, onClick }) => {
  if (!genre) {
    console.error("GenreCard component received undefined 'genre' prop. Rendering fallback.");
    return null;
  }

  return (
    <div
      className={`
        flex-none w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] /* Responsive base width for cards */
        flex flex-col items-center justify-center p-2 text-center /* Centering content */
        cursor-pointer transition-all duration-300 ease-in-out transform /* Base transitions */
        ${isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-80'} /* Active state prominence */
        hover:scale-100 hover:opacity-100 /* Hover effect */
      `}
      onClick={() => onClick?.(genre.id)} // Pass genre id on click
    >
      {/* Circular Image Container */}
      <div className={`
        relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 /* Responsive circular image size */
        rounded-full overflow-hidden border-4 e shadow-md mb-3 /* Base circular styling */
        transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-xl
        ${isActive ? 'border-gray-200 shadow-active-card' : 'border-gray-200'} /* Active border color and shadow */
      `}>
        <img
          src={genre.image || "https://placehold.co/200x200/cccccc/333333?text=Genre"} // Placeholder with text
          alt={genre.title || "Genre Cover"}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/cccccc/333333?text=Error" }}
        />
        {/* Hover Overlay for image */}
        <div className="absolute inset-0 bg-black/70 bg-opacity-20 flex items-center justify-center
                        opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs font-semibold uppercase tracking-wider">Explore</span>
        </div>
      </div>

      {/* Genre Title */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
        {genre.title || "Unknown Genre"}
      </h3>
    </div>
  );
};

export default Genre;