"use client";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react"; // Import useEffect
import { useNavigate } from 'react-router-dom';
import LoginPage from '../sections/LoginPage'; // Corrected import path

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000/api/user";
const USER_API_BASE_URL = "http://localhost:5000/api/auth";

const Navigation = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const profileRef = useRef(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMenuLevel, setCurrentMenuLevel] = useState('main');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const generateAvatarColor = useCallback((email) => {
    if (!email) return '#cccccc';
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }, []);

  const checkLoginStatusAndFetchUserData = useCallback(async () => {
    try {
      // Step 1: Check authentication (cookie sent automatically)
      const authResponse = await axios.post(
        `${USER_API_BASE_URL}/is-auth`,
        {},
        { withCredentials: true }
      );

      if (authResponse.data.success) {
        setIsLoggedIn(true);

        // Step 2: Fetch user data
        const userResponse = await axios.get(`${USER_API_BASE_URL}/data`, {
          withCredentials: true,
        });

        if (userResponse.data.success && userResponse.data.user?.email) {
          setUserEmail(userResponse.data.user.email);
        } else {
          console.error("Failed to fetch user email or user data is incomplete.");
          setIsLoggedIn(false);
          setUserEmail(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error.response?.data || error.message);
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  }, []); // Dependencies are empty as we want it to run once on mount

  // NEW: Call checkLoginStatusAndFetchUserData on component mount
  useEffect(() => {
    checkLoginStatusAndFetchUserData();
  }, [checkLoginStatusAndFetchUserData]); // Add checkLoginStatusAndFetchUserData to dependencies for useCallback stability

  const handleGoCart = () => {
    navigate('/Cart');
    closePanel();
  };

  const handleGoAllBooks = () => {
    navigate('/AllBooks');
    closePanel();
  };

  const openPanel = () => {
    setIsPanelOpen(true);
    setCurrentMenuLevel('main');
    setExpandedCategory(null);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setCurrentMenuLevel('main');
      setExpandedCategory(null);
    }, 300);
  };

  const goToBooksMenu = () => {
    setCurrentMenuLevel('books');
  };

  const goBackToMainMenu = () => {
    setCurrentMenuLevel('main');
    setExpandedCategory(null);
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleMenuItemClick = () => {
    closePanel();
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    // This call is still correct for when the modal is closed after a manual login
    checkLoginStatusAndFetchUserData();
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/logout`);
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserEmail(null);
        closePanel();
        setShowProfileOptions(false);
        navigate('/');
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowProfileOptions(prev => !prev);
    } else {
      openLoginModal();
    }
  };

  const handleProfileSettingsClick = () => {
    setShowProfileOptions(false);
    navigate('/ProfileSettings');
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
          {/* Added relative to this div to correctly position the absolute dropdown */}
          <div className="flex items-center gap-4 relative">
            {isLoggedIn && userEmail ? (
              // Display avatar with first letter if logged in
              <div
                ref={profileRef} // Attach ref here
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: generateAvatarColor(userEmail) }}
                onClick={handleProfileClick} // Use new handler
                title={userEmail}
              >
                {userEmail.charAt(0).toUpperCase()}
              </div>
            ) : (
              // Display default profile icon if not logged in
              <img
                src="/icons/profile.svg"
                alt="Profile"
                className="w-6 h-6 cursor-pointer hover:opacity-75"
                onClick={openLoginModal} // Open login modal on profile click
              />
            )}

            {showProfileOptions && isLoggedIn && (
              <div className="mt-30 absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 pointer-events-auto"> {/* Increased z-index, added border, ensured pointer-events-auto */}
                <button
                  onClick={handleProfileSettingsClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none" // Added cursor-pointer and focus:outline-none
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer focus:outline-none" // Added cursor-pointer and focus:outline-none
                >
                  Logout
                </button>
              </div>
            )}

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
              <img src="/icons/close.svg" alt="Close" className="w-8 h-8 cursor-pointer" />
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
              <a href="#subscriptions" className="flex items-center justify-between w-full text-2xl font-bold uppercase hover:text-sky-500" onClick={handleMenuItemClick}>
                SUBSCRIPTIONS<span className="ml-2 text-3xl">›</span>
              </a>
            </li>
            <li className="mt-4 border-t border-gray-200 pt-4 px-4"></li>

            {isLoggedIn && userEmail ? (
              <>
                <div className="flex items-center justify-between py-3 px-4">
                  <span className="text-base text-gray-800 font-semibold truncate cursor-pointer hover:text-sky-500" onClick={handleProfileSettingsClick}>
                    Profile Settings
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: generateAvatarColor(userEmail) }}
                    title={userEmail}
                  >
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="py-3 px-4">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-base text-red-600 hover:underline font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between py-3 px-4 cursor-pointer " onClick={openLoginModal}>
                <span className="text-base text-gray-800 hover:text-sky-500">Profile</span>
                <img src="/icons/profile.svg" alt="Profile" className="w-8 h-8 " />
              </div>
            )}

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
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-20">
            <button onClick={goBackToMainMenu} className="hover:opacity-70 flex items-center text-left">
              <span className="mr-2 font-bold text-4xl">‹</span>
              <span className="text-2xl font-semibold text-gray-800 mt-2">BOOKS</span>
            </button>
            <button onClick={closePanel} className="hover:opacity-70 p-2 mt-2.5">
              <img src="/icons/close.svg" alt="Close" className="w-8 h-8" />
            </button>
          </div>
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

      {/* LoginPage Modal */}
      <LoginPage isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default Navigation;
