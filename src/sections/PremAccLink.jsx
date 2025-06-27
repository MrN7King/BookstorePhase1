// src/sections/PremAccLink.jsx
"use client"; // Important for using useState (if you add hover effects back)


const PremAccLink = () => {
  return (
    // Outer container:
    // - bg-sky-400/15, rounded-lg, py-8 md:py-12, my-8: Styling for the banner itself.
    // - mx-auto max-w-7xl: Centers the section content on wider screens.
    // - px-4 sm:px-6 lg:px-8: Responsive horizontal padding for the *entire* banner content from screen edges.
    // - flex items-center justify-between: Keeps children in a row, spaced out evenly.
    // - NO flex-wrap: This is the critical change to ensure text and image *always* stay side-by-side.
    // - overflow-x-hidden: Prevents a page-level horizontal scrollbar if content slightly overflows on very small screens.
    <section className="bg-sky-400/15 rounded-lg py-8 md:py-12 my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-hidden">
      
      {/* Left side: Text and Button */}
      {/* - w-2/3: Takes 2/3 of the available width in the flex container on all screen sizes.
          - flex-shrink-0: Prevents this div from shrinking below its content's minimum size if space is very tight.
          - text-center on small screens, md:text-left on medium+ to adjust text alignment.
          - items-center on small, md:items-start on larger, for vertical alignment of content.
          - pr-4: Provides spacing between this column and the image column. */}
      <div className="w-2/3 flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left pr-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Searching for premium accounts?
        </h2>
        {/* Explore Now Button */}
        <a 
          href="/premium-accounts" // Set this to the actual URL for your premium accounts page
          className="bg-green-500 text-white py-3 px-6 sm:px-8 rounded-lg hover:bg-green-600 transition-colors duration-200 
                     shadow-md hover:shadow-lg inline-block text-sm sm:text-base" // Responsive button size
        >
          Explore Now
        </a>
      </div>

      {/* Right side: Image (Trophy on Books) */}
      {/* - w-1/3: Takes 1/3 of the available width in the flex container on all screen sizes.
          - flex-shrink-0: Prevents this div from shrinking.
          - justify-center on small, md:justify-end on larger, for image alignment.
          - pl-4: Provides spacing between this column and the text column. */}
      <div className="w-1/3 flex-shrink-0 flex justify-center md:justify-end pl-4">
        <img
          src="/assets/Award.png" // Verify this path is correct in your public/assets/ folder!
          alt="Trophy, symbolizing premium accounts"
          // Responsive sizing for the image:
          // w-full: Makes the image fill the width of its parent (w-1/3).
          // max-w-[...]: These constrain the absolute size of the image on different breakpoints,
          // ensuring it's not too small or too large, while still scaling proportionally within its column.
          className="w-full h-auto object-contain max-w-[100px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[250px]"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x200/e0e0e0/555555?text=Image+Missing" }} // Fallback if image not found
        />
      </div>
    </section>
  );
};

export default PremAccLink;
