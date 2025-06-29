import React, { useState } from 'react';

// Main App component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      <AllBooksFilter />
    </div>
  );
}

const AllBooksFilter = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for price range
  const [priceRange, setPriceRange] = useState([100, 10000]);
  // State for selected languages
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  // State for selected formats
  const [selectedFormats, setSelectedFormats] = useState([]);

  // State for collapsing filter sections
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isFormatOpen, setIsFormatOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // Initially collapsed

  const languages = ['English', 'Tamil', 'Sinhala'];
  const formats = ['E-Book', 'Audiobook'];
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography']; // Example categories

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle price range change (simple slider logic)
  const handlePriceChange = (e) => {
    // For a real slider, you'd use a library or more complex logic
    // This is a simplified representation.
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]); // Only updating max for simplicity
  };

  // Handle language checkbox change
  const handleLanguageChange = (language) => {
    setSelectedLanguages((prevSelected) =>
      prevSelected.includes(language)
        ? prevSelected.filter((lang) => lang !== language)
        : [...prevSelected, language]
    );
  };

  // Handle format checkbox change
  const handleFormatChange = (format) => {
    setSelectedFormats((prevSelected) =>
      prevSelected.includes(format)
        ? prevSelected.filter((fmt) => fmt !== format)
        : [...prevSelected, format]
    );
  };

  // Generic function to toggle section visibility
  const toggleSection = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Books</h1>
        {/* Dropdown arrow for "All Books" - functional if categories were dynamic */}
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* Filters Section */}
      <h2 className="text-sm font-semibold uppercase text-gray-500 mb-4">Filters</h2>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for Books..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsPriceOpen)}
        >
          Price
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
              isPriceOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isPriceOpen && (
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>LKR{priceRange[0]}</span>
              <span>LKR{priceRange[1]}</span>
            </div>
            {/* Simple range input - for a true slider, use a dedicated component */}
            <input
              type="range"
              min="100"
              max="10000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(priceRange[1] - 100) / 99}% , #D1D5DB ${(priceRange[1] - 100) / 99}% , #D1D5DB 100%)`
              }}
            />
          </div>
        )}
      </div>

      {/* Language Filter */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsLanguageOpen)}
        >
          Language
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
              isLanguageOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isLanguageOpen && (
          <div className="mt-4 space-y-3">
            {languages.map((language) => (
              <label key={language} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                />
                <span className="ml-3 text-base text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Format Filter */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsFormatOpen)}
        >
          Format
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
              isFormatOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isFormatOpen && (
          <div className="mt-4 space-y-3">
            {formats.map((format) => (
              <label key={format} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleFormatChange(format)}
                />
                <span className="ml-3 text-base text-gray-700">{format}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories Filter (collapsed by default) */}
      <div className="mb-0">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsCategoriesOpen)}
        >
          Categories
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
              isCategoriesOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isCategoriesOpen && (
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  // Add state and handler for categories if needed
                />
                <span className="ml-3 text-base text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
