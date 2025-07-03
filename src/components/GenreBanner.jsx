const GenreBanner = ({ genreName, backgroundImage }) => {
  return (
    <div
      className="relative w-full overflow-hidden shadow-lg"
      // Remove fixed padding-bottom, let content dictate height
      style={{ maxHeight: '30vh' }}
    >
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt={`${genreName} Background`}
        className="absolute inset-0 w-full h-full object-cover" // Ensure image covers the full banner area
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if fallback also fails
          e.target.src = "https://placehold.co/1200x400/cccccc/000000?text=Image+Not+Found"; // Fallback image
        }}
      />

      {/* Overlay for text and gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

      {/* Genre Name */}
      <div className="relative z-10 flex items-center justify-center p-4 @min-[425px]:min-h-[120px] md:min-h-[200px]"> {/* Added min-h for a base height */}
<h1
        className="relative z-20 text-white font-extrabold uppercase tracking-wide"
        style={{
          fontFamily: 'Poppins, sans-serif',
           fontSize: 'clamp(40px, 19.5vw, 150px)'
          
        }}
      >          {genreName}
        </h1>
      </div>
    </div>
  );
};


export default GenreBanner;