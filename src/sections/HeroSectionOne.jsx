"use client";
import { motion } from "motion/react";

export default function HeroSectionOne() {
  return (
    <div className="relative w-full bg-[var(--Hero-Background)] py-10 md:py-20">
      {/* Inner container: This div centers your content and limits its max-width. */}
      <div className="mx-auto max-w-7xl px-4">

        {/* Main TWO-COLUMN container */}
        <div className="flex flex-col md:flex-row w-full items-center justify-between md:gap-8 lg:gap-16">

          {/* LEFT COLUMN: Contains Heading, Paragraph, and Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col items-start space-y-6 mb-8 md:mb-0"
          >
            {/* Heading */}
            <h1 className="relative z-10 max-w-full text-left text-2xl font-bold md:text-3xl lg:text-5xl xl:text-6xl py-2 md:py-4 lg:py-6"> {/* Adjusted text sizes & added padding */}
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
              // Increased responsive padding-y for desktop
              className="relative z-10 max-w-xl text-left text-lg font-normal text-neutral-600 dark:text-neutral-400 py-2 md:py-4 lg:py-8" 
            >
              Get access to top-quality e-Books, premium accounts, and exclusive digital bundles — all in one place.
            </motion.p>

            {/* Search bar */}
            <div
              className="flex items-center rounded-lg max-w-full mt-4"
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
                className="px-4 py-2 bg-[var(--cta-color)] text-white rounded-r-lg hover:bg-emerald-500 transition"
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
              className="max-w-md h-auto rounded-lg"
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}