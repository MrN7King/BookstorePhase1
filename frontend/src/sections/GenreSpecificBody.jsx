// src/sections/GenreSpecificBody.jsx
"use client"; // If using Next.js app router

import axios from 'axios'; // Import axios for API calls
import { useCallback, useEffect, useState } from 'react'; // Import React, useEffect, useCallback
import { useLocation, useParams } from 'react-router-dom'; // Import useParams and useLocation for genre

import { AllBooksFilter } from '../components/AllBooksFilter';
import CardsDisplay from '../components/CardsDisplay';

export default function GenreSpecificBody() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [books, setBooks] = useState([]); // State to hold the fetched books
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [appliedFilters, setAppliedFilters] = useState({}); // State to store currently applied filters

  const { genre } = useParams(); // Get genre from URL parameter (e.g., /genre/:genreName)
  const location = useLocation(); // To get query parameters if needed

  // Function to open the filter modal
  const openFilterMenu = useCallback(() => {
    setIsFilterMenuOpen(true);
  }, []);

  // Function to close the filter modal
  const closeFilterMenu = useCallback(() => {
    setIsFilterMenuOpen(false);
  }, []);

  // Function to apply filters and trigger data fetch
  const handleApplyFilters = useCallback((filters) => {
    console.log("Filters applied:", filters);
    // Update the appliedFilters state, which will trigger the useEffect
    setAppliedFilters(prevFilters => ({
      ...prevFilters, // Keep existing filters if not overwritten
      ...filters,
      // Ensure genre is always included if available from URL
      categories: genre ? [genre] : (filters.categories || []), // Pass genre as a category filter
    }));
    closeFilterMenu(); // Close the filter menu after applying filters
  }, [closeFilterMenu, genre]);


  // Effect to fetch books when component mounts or filters change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct query parameters for your backend's getFilteredAndSearchedEbooks endpoint
        const queryParams = new URLSearchParams();

        // Apply filters from state
        for (const key in appliedFilters) {
          if (appliedFilters[key] !== undefined && appliedFilters[key] !== null && appliedFilters[key] !== '') {
            // Handle array filters (like categories, language, format)
            if (Array.isArray(appliedFilters[key])) {
              if (appliedFilters[key].length > 0) {
                queryParams.append(key, appliedFilters[key].join(','));
              }
            } else {
              queryParams.append(key, appliedFilters[key]);
            }
          }
        }

        // Add the genre from URL as a category filter if it exists and not already in filters
        // This ensures the page always displays books for its specific genre
        if (genre && !queryParams.has('categories')) {
            queryParams.append('categories', genre);
        } else if (genre && queryParams.has('categories')) {
            // If categories already exists, append genre to it if not already present
            let existingCategories = queryParams.get('categories').split(',');
            if (!existingCategories.includes(genre)) {
                queryParams.set('categories', [...existingCategories, genre].join(','));
            }
        }


        // Make the API call
        // Assuming your filtered endpoint is /api/productEbook/filtered
        const response = await axios.get(`http://localhost:5000/api/productEbook/filtered?${queryParams.toString()}`);

        setBooks(response.data.ebooks); // Assuming your backend returns { ebooks: [...] }
      } catch (err) {
        console.error("Error fetching filtered ebooks:", err);
        setError("Failed to load books. Please try again.");
        setBooks([]); // Clear books on error
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    // Re-fetch books whenever appliedFilters or genre changes
  }, [appliedFilters, genre]);


  return (
    <div className="min-h-screen bg-White font-sans antialiased flex flex-col">

      {/* Mobile "Filter By" Button - positioned as a fixed element on the top right */}
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
      <div className="flex flex-1 relative">
        {/* Filter Component (Desktop Sidebar) */}
        <aside className="hidden lg:block lg:w-1/4 lg:max-w-xs p-4 overflow-y-auto">
          {/* Pass initial filters and a callback to update them */}
          <AllBooksFilter
            initialFilters={appliedFilters} // Pass current filters to initialize
            onApplyFilters={handleApplyFilters}
            onClose={() => {}} // Desktop sidebar doesn't need to close itself like a modal
            showCategories={false} // Assuming categories are handled by the genre URL
          />
        </aside>

        {/* Main Content - Books Display */}
        <main className="flex-1 p-4 lg:p-8">
          {loading && <p className="text-center text-gray-600">Loading books...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && books.length === 0 && (
            <p className="text-center text-gray-600">No books found for this genre or with the applied filters.</p>
          )}
          {!loading && !error && books.length > 0 && (
            <CardsDisplay books={books} /> // Pass the fetched books to CardsDisplay
          )}
        </main>
      </div>

      {/* Full-screen Filter Modal for Mobile */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto flex flex-col">
          <AllBooksFilter
            initialFilters={appliedFilters} // Pass current filters to initialize
            onClose={closeFilterMenu}
            onApplyFilters={handleApplyFilters}
            showCategories={false} // Assuming categories are handled by the genre URL
          />
        </div>
      )}
    </div>
  );
}