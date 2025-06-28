"use client";
import React from 'react';

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div
      className="flex items-center rounded-lg w-full max-w-xl md:max-w-2xl"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.85)',
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="px-4 py-2 bg-white rounded-l-lg focus:outline-none flex-grow"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)'
        }}
      />
      <button
        onClick={handleSearchClick}
        className="px-4 py-2 bg-[var(--cta-color)] text-white rounded-r-lg hover:bg-[#218838] transition"
        style={{ width: 'auto' }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
