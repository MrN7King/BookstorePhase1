import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/sections/Navigation'; // Adjust the import path as necessary

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirects to the root of your application, which should render Home.jsx
  };

  return (
    <>
      {/* Assuming Navigation needs to be part of the layout for the entire page */}
      <div className='container mx-auto pt-16 overflow-hidden'>
        <Navigation />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 py-8">
        <h1 className="text-8xl md:text-9xl font-bold text-red-500 mb-6 select-none">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
          Oops! Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed">
          It seems like you've wandered off the path. The page you're
          looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={handleGoHome}
          className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium text-lg rounded-md shadow-lg
                     hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
                     transition ease-in-out duration-300 transform hover:scale-105"
        >
          {/* SVG for a home icon from Google Material Icons/Symbols */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px" // Equivalent to text-xl for icon
            viewBox="0 0 24 24"
            width="24px" // Equivalent to text-xl for icon
            fill="currentColor" // Use 'currentColor' to inherit text color
            className="mr-3" // Tailwind class for right margin
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Back to Home
        </button>
      </div>
    </>
  );
};

export default PageNotFound;