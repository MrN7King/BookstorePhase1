// src/sections/AllBooksBody.jsx
"use client"; // If using Next.js app router

import React, { useState } from 'react';
// Corrected import paths to use relative paths instead of alias
import AllBooksFilter from '@/components/AllBooksFilter'; // Path: src/app/page.jsx -> ../sections/filter.jsx
import BooksDisplay from '../components/CardsDisplay'; // Path: src/app/page.jsx -> ../components/CardsDisplay.jsx

export default function HomePage() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Function to open the filter modal
  const openFilterMenu = () => {
    setIsFilterMenuOpen(true);
  };

  // Function to close the filter modal
  const closeFilterMenu = () => {
    setIsFilterMenuOpen(false);
  };

  // Dummy function for when filters are applied (e.g., from the modal)
  const handleApplyFilters = (filters) => {
    console.log("Filters applied from modal:", filters);
    // Here you would typically update your main data fetching logic
    // based on these filters.
    // The filter modal will close itself via the onClose prop passed to AllBooksFilter
  };

  return (
    <div className="min-h-screen bg-White font-sans antialiased flex flex-col">
      {/* Tailwind CSS CDN for global styles */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      {/* Font for consistency */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      {/* Mobile "Filter By" Button - positioned as a fixed element on the top right */}
      {/* This button is only visible on small screens */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={openFilterMenu}
          className="flex items-center justify-center space-x-2 mt-16 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Open filters"
        >
          <span className="font-semibold text-lg">Filter By</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-360 280-560h400L480-360Z"/></svg>
        </button>
      </div>

      {/* Main content area */}
      {/* Removed padding-top as there's no sticky header added by this component */}
      <div className="flex flex-1 relative">
        {/* Filter Component (Desktop Sidebar) */}
        {/* This filter is always visible on large screens (lg and up) */}
        <aside className="hidden lg:block lg:w-1/4 lg:max-w-xs p-4 overflow-y-auto">
          {/* On desktop, the AllBooksFilter is a sidebar, so it doesn't need onClose or onApplyFilters to close itself */}
          <AllBooksFilter onApplyFilters={handleApplyFilters} />
        </aside>

        {/* Main Content - Books Display */}
        <main className="flex-1 p-4 lg:p-8">
          <BooksDisplay />
        </main>
      </div>

      {/* Full-screen Filter Modal for Mobile */}
      {/* This modal covers the entire screen when active on small devices */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto flex flex-col">
          <AllBooksFilter onClose={closeFilterMenu} onApplyFilters={handleApplyFilters} />
        </div>
      )}
    </div>
  );
}
