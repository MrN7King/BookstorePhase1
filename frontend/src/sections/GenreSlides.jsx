// src/sections/GenreSlider.jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import Genre from '../components/Genre';

const GenreSlider = ({ headingText = "Explore By Genre" }) => {
  const sliderRef = useRef(null);
  const [activeGenreId, setActiveGenreId] = useState(1);
  const templateGenre = {
    image: "/assets/genre1.jpg", // Use a representative image for genres
    title: "Fiction", // Base title
  };

  const genres = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    ...templateGenre,
    title: `Science Fiction`, // Example: Genre 1: Adventure, Genre 2: Adventure etc.
    // Use different images if you have them, e.g.:
    // image: `/assets/genre${(index % 5) + 1}.png`,
  }));
  // >>> END OF PRESERVED LOOP <<<

  // Handles clicking a genre card to set it as active and scroll to it
  const handleGenreClick = (id) => {
    setActiveGenreId(id);
    if (sliderRef.current) {
      const index = genres.findIndex(g => g.id === id);
      if (index !== -1) {
        const cardElements = Array.from(sliderRef.current.children);
        const cardElement = cardElements[index];
        if (cardElement) {
          const cardOffsetLeft = cardElement.offsetLeft;
          const cardWidth = cardElement.offsetWidth;
          const containerWidth = sliderRef.current.offsetWidth;
          const scrollLeftPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
          sliderRef.current.scrollTo({ left: scrollLeftPosition, behavior: 'smooth' });
        }
      }
    }
  };


  const scroll = (direction) => {
    if (sliderRef.current) {
      const currentActiveIndex = genres.findIndex(g => g.id === activeGenreId);
      let targetIndex = currentActiveIndex;

      const containerWidth = sliderRef.current.offsetWidth;
      const cardElements = Array.from(sliderRef.current.children);


      const firstCardElement = cardElements[0];
      let cardUnitWidth = 0;
      if (firstCardElement && cardElements.length > 1) {
          // Calculate the distance between the start of two consecutive cards
          // This implicitly includes the space-x value.
          cardUnitWidth = cardElements[1].offsetLeft - firstCardElement.offsetLeft;
      } else if (firstCardElement) {
          // Fallback if only one card exists, use its width plus a typical space-x (e.g., 40px for space-x-10)
          cardUnitWidth = firstCardElement.offsetWidth + 40;
      }

      if (cardUnitWidth === 0) { // Safety check to prevent division by zero or infinite loop
          console.warn("Could not determine card unit width for scrolling. Aborting scroll.");
          return;
      }

          const effectiveScrollArea = containerWidth - (cardElements[0] ? cardElements[0].offsetLeft * 2 : 0); // Rough estimate of inner content width

      let cardsToScrollPerClick = Math.floor(effectiveScrollArea / cardUnitWidth);
      cardsToScrollPerClick = Math.max(1, cardsToScrollPerClick - 1); // Scroll by visible cards minus one, minimum 1.

      if (direction === 'left') {
        targetIndex = Math.max(0, currentActiveIndex - cardsToScrollPerClick);
      } else { // direction === 'right'
        targetIndex = Math.min(genres.length - 1, currentActiveIndex + cardsToScrollPerClick);
      }

      // Nudge logic: If the target index didn't change (e.g., at boundaries, or `cardsToScrollPerClick` is very small),
      // try to nudge by just one card to ensure some movement.
      if (targetIndex === currentActiveIndex) {
          if (direction === 'left' && currentActiveIndex > 0) {
              targetIndex = currentActiveIndex - 1;
          } else if (direction === 'right' && currentActiveIndex < genres.length - 1) {
              targetIndex = currentActiveIndex + 1;
          }
      }

      // Use handleGenreClick to precisely scroll to and activate the target card.
      // This function handles centering and setting the active state correctly,
      // accounting for the inner padding of the scroll container via `cardOffsetLeft`.
      if (targetIndex !== currentActiveIndex) {
          handleGenreClick(genres[targetIndex].id);
      }
      // --- End Smarter Scrolling Logic (ONLY CHANGE IN THIS SECTION) ---
    }
  };

  // Effect to update activeGenreId based on scroll position for visual feedback
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const clientWidth = slider.clientWidth;
      const cardElements = Array.from(slider.children);

      let closestGenreId = activeGenreId; // Initialize with current active ID as fallback
      let minDistance = Infinity;

      cardElements.forEach((card, index) => {
        const cardOffsetLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardOffsetLeft + cardWidth / 2;
        const viewportCenter = scrollLeft + clientWidth / 2;

        const distance = Math.abs(cardCenter - viewportCenter);

        // Check if the card is at least partially in view and its center is closest
        const isCardVisible = (cardOffsetLeft < scrollLeft + clientWidth) && (cardOffsetLeft + cardWidth > scrollLeft);

        if (isCardVisible && distance < minDistance) {
          minDistance = distance;
          closestGenreId = genres[index].id;
        }
      });

      // Explicitly handle the very first and very last cards for robustness,
      // overriding the "closest to center" if at the extreme ends.
      // Use a small tolerance for scroll position to account for smooth scrolling and pixel variations.
      if (scrollLeft < 1) { // If scrolled almost to the very beginning (tolerance 1px)
        closestGenreId = genres[0]?.id || 1;
      } else if (scrollLeft + clientWidth >= slider.scrollWidth - 1) { // If scrolled almost to the very end (tolerance 1px)
        closestGenreId = genres[genres.length - 1]?.id || 1;
      }

      if (closestGenreId !== activeGenreId) {
        setActiveGenreId(closestGenreId);
      }
    };

    slider.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial active state calculation

    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [genres]); // Re-run if genres data changes

  return (
    <section className="pt-10 lg:pt-15 bg-white overflow-hidden"> {/* Clean background */}
      <h2 style={{ fontFamily: 'Inter, sans-serif' }} className=" text-3xl md:text-4xl font-extrabold text-center text-gray-800">
        {headingText}
      </h2>

      {/* Slider Area: Controls and Scrollable Content */}
      <div className="relative flex items-center justify-center px-4 md:px-8 lg:px-16 group">

        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 lg:left-4 z-30 p-3 rounded-full bg-white border border-gray-200 shadow-md
                     text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-x-1 hover:scale-110
                     opacity-0 group-hover:opacity-100 hidden sm:block"
          aria-label="Previous genres"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Container Wrapper with Fading Effect */}
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden custom-scroll-fade py-6">
          {/* Actual Scrollable Content */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto custom-scrollbar space-x-10 px-4 sm:px-8 py-4" /* Horizontal spacing and padding */
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {genres.map((genre) => (
              <div key={genre.id} className="scroll-snap-align-center flex-shrink-0">
                <Genre
                  genre={genre}
                  isActive={genre.id === activeGenreId} // isActive still passed for dot functionality
                  onClick={handleGenreClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 lg:right-4 z-30 p-3 rounded-full bg-white border border-gray-200 shadow-md
                     text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-1 hover:scale-110
                     opacity-0 group-hover:opacity-100 hidden sm:block"
          aria-label="Next genres"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default GenreSlider;
