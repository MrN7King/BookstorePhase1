// ProfileSettingsPage.jsx
"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer';
import Navigation from '../sections/Navigation';

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;
const USER_API_BASE_URL = "http://localhost:5000/api/user";
const AUTH_API_BASE_URL = "http://localhost:5000/api/auth";
const PURCHASES_API_BASE_URL = "http://localhost:5000/api/purchases/user-purchases";
const UPLOAD_API_BASE_URL = "http://localhost:5000/api/uploadprofile";

// Utility function to generate avatar color
const generateAvatarColor = (email) => {
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
};

// Reusable InputField component
const InputField = ({ label, type, id, value, onChange, placeholder, className = '', isRequired = false, readOnly = false, errorMessage = '' }) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      className={`shadow-sm appearance-none border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-400 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={isRequired}
      readOnly={readOnly}
    />
    {errorMessage && <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>}
  </div>
);

// --- Profile Sidebar Component ---
const ProfileSidebar = ({ activeSection, setActiveSection, isMobileNavOpen, onMobileNavLinkClick }) => {
  const navItems = [
    { id: 'personal-info', label: 'Personal Info', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    )},
    { id: 'security', label: 'Security & Password', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"></path></svg>
    )},
    { id: 'my-books', label: 'My Purchased Books', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
    )},
    { id: 'my-premium-accounts', label: 'My Premium Accounts', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    )},
    { id: 'account-management', label: 'Account Management', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 11112 1a9 9 0 010 18zm0-16a7 7 0 100 14A7 7 0 00112 3z"></path></svg>
    )},
  ];

  return (
    <div className={`
      md:w-64 bg-white shadow-lg py-4 md:py-8 px-4 flex-shrink-0
      md:relative md:border-r border-gray-200
      ${isMobileNavOpen ? 'fixed inset-0 z-40 overflow-y-auto' : 'hidden md:block'}
    `}>
      {/* Mobile Header with Close Button */}
      {isMobileNavOpen && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 md:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onMobileNavLinkClick}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      <nav className={`${isMobileNavOpen ? '' : ''}`}>
        <ul className="flex flex-col">
          {navItems.map(item => (
            <li key={item.id} className="mb-2 last:mb-0">
              <button
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobileNavOpen) {
                    onMobileNavLinkClick();
                  }
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors duration-200
                  ${activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                {item.icon} {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// --- Individual Section Components ---

const ProfilePictureSection = ({ profileImage, handleProfileImageChange, userEmail, isSubmitting }) => (
  <div className="mb-8 border-b pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
    <div className="flex flex-col items-center gap-4">
      {profileImage ? (
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
          />
        </div>
      ) : (
        <div
          className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-200 shadow-md"
          style={{ backgroundColor: generateAvatarColor(userEmail) }}
          title={userEmail}
        >
          {userEmail ? userEmail.charAt(0).toUpperCase() : ''}
        </div>
      )}
      <label htmlFor="profileImage" className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {profileImage ? 'Change Image' : 'Upload New Image'}
        <input
          type="file"
          id="profileImage"
          className="hidden"
          accept="image/*"
          onChange={handleProfileImageChange}
          disabled={isSubmitting}
        />
      </label>
      <p className="text-xs md:text-sm text-gray-500 mt-1">Max file size: 5MB. JPG, PNG, GIF allowed.</p>
    </div>
  </div>
);

// PersonalInfoSection
const PersonalInfoSection = ({ personalInfo, handlePersonalInfoChange, personalInfoErrors }) => (
  <div className="pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="First Name"
        type="text"
        id="firstName"
        value={personalInfo.firstName || ''}
        onChange={handlePersonalInfoChange}
        placeholder="John"
        isRequired={true}
        errorMessage={personalInfoErrors.firstName}
      />
      <InputField
        label="Last Name"
        type="text"
        id="lastName"
        value={personalInfo.lastName || ''}
        onChange={handlePersonalInfoChange}
        placeholder="Doe"
        isRequired={false}
        errorMessage={personalInfoErrors.lastName}
      />
      <InputField
        label="Email Address"
        type="email"
        id="email"
        value={personalInfo.email}
        onChange={handlePersonalInfoChange}
        placeholder="john.doe@example.com"
        isRequired={true}
        readOnly={true}
        errorMessage={personalInfoErrors.email}
      />
      <InputField
        label="Phone Number"
        type="tel"
        id="phone"
        value={personalInfo.phone}
        onChange={handlePersonalInfoChange}
        placeholder="+94 77 777 7777"
        isRequired={false}
        errorMessage={personalInfoErrors.phone}
      />
    </div>
  </div>
);

// PasswordSecuritySection
const PasswordSecuritySection = ({ passwordInfo, handlePasswordInfoChange, passwordErrors }) => (
  <div className="pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Security & Password</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Current Password"
        type="password"
        id="currentPassword"
        value={passwordInfo.currentPassword}
        onChange={handlePasswordInfoChange}
        placeholder="********"
        isRequired={false}
        errorMessage={passwordErrors.currentPassword}
        className="md:col-span-2"
      />
      <InputField
        label="New Password"
        type="password"
        id="newPassword"
        value={passwordInfo.newPassword}
        onChange={handlePasswordInfoChange}
        placeholder="********"
        isRequired={false}
        errorMessage={passwordErrors.newPassword}
      />
      <InputField
        label="Confirm New Password"
        type="password"
        id="confirmNewPassword"
        value={passwordInfo.confirmNewPassword}
        onChange={handlePasswordInfoChange}
        placeholder="********"
        isRequired={false}
        errorMessage={passwordErrors.confirmNewPassword}
      />
    </div>
    <p className="text-xs md:text-sm text-gray-500 mt-2">Leave password fields blank if you don't want to change it.</p>
  </div>
);

// --- My Books Section with Lazy Loading ---
const MyBooksSection = ({ books, onViewDetailsClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [books]);

  return (
    <div className="mb-8 border-b pb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">My Purchased Books</h2>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 极 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg mt-2">Loading books...</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {books.length > 0 ? (
            books.map(book => (
              <div key={book.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4 flex-grow">
                  {book.thumbnailUrl && (
                    <img
                      src={book.thumbnailUrl}
                      alt={`${book.title} thumbnail`}
                      className="w-16 h-24 object-cover rounded-md shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{book.title}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">by {book.author}</p>
                    <p className="text-xs md:text-sm text-gray-600">Purchased: {book.purchasedDate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewDetailsClick(book)}
                  className="text-blue-600 hover:underline text-sm font-medium flex-shrink-0"
                >
                  Read Now
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm md:text-base">No digital books purchased yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- My Premium Accounts Section with Lazy Loading ---
const MyPremiumAccountsSection = ({ premiumAccounts, onManageClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [premiumAccounts]);

  return (
    <div className="mb-8 border-b pb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">My Premium Account Subscriptions</h2>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg mt-2">Loading subscriptions...</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {premiumAccounts.length > 0 ? (
            premiumAccounts.map(account => (
              <div key={account.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4 flex-grow">
                  {account.thumbnailUrl && (
                    <img
                      src={account.thumbnailUrl}
                      alt={`${account.service} thumbnail`}
                      className="w-16 h-16 object-cover rounded-md shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{account.service}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">Status: {account.status} | Renews: {account.renewalDate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onManageClick(account)}
                  className="text-blue-600 hover:underline text-sm font-medium flex-shrink-0"
                >
                  Manage
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm md:text-base">No active premium subscriptions.</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Notification Settings Section ---
const NotificationSettingsSection = ({ notificationSettings, handleNotificationChange }) => (
  <div className="pt-6 mt-6 border-t border-gray-200">
    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Notification Settings</h3>
    <div className="space-y-3">
      <div className="flex items-center">
        <input
          id="orderUpdates"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={notificationSettings.orderUpdates}
          onChange={handleNotificationChange}
        />
        <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-900">
          Order updates (shipping, delivery confirmations)
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="newProductAlerts"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={notificationSettings.newProductAlerts}
          onChange={handleNotificationChange}
        />
        <label htmlFor="newProductAlerts" className="ml-2 block text-sm text-gray-900">
          New product arrivals and recommendations (books & premium)
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="promotions"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={notificationSettings.promotions}
          onChange={handleNotificationChange}
        />
        <label htmlFor="promotions" className="ml-2 block text-sm text-gray-900">
          Promotions, discounts, and special offers
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="newsletter"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={notificationSettings.newsletter}
          onChange={handleNotificationChange}
        />
        <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
          Monthly newsletter with company news
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="premiumReminders"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={notificationSettings.premiumReminders}
          onChange={handleNotificationChange}
        />
        <label htmlFor="premiumReminders" className="ml-2 block text-sm text-gray-900">
          Premium account renewal reminders
        </label>
      </div>
    </div>
  </div>
);

// --- Account Management Section ---
const AccountManagementSection = ({ handleDeactivateAccount, notificationSettings, handleNotificationChange, showDeactivationConfirm, confirmDeactivation, cancelDeactivation }) => (
  <div className="mb-8 pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Delete Account</h2>
    <div className="p-4 border border-gray-200 rounded-lg bg-red-50 text-red-800">
      <p className="font-medium mb-2 text-sm md:text-base">Deactivate Account</p>
      <p className="text-xs md:text-sm">Permanently close your account and delete your data. This action cannot be undone.</p>
      {!showDeactivationConfirm ? (
        <button
          type="button"
          onClick={handleDeactivateAccount}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          Deactivate Account
        </button>
      ) : (
        <div className="mt-4 p-3 bg-red-100 rounded-md">
          <p className="text-sm font-medium mb-5">Are you absolutely sure? This cannot be undone.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmDeactivation}
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 text-sm font-medium"
            >
              Yes, Deactivate
            </button>
            <button
              type="button"
              onClick={cancelDeactivation}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>

    
  </div>
);

// --- Profile Content Area Component ---
const ProfileContentArea = ({
  activeSection,
  personalInfo, handlePersonalInfoChange, personalInfoErrors,
  passwordInfo, handlePasswordInfoChange, passwordErrors,
  profileImage, handleProfileImageChange, userEmail,
  notificationSettings, handleNotificationChange,
  digitalProducts,
  handleDeactivateAccount,
  handleViewBookDetails,
  handleViewPremiumDetails,
  showDeactivationConfirm, confirmDeactivation, cancelDeactivation,
  isSubmitting
}) => {
  return (
    <div className="flex-grow p-4 md:p-8 bg-white rounded-lg shadow-md overflow-y-auto">
      {activeSection === 'personal-info' && (
        <>
          <ProfilePictureSection
            profileImage={profileImage}
            handleProfileImageChange={handleProfileImageChange}
            userEmail={userEmail}
            isSubmitting={isSubmitting}
          />
          <PersonalInfoSection
            personalInfo={personalInfo}
            handlePersonalInfoChange={handlePersonalInfoChange}
            personalInfoErrors={personalInfoErrors}
          />
        </>
      )}
      {activeSection === 'security' && (
        <PasswordSecuritySection
          passwordInfo={passwordInfo}
          handlePasswordInfoChange={handlePasswordInfoChange}
          passwordErrors={passwordErrors}
        />
      )}
      {activeSection === 'my-books' && (
        <MyBooksSection
          books={digitalProducts.books}
          onViewDetailsClick={handleViewBookDetails}
        />
      )}
      {activeSection === 'my-premium-accounts' && (
        <MyPremiumAccountsSection
          premiumAccounts={digitalProducts.premiumAccounts}
          onManageClick={handleViewPremiumDetails}
        />
      )}

      {activeSection === 'account-management' && (
        <AccountManagementSection
          handleDeactivateAccount={handleDeactivateAccount}
          notificationSettings={notificationSettings}
          handleNotificationChange={handleNotificationChange}
          showDeactivationConfirm={showDeactivationConfirm}
          confirmDeactivation={confirmDeactivation}
          cancelDeactivation={cancelDeactivation}
        />
      )}
    </div>
  );
};

// --- Book Details Overlay Component ---
const BookDetailsOverlay = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative transform transition-all max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={book.thumbnailUrl}
              alt={`${book.title} cover`}
              className="w-48 h-64 object-cover rounded-md shadow-lg"
            />
          </div>
          
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
            <p className="text-lg text-gray-700 mb-1">by {book.author}</p>
            <p className="text-gray-600 mb-3">Published by {book.publisher}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div>
                <strong>Pages:</strong> {book.metadata.pageCount}
              </div>
              <div>
                <strong>Format:</strong> {book.metadata.fileFormat}
              </div>
              <div>
                <strong>File Size:</strong> {book.metadata.fileSize} KB
              </div>
              <div>
                <strong>Purchased:</strong> {book.purchasedDate}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Premium Account Details Overlay Component ---
const PremiumAccountDetailsOverlay = ({ account, onClose }) => {
  if (!account) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative transform transition-all max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center text-center mb-6">
          {account.thumbnailUrl && (
            <img
              src={account.thumbnailUrl}
              alt={`${account.name} thumbnail`}
              className="w-24 h-24 object-contain rounded-md mb-4 shadow-sm"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{account.name}</h2>
          <p className="text-gray-700 mb-4 font-medium">{account.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <p><strong>Platform:</strong> {account.platform}</p>
          <p><strong>Duration:</strong> {account.duration}</p>
          <p><strong>Status:</strong> {account.status}</p>
          <p><strong>Assigned:</strong> {account.assignedAt}</p>
          <p><strong>Renews:</strong> {account.renewalDate}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Mobile Hamburger Button Component ---
const MobileHamburgerButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md"
    aria-label="Open menu"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </button>
);

// --- The main ProfileSettingsPage component ---
const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal-info');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // State for book details overlay
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // State for premium account details overlay
  const [showPremiumDetails, setShowPremiumDetails] = useState(false);
  const [selectedPremiumAccount, setSelectedPremiumAccount] = useState(null);

  // All state management for form data and settings
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [personalInfoErrors, setPersonalInfoErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    newProductAlerts: false,
    promotions: true,
    newsletter: true,
    premiumReminders: true
  });

  const [digitalProducts, setDigitalProducts] = useState({
    books: [],
    premiumAccounts: [],
  });

  const [mainStatusMessage, setMainStatusMessage] = useState('');
  const [mainIsSuccess, setMainIsSuccess] = useState(false);
  const [mainIsSubmitting, setMainIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDeactivationConfirm, setShowDeactivationConfirm] = useState(false);

  // --- Data Fetching (useEffect) ---
  useEffect(() => {
    const fetchUserData = async () => {
      setMainIsSubmitting(true);
      setIsDataLoaded(false);
      setMainStatusMessage('');
      try {
        const response = await axios.get(`${AUTH_API_BASE_URL}/data`, {
          withCredentials: true,
        });
        if (response.data.success && response.data.user) {
          const user = response.data.user;
          setPersonalInfo({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
          });
          // Set profile image if available
          if (user.profilePicture) {
            setProfileImage(user.profilePicture);
          }
          if (user.notificationSettings) {
            setNotificationSettings(user.notificationSettings);
          }
          setIsDataLoaded(true);
        } else {
          setMainStatusMessage(response.data.message || 'Failed to fetch user data. Please log in again.');
          setMainIsSuccess(false);
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching user data for profile:", error.response?.data || error.message);
        setMainStatusMessage(error.response?.data?.message || 'Failed to fetch user data. Please log in again.');
        setMainIsSuccess(false);
        if (error.response?.status === 401) {
          navigate('/');
        }
        setIsDataLoaded(true); // Still set to true to allow purchase fetching
      } finally {
        setMainIsSubmitting(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!isDataLoaded) return;
      
      try {
        const response = await axios.get(PURCHASES_API_BASE_URL, {
          withCredentials: true,
        });
        
        if (response.data.success && response.data.purchases) {
          setDigitalProducts(response.data.purchases);
        } else {
          console.error("Failed to fetch user purchases:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user purchases:", error.response?.data || error.message);
        setDigitalProducts({ books: [], premiumAccounts: [] });
      }
    };

    fetchPurchases();
  }, [isDataLoaded]);

  useEffect(() => {
    setMainStatusMessage('');
    setMainIsSuccess(false);
    setPersonalInfoErrors({ firstName: '', lastName: '', email: '', phone: '' });
    setPasswordErrors({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  }, [activeSection]);

  // Handler to toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavOpen(prev => !prev);
  };

  // Handlers for book details overlay
  const handleViewBookDetails = (book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  const handleCloseBookDetails = () => {
    setShowBookDetails(false);
    setSelectedBook(null);
  };

  // Handlers for premium account details overlay
  const handleViewPremiumDetails = (account) => {
    setSelectedPremiumAccount(account);
    setShowPremiumDetails(true);
  };

  const handleClosePremiumDetails = () => {
    setShowPremiumDetails(false);
    setSelectedPremiumAccount(null);
  };

  // Handlers for input changes
  const handlePersonalInfoChange = (e) => {
    const { id, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [id]: value }));
    setPersonalInfoErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handlePasswordInfoChange = (e) => {
    const { id, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [id]: value }));
    setPasswordErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleNotificationChange = (e) => {
    const { id, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleProfileImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Client-side validation
      if (file.size > 5 * 1024 * 1024) {
        setMainStatusMessage('File size exceeds 5MB limit.');
        setMainIsSuccess(false);
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setMainStatusMessage('Only JPG, PNG, GIF formats are allowed.');
        setMainIsSuccess(false);
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        setMainIsSubmitting(true);
        const response = await axios.post(`${UPLOAD_API_BASE_URL}/profile-picture`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setProfileImage(response.data.profilePicture);
          setMainStatusMessage('Profile picture updated successfully!');
          setMainIsSuccess(true);
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        setMainStatusMessage(error.response?.data?.message || 'Failed to upload profile picture');
        setMainIsSuccess(false);
      } finally {
        setMainIsSubmitting(false);
        // Reset the file input to allow uploading the same file again
        e.target.value = '';
      }
    }
  };

  const handleDeactivateAccount = () => {
    setShowDeactivationConfirm(true);
  };

  const confirmDeactivation = async () => {
    setShowDeactivationConfirm(false);
    setMainIsSubmitting(true);
    setMainStatusMessage('');
    setMainIsSuccess(false);

    try {
      const response = await axios.delete(`${USER_API_BASE_URL}/delete-account`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMainStatusMessage('Your account has been successfully deleted. Redirecting to home page...');
        setMainIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMainStatusMessage(response.data.message || 'Failed to delete account. Please try again.');
        setMainIsSuccess(false);
      }
    } catch (error) {
      console.error('Account deletion error:', error.response?.data || error.message);
      setMainStatusMessage(error.response?.data?.message || 'An error occurred while deleting account.');
      setMainIsSuccess(false);
    } finally {
      setMainIsSubmitting(false);
    }
  };

  const cancelDeactivation = () => {
    setShowDeactivationConfirm(false);
  };

  // --- Form Validation and Submission ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    let newPersonalInfoErrors = { firstName: '', lastName: '', email: '', phone: '' };
    let newPasswordErrors = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

    // Validation for Personal Info section
    if (activeSection === 'personal-info') {
      if (!personalInfo.firstName.trim()) {
        newPersonalInfoErrors.firstName = 'First Name is required.';
        valid = false;
      }
      setPersonalInfoErrors(newPersonalInfoErrors);
    }

    // Validation for Security section
    if (activeSection === 'security') {
      if (passwordInfo.newPassword) {
        if (passwordInfo.newPassword.length < 8) {
          newPasswordErrors.newPassword = 'Password must be at least 8 characters long.';
          valid = false;
        }
        if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
          newPasswordErrors.confirmNewPassword = 'Passwords do not match.';
          valid = false;
        }
      }
      setPasswordErrors(newPasswordErrors);
    }

    if (!valid) {
      setMainStatusMessage('Please fix the errors in the form.');
      setMainIsSuccess(false);
      return;
    }

    setMainIsSubmitting(true);
    setMainStatusMessage('');
    setMainIsSuccess(false);

    try {
      let payload = {};
      let endpoint = '';

      if (activeSection === 'personal-info') {
        payload = personalInfo;
        endpoint = `${USER_API_BASE_URL}/update-profile`;
      } else if (activeSection === 'security') {
        if (!passwordInfo.newPassword) {
          setMainStatusMessage('No changes to save.');
          setMainIsSuccess(true);
          setMainIsSubmitting(false);
          return;
        }
        payload = {
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
        };
        endpoint = `${USER_API_BASE_URL}/update-password`;
      } else if (activeSection === 'account-management') {
        payload = notificationSettings;
        endpoint = `${USER_API_BASE_URL}/update-notifications`;
      }

      if (endpoint) {
        const response = await axios.put(endpoint, payload, {
          withCredentials: true,
        });

        if (response.data.success) {
          setMainStatusMessage('Changes saved successfully!');
          setMainIsSuccess(true);
        } else {
          setMainStatusMessage(response.data.message || 'Failed to save changes.');
          setMainIsSuccess(false);
        }
      } else {
        setMainStatusMessage('No changes to save.');
        setMainIsSuccess(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setMainStatusMessage(error.response?.data?.message || 'An error occurred while saving changes.');
      setMainIsSuccess(false);
    } finally {
      setMainIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${AUTH_API_BASE_URL}/logout`, {}, {
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
      navigate('/');
    }
  };

  return (
    <>
      <Navigation onMobileNavClick={toggleMobileNav} onLogout={handleLogout} className="py-16"/>

      <main className="min-h-screen bg-gray-100 py-20 md:py-20 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Mobile Hamburger Button */}
          <MobileHamburgerButton onClick={toggleMobileNav} />
          
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMobileNavOpen={isMobileNavOpen}
            onMobileNavLinkClick={() => setIsMobileNavOpen(false)}
          />

          <div className="flex-grow flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Account Settings</h1>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
              <div className="flex-grow">
                <ProfileContentArea
                  activeSection={activeSection}
                  personalInfo={personalInfo}
                  handlePersonalInfoChange={handlePersonalInfoChange}
                  personalInfoErrors={personalInfoErrors}
                  passwordInfo={passwordInfo}
                  handlePasswordInfoChange={handlePasswordInfoChange}
                  passwordErrors={passwordErrors}
                  profileImage={profileImage}
                  handleProfileImageChange={handleProfileImageChange}
                  userEmail={personalInfo.email}
                  notificationSettings={notificationSettings}
                  handleNotificationChange={handleNotificationChange}
                  digitalProducts={digitalProducts}
                  handleViewBookDetails={handleViewBookDetails}
                  handleViewPremiumDetails={handleViewPremiumDetails}
                  handleDeactivateAccount={handleDeactivateAccount}
                  showDeactivationConfirm={showDeactivationConfirm}
                  confirmDeactivation={confirmDeactivation}
                  cancelDeactivation={cancelDeactivation}
                  isSubmitting={mainIsSubmitting}
                />
              </div>

              {['personal-info', 'security', 'account-management'].includes(activeSection) && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mainIsSubmitting}
                      >
                        {mainIsSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                    <div>
                      {mainStatusMessage && (
                        <p className={`text-sm md:text-base font-medium ${mainIsSuccess ? 'text-green-600' : 'text-red-600'}`}>
                          {mainStatusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {showBookDetails && <BookDetailsOverlay book={selectedBook} onClose={handleCloseBookDetails} />}
      {showPremiumDetails && <PremiumAccountDetailsOverlay account={selectedPremiumAccount} onClose={handleClosePremiumDetails} />}

      <FooterWithSitemap />
    </>
  );
};

export default ProfileSettingsPage;