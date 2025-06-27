"use client";
import { motion } from "motion/react";

export default function HeroSectionOne() {
  return (
    // Adjust height to account for navbar, and add more responsive vertical padding
    // Increased py- for all breakpoints, especially mobile.
    <div className="relative w-full bg-[var(--Hero-Background)] min-h-[calc(100vh-60px)] flex items-center py-16 md:py-20 lg:py-24 xl:py-28"> {/* Adjusted py- values for more vertical space */}
      {/* Inner container: Centers content, now with more flexible max-width and increased horizontal padding */}
      {/* Removed specific max-w at the largest breakpoints to allow full width, relying on px for gutters */}
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-full px-6 sm:px-8 lg:px-16 xl:px-24"> {/* Adjusted max-w and px */}

        {/* Main TWO-COLUMN container */}
        <div className="flex flex-col md:flex-row w-full items-center justify-between md:gap-16 lg:gap-24">

          {/* LEFT COLUMN: Contains Heading, Paragraph, and Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col items-start space-y-4 md:space-y-5 lg:space-y-6 mb-8 md:mb-0"
          >
            {/* Heading */}
            <h1 className="relative z-10 max-w-full text-left text-2xl font-bold md:text-3xl lg:text-5xl xl:text-6xl">
              {"Buy Digital Products for the Best Prices"
                .split(" ")
                .map((word, index) => {
                  const textColor =
                    index <= 3
                      ? "text-[var(--Primary-Text)]"
                      : "text-[var(--Accent-text)]";

                  return (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeInOut",
                      }}
                      className={`mr-2 inline-block ${textColor}`}
                    >
                      {word}
                    </motion.span>
                  );
                })}
            </h1>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="relative z-10 max-w-xl text-left text-lg font-normal text-neutral-600 dark:text-neutral-400"
            >
              Get access to top-quality e-Books, premium accounts, and exclusive digital bundles — all in one place.
            </motion.p>

            {/* Search bar */}
            <div
              className="flex items-center rounded-lg w-full max-w-xl md:max-w-2xl"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.85)',
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 bg-white rounded-l-lg focus:outline-none flex-grow"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 1)'
                }}
              />
              <button
                className="px-4 py-2 bg-[var(--cta-color)] text-white rounded-r-lg hover:bg-[#218838] transition"
                style={{ width: 'auto' }}
              >
                Search
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contains the Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
            className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0"
          >
            <img
              src="/assets/HeroImage.jpg"
              alt="Digital Products Hero Image"
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-lg" // More precise max-w for image scaling
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}