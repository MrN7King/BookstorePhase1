
"use client";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {

  const navigate = useNavigate();
  
    const handleGoAllBooks = () => {
      navigate('/AllBooks'); // Redirects to the root of your application, which should render Home.jsx
    };

    const handleGoCart = () => {
      navigate('/Cart'); // Redirects to the root of your application, which should render Home.jsx
    };
  

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMenuLevel, setCurrentMenuLevel] = useState('main');
  const [expandedCategory, setExpandedCategory] = useState(null); 

 
  const openPanel = () => {
    setIsPanelOpen(true);
    setCurrentMenuLevel('main');
    setExpandedCategory(null); // Reset any inline expansion
  };

  // Function to close the main side panel
  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setCurrentMenuLevel('main');
      setExpandedCategory(null);
    }, 300);
  };

  // Navigate to the 'Books' sub-menu level
  const goToBooksMenu = () => {
    setCurrentMenuLevel('books');
  };

  // Navigate back to the 'Main' menu level
  const goBackToMainMenu = () => {
    setCurrentMenuLevel('main');
    setExpandedCategory(null); 
  };

  // Toggle inline expansion for categories like Fiction, Non-Fiction
  const toggleCategoryExpansion = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Helper to close the panel when a final menu item is clicked
  const handleMenuItemClick = () => {
    closePanel();
  };

  return (
    <div className="font-inter top-0 fixed inset-x-0 z-50 w-full bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <a
            href="/"
            className="text-xl font-bold transition-colors text-neutral-950 hover:text-blue-800"
          >
            E-Commerce
          </a>
          <div className="flex items-center gap-4 ">
            <img
              src="/icons/profile.svg"
              alt="Profile"
              className="w-6 h-6 cursor-pointer hover:opacity-75"
            />
            <img
              src="/icons/Vector.svg"
              alt="Cart"
              onClick={handleGoCart}
              className="w-6 h-6 cursor-pointer hover:opacity-75"
            />
            <button
              onClick={openPanel}
              className="flex cursor-pointer text-neutral-950 hover:text-black focus:outline-none"
            >
              <img
                src={isPanelOpen ? "/icons/close.svg" : "/icons/menu.svg"}
                alt="toggle"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Side Panel Container */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        
        <div className={`absolute inset-0 transition-transform duration-300 ${
          currentMenuLevel === 'main' ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-20 mt-2 ">
            <span className="text-2xl font-bold text-gray-800">MENU</span>
            <button onClick={closePanel} className="hover:opacity-70 p-2">
              <img src="/icons/close.svg" alt="Close" className="w-8 h-8" />
            </button>
          </div>
         
          <ul className="flex flex-col text-lg pt-4 pb-4">
            <li className="py-2 px-4">
              <button
                onClick={goToBooksMenu}
                className="flex items-center justify-between w-full text-2xl font-bold uppercase hover:text-sky-500">
                BOOKS <span className="ml-2 text-3xl">›</span>
              </button>
            </li>
            <li className="py-2 px-4">
              <a href="#subscriptions" className="flex items-center justify-between text-2xl w-full font-bold uppercase hover:text-sky-500" onClick={handleMenuItemClick}>
                SUBSCRIPTIONS<span className="ml-2 text-3xl">›</span>
              </a>
            </li>
            <li className="mt-4 border-t border-gray-200 pt-4 px-4"></li>

            <div className="flex items-center justify-between py-3 px-4 cursor-pointer ">
              
              <span className="text-base text-gray-800 hover:text-sky-500">Profile</span>
              <img src="/icons/profile.svg" alt="Profile" className="w-8 h-8 " />
            </div>

            <div className="flex items-center justify-between py-3 px-4 cursor-pointer">
              <span className="text-base text-gray-800 hover:text-sky-500">Contact Us</span>
              <img src="/icons/phone.svg" alt="Contact" className="w-8 h-8" />
            </div>
          </ul>
        </div>

        {/* Books Sub-Menu Level Content Wrapper */}
        <div className={`absolute inset-0 transition-transform duration-300 ${
          currentMenuLevel === 'books' ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Books Menu Header with Back Button - also sticks to the top */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-20">
            <button onClick={goBackToMainMenu} className="hover:opacity-70 flex items-center text-left">
              <span className="mr-2 font-bold text-4xl">‹</span>
              <span className="text-2xl font-semibold text-gray-800 mt-2">BOOKS</span>
            </button>
            <button onClick={closePanel} className="hover:opacity-70 p-2 mt-2.5">
              <img src="/icons/close.svg" alt="Close" className="w-8 h-8" />
            </button>
          </div>
          {/* Books Menu Items List */}
          <ul className="flex flex-col text-lg pt-4 pb-4">
            <li className="py-2 px-4">
              <label className="hover:text-sky-500 cursor-pointer" onClick={handleGoAllBooks}>All BOOKS</label>
            </li>
            <li className="py-2 px-4">
              <button
                onClick={() => toggleCategoryExpansion('featured')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                FEATURED <span className="ml-2 text-2xl">{expandedCategory === 'featured' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'featured' && (
                <ul className="ml-4 mt-2 space-y-1 text-md pl-4">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>New Releases</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Bestsellers</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Staff Picks</li>
                </ul>
              )}
            </li>
            <li className="py-2 px-4">
              <button
                onClick={() => toggleCategoryExpansion('fiction')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                FICTION <span className="ml-2 text-2xl">{expandedCategory === 'fiction' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'fiction' && (
                <ul className="ml-4 mt-2 space-y-1 text-md pl-4">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Fantasy</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Sci-Fi</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Mystery</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Thriller</li>
                </ul>
              )}
            </li>
            <li className="py-2 px-4">
              <button
                onClick={() => toggleCategoryExpansion('non-fiction')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                NON-FICTION <span className="ml-2 text-2xl">{expandedCategory === 'non-fiction' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'non-fiction' && (
                <ul className="ml-4 mt-2 space-y-1 text-md pl-4">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Biography</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>History</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Science</li>
                </ul>
              )}
            </li>
            <li className="py-2 px-4">
              <button
                onClick={() => toggleCategoryExpansion('kids')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                KIDS <span className="ml-2 text-2xl">{expandedCategory === 'kids' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'kids' && (
                <ul className="ml-4 mt-2 space-y-1 text-md pl-4">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Picture Books</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Chapter Books</li>
                </ul>
              )}
            </li>
            <li className="py-2 px-4">
              <button
                onClick={() => toggleCategoryExpansion('young-adult')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                YOUNG ADULT <span className="ml-2 text-2xl">{expandedCategory === 'young-adult' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'young-adult' && (
                <ul className="ml-4 mt-2 space-y-1 text-base pl-4">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Fantasy YA</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Contemporary YA</li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
