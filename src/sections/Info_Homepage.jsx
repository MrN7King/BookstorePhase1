import React from 'react';
// No specific CSS file import needed for this component, as Tailwind handles it globally

const Info_Homepage = () => {
  // Image source now points to the local file in the public/assets directory
  const mainImage = '/assets/Info_Homepage.jpg';

  return (
    // Main section container:
    // - flex-col on mobile, flex-row on medium screens and up for stacking/side-by-side.
    // - justify-center and items-center for horizontal and vertical centering of columns.
    // - py-16 px-4 md:px-8 lg:px-12: More generous and responsive padding.
    // - bg-white: Changed background color to white.
    // - font-sans: Uses Tailwind's default sans-serif font stack.
    // - max-w-7xl mx-auto: Added for larger screens to limit width and center the content.
    //   - max-w-7xl (1280px): A common max-width to keep content readable on large screens.
    //   - mx-auto: Centers the block element horizontally.
    <section className="flex flex-col md:flex-row justify-center items-center py-16 px-4 md:px-8 lg:px-12 bg-white font-sans box-border w-full lg:max-w-7xl lg:mx-auto">

      {/* Left Column: Single Image */}
      {/*
        - flex justify-center: Centers the image horizontally within its own flex container (for smaller screens).
        - mb-10 md:mb-0: Bottom margin on mobile, removed on desktop when side-by-side.
        - w-full max-w-xs sm:max-w-xs: Controls max-width on smaller screens.
        - md:w-1/3 md:mr-8: Explicitly sets width to 1/3 of parent's width and adds right margin on medium screens and up.
        - lg:max-w-sm: Provides a maximum width for the image container on larger screens.
        - flex-shrink-0: Prevents the image column from shrinking.
      */}
      <div className="flex justify-center mb-10 md:mb-0 w-full max-w-xs sm:max-w-xs md:w-1/3 md:mr-8 lg:max-w-sm flex-shrink-0">
        <img
          src={mainImage}
          alt="Main illustrative image for homepage"
          // w-full: Image fills the width of its parent container.
          // h-auto: Maintains aspect ratio.
          // object-contain: Ensures the entire image is visible, even if it leaves empty space.
          // block: Removes any extra space below the image.
          // rounded-lg: Adds consistent rounded corners to the image.
          // max-h-[20rem] md:max-h-[22rem] lg:max-h-[24rem]: Adjusted max height for the image to fit content.
          className="w-full h-auto object-contain block rounded-lg max-h-[20rem] md:max-h-[22rem] lg:max-h-[24rem]"
        />
      </div>

      {/* Right Column: Content */}
      {/*
        - flex-1: Allows this column to take up remaining horizontal space on mobile.
        - text-center md:text-left: Alignment.
        - md:w-2/3: Explicitly sets width to 2/3 of parent's width on medium screens and up, achieving the desired text width.
        - md:max-w-2xl: Limits the maximum width for text readability on very large screens, preventing it from stretching too wide.
      */}
      <div className="flex-1 text-center md:text-left md:w-2/3 md:max-w-2xl">
        {/* Main Title */}
        {/*
          - text-xl md:text-2xl lg:text-3xl: Scaled font size responsively for main title (reduced).
            - Mobile: 20px
            - Medium: 24px
            - Large: 30px
          - font-bold: Makes the title bold.
          - text-[var(--Primary-Text)]: Uses CSS variable for the main text color.
          - mb-4: Adds consistent bottom margin below the title.
          - leading-tight: Ensures compact line height for titles.
        */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--Primary-Text)] mb-4 leading-tight">
          Find Your Favorite <br />
          <span className="text-[var(--Accent-text)]">Books And Premium Accounts Here!</span>
        </h2>

        {/* Description Paragraph */}
        {/*
          - text-sm md:text-base: Scaled down font size for paragraph text.
            - Mobile: 14px
            - Medium: 16px
          - text-gray-600: Default text color for description.
          - leading-relaxed: Provides comfortable line spacing for paragraphs.
          - mb-8: Bottom margin.
        */}
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
          Discover a curated collection of top-rated eBooks and exclusive premium accounts, all in one place. Whether you're here to learn, explore, or upgrade your digital lifestyle, we’ve got what you need. Fast delivery, secure access, and unbeatable value.
        </p>

        {/* Statistics Grid */}
        {/*
          - flex flex-wrap: Allows statistics items to wrap to the next line on smaller screens.
          - justify-center md:justify-start: Centers stats on mobile, aligns left on desktop.
          - gap-x-10 gap-y-5: Consistent spacing between statistic items.
          - mb-10: Bottom margin before the button.
        */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-5 mb-10">
          {/* Individual Statistic Item */}
          <div className="text-left">
            {/* Statistic Number */}
            {/*
              - block: Ensures number takes its own line.
              - text-xl md:text-2xl: Scaled down font size for numbers.
                - Mobile: 20px
                - Medium: 24px
              - font-bold text-gray-800: Styling.
            */}
            <span className="block text-xl md:text-2xl font-bold text-gray-800">800+</span>
            {/* Statistic Label */}
            {/*
              - text-xs md:text-sm: Scaled font size for labels (kept same as previous, already small).
                - Mobile: 12px
                - Medium: 14px
              - uppercase text-gray-500: Styling.
            */}
            <span className="text-xs md:text-sm uppercase text-gray-500">Book Listing</span>
          </div>
          <div className="text-left">
            <span className="block text-xl md:text-2xl font-bold text-gray-800">550+</span>
            <span className="text-xs md:text-sm uppercase text-gray-500">Register User</span>
          </div>
          <div className="text-left">
            <span className="block text-xl md:text-2xl font-bold text-gray-800">1,200+</span>
            <span className="text-xs md:text-sm uppercase text-gray-500">Books Sold</span>
          </div>
        </div>

        {/* Explore Now Button */}
        {/*
          - bg-[var(--cta-color)] hover:bg-[#218838]: Custom background color and hover effect.
          - text-white py-3 px-6 rounded-md text-base: Scaled down button text.
          - cursor-pointer transition-colors duration-300 ease-in-out: Interactive styling.
        */}
        <button className="bg-[var(--cta-color)] hover:bg-[#218838] text-white py-3 px-6 rounded-md text-base cursor-pointer transition-colors duration-300 ease-in-out">
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default Info_Homepage;