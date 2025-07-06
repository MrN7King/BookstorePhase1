"use client";
/**
 * GenreSection Component
 * Displays a large genre title overlaid on a background image.
 * The genre word and background image are configurable via props.
 *
 @param {object} props
 @param {string} props.genreTitle
 @param {string} props.backgroundImage
 * Defaults to a placeholder if not provided.
 */
const GenreSection = ({ genreTitle = "Fantasy", backgroundImage = "../assets/bg1.png" }) => {
  return (
    <section
      className="relative w-full h-[150px] md:h-[200px] lg:h-[400px] flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '45% center', // Shifts the background image slightly to the left
          backgroundRepeat: 'no-repeat',
          filter: 'blur(2px)', // Applies a 5-pixel blur effect to the background image
          transform: 'scale(1.05)', // Enlarges the background slightly to cover blur-induced transparent edges
        }}
      ></div>

      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      
      <h1
        className="relative z-20 text-white font-extrabold uppercase tracking-wide"
        style={{
          fontFamily: 'Poppins, sans-serif',
           fontSize: 'clamp(40px, 19.5vw, 280px)'
          
        }}
      >
        {genreTitle}
      </h1>
    </section>
  );
};

export default GenreSection;