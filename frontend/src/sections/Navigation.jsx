"use client";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import LoginPage from "../sections/LoginPage";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000/api/user";
const USER_API_BASE_URL = "http://localhost:5000/api/auth";

const Navigation = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const profileRef = useRef(null);

  // Cart item count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Avatar background generator
  const generateAvatarColor = useCallback((email) => {
    if (!email) return "#cccccc";
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }, []);

  // Listen for profile picture updates
  useEffect(() => {
    const handleProfilePictureUpdate = (event) => {
      if (event.detail?.profilePicture) {
        setUserProfilePicture(event.detail.profilePicture);
      }
    };
    window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate);
    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate);
    };
  }, []);

  // Check login status
  const checkLoginStatusAndFetchUserData = useCallback(async () => {
    try {
      const authResponse = await axios.post(`${USER_API_BASE_URL}/is-auth`, {}, { withCredentials: true });
      if (authResponse.data.success) {
        setIsLoggedIn(true);
        const userResponse = await axios.get(`${USER_API_BASE_URL}/data`, { withCredentials: true });
        if (userResponse.data.success && userResponse.data.user) {
          const user = userResponse.data.user;
          setUserEmail(user.email);
          setUserProfilePicture(user.profilePicture || null);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
          setUserProfilePicture(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
        setUserProfilePicture(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error.response?.data || error.message);
      setIsLoggedIn(false);
      setUserEmail(null);
      setUserProfilePicture(null);
    }
  }, []);

  useEffect(() => {
    checkLoginStatusAndFetchUserData();
  }, [checkLoginStatusAndFetchUserData]);

  // Panel controls
  const openPanel = () => {
    setIsPanelOpen(true);
    setExpandedMenu(null);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setExpandedMenu(null);
  };

  // Navigation handlers
  const handleMenuItemClick = (path) => {
    navigate(path);
    closePanel();
  };

  const handleGoCart = () => handleMenuItemClick("/Cart");
  const handleGoAllBooks = () => handleMenuItemClick("/AllBooks");
  const handleGoFeaturedBooks = () => handleMenuItemClick("/Books");
  const handleGoAllPremium = () => handleMenuItemClick("/AllPremiumAccounts");
  const gotoContactUs = () => handleMenuItemClick("/contactus");
  const gotoAboutUs = () => handleMenuItemClick("/aboutus");

  // Auth handlers
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    checkLoginStatusAndFetchUserData();
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/logout`);
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserEmail(null);
        setUserProfilePicture(null);
        closePanel();
        setShowProfileOptions(false);

        localStorage.removeItem("guest_cart_v1");
        window.dispatchEvent(new Event("authChanged"));
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowProfileOptions((prev) => !prev);
    } else {
      openLoginModal();
    }
  };

  const handleProfileSettingsClick = () => {
    setShowProfileOptions(false);
    navigate("/ProfileSettings");
  };

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <div className="font-inter top-0 fixed inset-x-0 z-50 w-full bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <a href="/" className="text-xl font-bold transition-colors text-neutral-950 hover:text-blue-800">
            Eleganzilla
          </a>
          <div className="flex items-center gap-4 relative">
            {/* Profile */}
            {isLoggedIn && userEmail ? (
              userProfilePicture ? (
                <img
                  src={userProfilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 object-cover"
                  onClick={handleProfileClick}
                />
              ) : (
                <div
                  ref={profileRef}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: generateAvatarColor(userEmail) }}
                  onClick={handleProfileClick}
                  title={userEmail}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </div>
              )
            ) : (
              <img
                src="/icons/profile.svg"
                alt="Profile"
                className="w-6 h-6 cursor-pointer hover:opacity-75"
                onClick={openLoginModal}
              />
            )}

            {showProfileOptions && isLoggedIn && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                <button
                  onClick={handleProfileSettingsClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Cart */}
            <div className="relative cursor-pointer" onClick={handleGoCart}>
              <img src="/icons/Vector.svg" alt="Cart" className="w-6 h-6 hover:opacity-75" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Menu Button */}
            <button onClick={openPanel} className="flex cursor-pointer text-neutral-950">
              <img src={isPanelOpen ? "/icons/close.svg" : "/icons/menu.svg"} alt="toggle" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-20">
          <span className="text-2xl font-bold text-gray-800">MENU</span>
          <button onClick={closePanel} className="hover:opacity-70 p-2">
            <img src="/icons/close.svg" alt="Close" className="w-8 h-8" />
          </button>
        </div>

        <ul className="flex flex-col text-lg pt-4 pb-4">
          {/* Books Dropdown */}
          <li className="py-2 px-4">
            <button
              onClick={() => toggleMenu("books")}
              className="flex items-center justify-between w-full text-2xl font-bold uppercase hover:text-sky-500"
            >
              BOOKS
              <span className="ml-2 text-3xl">
                {expandedMenu === "books" ? "˅" : "›"}
              </span>
            </button>
            {expandedMenu === "books" && (
              <ul className="mt-2 ml-4 space-y-2">
                <li>
                  <button
                    onClick={handleGoAllBooks}
                    className="w-full text-left font-medium hover:text-sky-500"
                  >
                    All Books
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleGoFeaturedBooks}
                    className="w-full text-left font-medium hover:text-sky-500"
                  >
                    Featured Books
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Subscriptions Dropdown */}
          <li className="py-2 px-4">
            <button
              onClick={() => toggleMenu("subscriptions")}
              className="flex items-center justify-between w-full text-2xl font-bold uppercase hover:text-sky-500"
            >
              SUBSCRIPTIONS
              <span className="ml-2 text-3xl">
                {expandedMenu === "subscriptions" ? "˅" : "›"}
              </span>
            </button>
            {expandedMenu === "subscriptions" && (
              <ul className="mt-2 ml-4 space-y-2">
                <li>
                  <button
                    onClick={handleGoAllPremium}
                    className="w-full text-left font-medium hover:text-sky-500"
                  >
                    All Premium Accounts
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Divider */}
          <li className="mt-4 border-t border-gray-200 pt-4 px-4"></li>

          {/* Profile / Auth */}
          {isLoggedIn && userEmail ? (
            <>
              <div className="flex items-center justify-between py-3 px-4">
                <span
                  className="text-base text-gray-800 font-semibold truncate cursor-pointer hover:text-sky-500"
                  onClick={handleProfileSettingsClick}
                >
                  Profile Settings
                </span>
                {userProfilePicture ? (
                  <img src={userProfilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: generateAvatarColor(userEmail) }}
                    title={userEmail}
                  >
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                )}
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
            <div
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
              onClick={openLoginModal}
            >
              <span className="text-base text-gray-800 hover:text-sky-500">Profile</span>
              <img src="/icons/profile.svg" alt="Profile" className="w-8 h-8" />
            </div>
          )}

          {/* Contact Us */}
          <div
            className="flex items-center justify-between py-3 px-4 cursor-pointer"
            onClick={gotoContactUs}
          >
            <span className="text-base text-gray-800 hover:text-sky-500">Contact Us</span>
            <img src="/icons/phone.svg" alt="Contact" className="w-8 h-8" />
          </div>

          {/* About Us */}
          <div
            className="flex items-center justify-between py-3 px-4 cursor-pointer"
            onClick={gotoAboutUs}
          >
            <span className="text-base text-gray-800 hover:text-sky-500">About Us</span>
            <img src="/icons/aboutus.svg" alt="About Us" className="w-8 h-8" />
          </div>
        </ul>
      </div>

      {/* Login Modal */}
      <LoginPage isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default Navigation;