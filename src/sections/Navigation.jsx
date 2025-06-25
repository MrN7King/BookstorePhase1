import { useState } from "react";

const Navigation = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Controls the main side panel's overall open/close
  const [currentMenuLevel, setCurrentMenuLevel] = useState('main'); // 'main' or 'books' for panel content
  const [expandedCategory, setExpandedCategory] = useState(null); // Tracks which sub-category (like 'fiction') is expanded inline

  // Function to open the main side panel
  const openPanel = () => {
    setIsPanelOpen(true);
    // Always start at the main menu level when opening the panel
    setCurrentMenuLevel('main');
    setExpandedCategory(null); // Reset any inline expansion
  };

  // Function to close the main side panel
  const closePanel = () => {
    setIsPanelOpen(false);
    // After the panel slides out, reset the menu level and expansion for next time
    setTimeout(() => {
      setCurrentMenuLevel('main');
      setExpandedCategory(null);
    }, 300); // This duration should match your transition-transform duration
  };

  // Navigate to the 'Books' sub-menu level
  const goToBooksMenu = () => {
    setCurrentMenuLevel('books');
  };

  // Navigate back to the 'Main' menu level
  const goBackToMainMenu = () => {
    setCurrentMenuLevel('main');
    setExpandedCategory(null); // Collapse any expanded category when going back
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
    // Removed border-b and border-gray-300 as per your previous request
    // Removed backdrop-blur-lg from this top div, as it's not present in example screenshots
    <div className="font-inter fixed inset-x-0 z-20 w-full bg-white/70">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Site name */}
          <a
            href="/"
            className="text-xl font-bold transition-colors text-neutral-950 hover:text-blue-800"
          >
            E-Commerce
          </a>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <img
              src="/icons/profile.svg" // Replace with actual path if different
              alt="Profile"
              className="w-6 h-6 cursor-pointer hover:opacity-75"
            />
            <img
              src="/icons/Vector.svg" // Replace with actual path if different
              alt="Cart"
              className="w-6 h-6 cursor-pointer hover:opacity-75"
            />
            <button
              onClick={openPanel} // Open the main slide-in panel
              className="flex cursor-pointer text-neutral-950 hover:text-black focus:outline-none"
            >
              <img
                src={isPanelOpen ? "/icons/close.svg" : "/icons/menu.svg"} // Replace with actual paths
                alt="toggle"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

     
     <div
  className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
    isPanelOpen ? "translate-x-0" : "translate-x-full"
  } overflow-hidden`}
>
        <div className={`absolute inset-0 transition-transform duration-300 ${
          currentMenuLevel === 'main' ? 'translate-x-0' : '-translate-x-full'
        }`}>
         <br/>
          <div className="flex items-center justify-between p-4">
            <span className=" text-2xl font-bold text-black-800">MENU</span>
            <button onClick={closePanel} className="hover:opacity-70">
              <img src="/icons/close.svg" alt="Close" className="w-8 h-8" />
            </button>
          </div>
          
          <ul className="flex flex-col text-lg p-4"> 
            <li className="py-2">
              <button
                onClick={goToBooksMenu} // Navigates to the 'Books' sub-menu
                className="flex items-center justify-between w-full text-2xl font-semibold uppercase hover:text-sky-500"
              >
                BOOKS <span className="ml-2 text-3xl">›</span> 
              </button>
            </li>
            
            <li className="py-2">
              <a href="#events" className="flex items-center justify-between text-2xl  w-full font-semibold uppercase hover:text-sky-500" onClick={handleMenuItemClick}>
                PREMUIM ACCOUNTS<span className="ml-2 text-3xl">›</span>
              </a>
            </li>
            {/* Separator or just spacing */}
            <li className="mt-4 border-t border-gray-200 pt-4"></li>

           <div className="flex items-center justify-between p-3">
            <span className=" text-1xl  text-black-800">Profile</span>
              <img src="/icons/profile.svg" alt="Close" className="w-8 h-8" /> 
          </div>

          <div className="flex items-center justify-between p-3">
            <span className=" text-1xl text-black-800">Contact Us</span>
              <img src="/icons/phone.svg" alt="Close" className="w-8 h-8" />
          </div>

            
          </ul>
        </div>

        {/*
          Books Sub-Menu Level Content.
          This panel slides into view when `currentMenuLevel` is 'books'.
        */}
        <div className={`absolute inset-0 transition-transform duration-300 ${
          currentMenuLevel === 'books' ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Books Menu Header with Back Button */}<br/>
        <div className="flex items-center justify-between p-4 ">
          <button onClick={goBackToMainMenu} className="hover:opacity-70 flex items-center text-left">
            <span className="mr-2 font-bold text-4xl">‹</span> {/* Back arrow */}
            <span className="mt-2 text-2xl font-semibold text-gray-800">BOOKS</span> {/* Heading */}
          </button>
          {/* ADDED p-2 to the button below */}
          <button onClick={closePanel} className="hover:opacity-70 p-2">
            <img src="/icons/close.svg" alt="Close" className="w-8 h-8 mt-3"  /> {/* Replace with actual path */}
          </button>
        </div>
          <ul className="flex flex-col text-lg p-4">
            <li className="py-2">
              <a href="#viewallbooks" className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>View All BOOKS</a>
            </li>
            {/* Expandable Categories */}
            <li className="py-2">
              <button
                onClick={() => toggleCategoryExpansion('featured')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                FEATURED <span className="ml-2 text-xl">{expandedCategory === 'featured' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'featured' && (
                <ul className="ml-4 mt-2 space-y-1 text-md">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>New Releases</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Bestsellers</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Staff Picks</li>
                </ul>
              )}
            </li>
            <li className="py-2">
              <button
                onClick={() => toggleCategoryExpansion('fiction')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                FICTION <span className="ml-2 text-xl">{expandedCategory === 'fiction' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'fiction' && (
                <ul className="ml-4 mt-2 space-y-1 text-md">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Fantasy</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Sci-Fi</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Mystery</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Thriller</li>
                </ul>
              )}
            </li>
            <li className="py-2">
              <button
                onClick={() => toggleCategoryExpansion('non-fiction')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                NON-FICTION <span className="ml-2 text-xl">{expandedCategory === 'non-fiction' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'non-fiction' && (
                <ul className="ml-4 mt-2 space-y-1 text-md">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Biography</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>History</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Science</li>
                </ul>
              )}
            </li>
            <li className="py-2">
              <button
                onClick={() => toggleCategoryExpansion('kids')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                KIDS <span className="ml-2 text-xl">{expandedCategory === 'kids' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'kids' && (
                <ul className="ml-4 mt-2 space-y-1 text-md">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Picture Books</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Chapter Books</li>
                </ul>
              )}
            </li>
            <li className="py-2">
              <button
                onClick={() => toggleCategoryExpansion('young-adult')}
                className="flex items-center justify-between w-full font-bold uppercase hover:text-sky-500"
              >
                YOUNG ADULT <span className="ml-2 text-xl">{expandedCategory === 'young-adult' ? '-' : '+'}</span>
              </button>
              {expandedCategory === 'young-adult' && (
                <ul className="ml-4 mt-2 space-y-1 text-1xl">
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Fantasy YA</li>
                  <li className="hover:text-sky-500 cursor-pointer" onClick={handleMenuItemClick}>Contemporary YA</li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </div>

      {/* NO OVERLAY: Removed the fixed inset-0 overlay div, as the background should not be affected */}
    </div>
  );
};

export default Navigation;