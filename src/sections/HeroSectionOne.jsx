"use client";

import { motion } from "framer-motion";
import React from 'react';
import SearchBar from '../components/SearchBar';

export default function HeroSectionOne() {
  const handleSearch = (term) => {
    console.log("Searching for:", term);
  };

  return (
    <div className="relative w-full bg-[var(--Hero-Background)] min-h-[calc(100vh-60px)] flex items-center py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-8 md:gap-12 lg:gap-16">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full lg:w-[45%] flex flex-col items-start space-y-4 md:space-y-5"
          >
            <h1 className="relative z-10 text-left text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="relative z-10 text-left text-base sm:text-lg text-neutral-600 dark:text-neutral-400"
            >
              Get access to top-quality e-Books, premium accounts, and exclusive digital bundles — all in one place.
            </motion.p>

            <SearchBar placeholder="Search for products..." onSearch={handleSearch} />
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
            className="w-full lg:w-[55%] flex justify-center px-2 sm:px-0"
          >
            <img
              src="/assets/HeroImage.jpg"
              alt="Digital Products Hero Image"
              className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}