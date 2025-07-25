"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer'; // Adjust path as needed
import Navigation from '../sections/Navigation'; // Adjust path as needed

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;
const USER_API_BASE_URL = "http://localhost:5000/api/user"; // Corrected to /api/user for profile data
const AUTH_API_BASE_URL = "http://localhost:5000/api/auth"; // Corrected to /api/auth for logout

// Utility function to generate avatar color (copied from Navigation.jsx for self-containment)
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

// Reusable InputField component - UPDATED to accept errorMessage
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

// --- Profile Sidebar Component (No changes here) ---
const ProfileSidebar = ({ activeSection, setActiveSection, isMobileNavOpen, onMobileNavLinkClick }) => {
  const navItems = [
    { id: 'personal-info', label: 'Personal Info', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    )},
    { id: 'security', label: 'Security & Password', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"></path></svg>
    )},
    { id: 'payment-methods', label: 'Payment Methods', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
    )},
    { id: 'my-books', label: 'My Purchased Books', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
    )},
    { id: 'my-premium-accounts', label: 'My Premium Accounts', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    )},
    { id: 'account-management', label: 'Account Management', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 1112 1a9 9 0 010 18zm0-16a7 7 0 100 14A7 7 0 0012 3z"></path></svg>
    )},
  ];

  return (
    <div className={`
      md:w-64 bg-white shadow-lg py-4 md:py-8 px-4 flex-shrink-0
      md:relative md:border-r border-gray-200
      ${isMobileNavOpen ? 'fixed inset-0 z-40 overflow-y-auto' : 'hidden md:block'}
    `}>
      {isMobileNavOpen && (
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={onMobileNavLinkClick}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      <nav className={`${isMobileNavOpen ? 'mt-12' : ''}`}>
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
                className={`flex items-center w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors duration-200
                  ${activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

const ProfilePictureSection = ({ profileImage, handleProfileImageChange, userEmail }) => (
  <div className="mb-8 border-b pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
    <div className="flex flex-col items-center gap-4">
      {profileImage ? ( // If a profileImage URL is set (from upload or fetched from backend)
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
        />
      ) : ( // Otherwise, display the generated color avatar
        <div
          className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-200 shadow-md"
          style={{ backgroundColor: generateAvatarColor(userEmail) }}
          title={userEmail}
        >
          {userEmail ? userEmail.charAt(0).toUpperCase() : ''}
        </div>
      )}
      <label htmlFor="profileImage" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base">
        Upload New Image
        <input
          type="file"
          id="profileImage"
          className="hidden"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
      </label>
      <p className="text-xs md:text-sm text-gray-500 mt-1">Max file size: 5MB. JPG, PNG, GIF allowed.</p>
      {/* NOTE: For persistent profile pictures, you would need a backend endpoint
                 to handle file uploads (e.g., using Multer) and store the image
                 (e.g., on AWS S3, Google Cloud Storage, or a local server path).
                 The URL to this stored image would then be saved in your User model
                 and fetched when the profile loads. This frontend only handles
                 temporary display of an uploaded image. */}
    </div>
  </div>
);

// PersonalInfoSection - UPDATED to accept and pass errors
const PersonalInfoSection = ({ personalInfo, handlePersonalInfoChange, personalInfoErrors }) => (
  <div className=" pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="First Name"
        type="text"
        id="firstName"
        value={personalInfo.firstName}
        onChange={handlePersonalInfoChange}
        placeholder="John"
        isRequired={true}
        errorMessage={personalInfoErrors.firstName}
      />
      <InputField
        label="Last Name"
        type="text"
        id="lastName"
        value={personalInfo.lastName}
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
        readOnly={true} // Email is read-only as it's the primary identifier
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
    <div className="mb-4">
   
    </div>
  </div>
);

// PasswordSecuritySection - UPDATED to accept and pass errors
const PasswordSecuritySection = ({ passwordInfo, handlePasswordInfoChange, passwordErrors }) => (
  <div className=" pb-6">
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
      />
      <div className="col-span-1"></div> {/* Spacer for layout */}
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

const PaymentMethodsSection = ({ paymentMethods, handleEditPaymentMethod, handleRemovePaymentMethod, handleAddPaymentMethod }) => (
    <div className="mb-8 border-b pb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Payment Methods</h2>
        <div className="space-y-4 mb-4">
            {paymentMethods.length > 0 ? (
                paymentMethods.map(method => (
                    <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-900 text-sm md:text-base">{method.type} ending in {method.last4}</p>
                            <p className="text-xs md:text-sm text-gray-600">Expires: {method.expiry} {method.default && <span className="text-blue-600">(Default)</span>}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPaymentMethod(method.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-sm md:text-base">No payment methods saved.</p>
            )}
        </div>
        <button
          type="button"
          onClick={handleAddPaymentMethod}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
        >
            <svg className="mr-1 w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Payment Method
        </button>
    </div>
);

// --- My Books Section with Lazy Loading ---
const MyBooksSection = ({ books, onViewDetailsClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate network delay
    return () => clearTimeout(timer);
  }, []); // Run only on mount

  return (
    <div className="mb-8 border-b pb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">My Purchased Books</h2>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg mt-2">Loading books...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {books.length > 0 ? (
              books.map(book => (
                <div key={book.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base">{book.title} <span className="text-xs md:text-sm text-gray-500">by {book.author}</span></p>
                    <p className="text-xs md:text-sm text-gray-600">Purchased: {book.purchasedDate}</p>
                  </div>
                  {/* Changed to button to trigger overlay */}
                  <button
                    type="button"
                    onClick={() => onViewDetailsClick(book)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Read Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm md:text-base">No digital books purchased yet.</p>
            )}
          </div>
         
        </>
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
    }, 1000); // Simulate network delay
    return () => clearTimeout(timer);
  }, []); // Run only on mount

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
        <>
          <div className="space-y-3 mb-4">
            {premiumAccounts.length > 0 ? (
                premiumAccounts.map(account => (
                    <div key={account.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-900 text-sm md:text-base">{account.service}</p>
                            <p className="text-xs md:text-sm text-gray-600">Status: {account.status} | Renews: {account.renewalDate}</p>
                        </div>
                        {/* Changed to button to trigger overlay */}
                        <button
                          type="button"
                          onClick={() => onManageClick(account)}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                            Manage
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-sm md:text-base">No active premium subscriptions.</p>
            )}
          </div>
          
        </>
      )}
    </div>
  );
};

// --- Notification Settings Section (moved here, no longer a standalone sidebar item) ---
const NotificationSettingsSection = ({ notificationSettings, handleNotificationChange }) => (
    <div className="pt-6 mt-6 border-t border-gray-200"> {/* Added padding and top border */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Notification Settings</h3> {/* Changed to H3 */}
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

// --- Account Management Section (now includes Notification Settings) ---
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
                    <p className="text-sm font-medium mb-2">Are you absolutely sure? This cannot be undone.</p>
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

        {/* Notification Settings integrated here */}
        <NotificationSettingsSection
            notificationSettings={notificationSettings}
            handleNotificationChange={handleNotificationChange}
        />
    </div>
);


// --- Profile Content Area Component ---
const ProfileContentArea = ({
  activeSection,
  personalInfo, handlePersonalInfoChange, personalInfoErrors, // Pass personalInfoErrors
  passwordInfo, handlePasswordInfoChange, passwordErrors, // Pass passwordErrors
  profileImage, handleProfileImageChange, userEmail, // Pass userEmail for avatar
  notificationSettings, handleNotificationChange,
  paymentMethods, handleEditPaymentMethod, handleRemovePaymentMethod, handleAddPaymentMethod,
  digitalProducts, // This prop now contains books and premiumAccounts separately
  handleDeactivateAccount,
  handleViewBookDetails, // New prop
  handleViewPremiumDetails, // New prop
  showDeactivationConfirm, confirmDeactivation, cancelDeactivation // Pass confirmation props
}) => {
  return (
    <div className="flex-grow p-4 md:p-8 bg-white rounded-lg shadow-md overflow-y-auto">
      {/* Render sections based on activeSection */}
      {activeSection === 'personal-info' && (
        <>
          <ProfilePictureSection
            profileImage={profileImage}
            handleProfileImageChange={handleProfileImageChange}
            userEmail={userEmail} // Pass userEmail to ProfilePictureSection
          />
          <PersonalInfoSection
            personalInfo={personalInfo}
            handlePersonalInfoChange={handlePersonalInfoChange}
            personalInfoErrors={personalInfoErrors} // Pass personalInfoErrors
          />
        </>
      )}
      {activeSection === 'security' && (
        <PasswordSecuritySection
          passwordInfo={passwordInfo}
          handlePasswordInfoChange={handlePasswordInfoChange}
          passwordErrors={passwordErrors} // Pass passwordErrors
        />
      )}
      {activeSection === 'payment-methods' && (
        <PaymentMethodsSection
          paymentMethods={paymentMethods}
          handleEditPaymentMethod={handleEditPaymentMethod}
          handleRemovePaymentMethod={handleRemovePaymentMethod}
          handleAddPaymentMethod={handleAddPaymentMethod}
        />
      )}
      {activeSection === 'my-books' && (
        <MyBooksSection
          books={digitalProducts.books}
          onViewDetailsClick={handleViewBookDetails} // Pass handler
        />
      )}
      {activeSection === 'my-premium-accounts' && (
        <MyPremiumAccountsSection
          premiumAccounts={digitalProducts.premiumAccounts}
          onManageClick={handleViewPremiumDetails} // Pass handler
        />
      )}

      {activeSection === 'account-management' && (
        <AccountManagementSection
            handleDeactivateAccount={handleDeactivateAccount}
            notificationSettings={notificationSettings}
            handleNotificationChange={handleNotificationChange}
            showDeactivationConfirm={showDeactivationConfirm} // Pass confirmation state
            confirmDeactivation={confirmDeactivation}         // Pass confirm handler
            cancelDeactivation={cancelDeactivation}           // Pass cancel handler
        />
      )}
    </div>
  );
};

// --- NEW: Book Details Overlay Component ---
const BookDetailsOverlay = ({ book, onClose }) => {
  if (!book) return null; // Don't render if no book is selected

  return (
    // Increased background opacity to bg-opacity-80 for a darker effect
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative transform transition-all sm:my-8 sm:w-full sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{book.title}</h2>
        <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.author}</p>
        <p className="text-gray-700 mb-2"><strong>Purchased Date:</strong> {book.purchasedDate}</p>
        <p className="text-gray-700 mb-4">
          <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Close
          </button>
      </div>
    </div>
  );
};

// --- NEW: Premium Account Details Overlay Component ---
const PremiumAccountDetailsOverlay = ({ account, onClose }) => {
  if (!account) return null; // Don't render if no account is selected

  return (
    // Increased background opacity to bg-opacity-80 for a darker effect
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative transform transition-all sm:my-8 sm:w-full sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{account.service}</h2>
        <p className="text-gray-700 mb-2"><strong>Status:</strong> {account.status}</p>
        <p className="text-700 mb-2"><strong>Renewal Date:</strong> {account.renewalDate}</p>
        <p className="text-gray-700 mb-4">
          <strong>Benefits:</strong> Access to exclusive content, ad-free experience, priority support, and early access to new features.
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
};


// --- The main ProfileSettingsPage component ---
const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal-info'); // Default active section
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State for mobile navigation visibility

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

  // NEW: State for field-specific errors
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

  // profileImage will hold the Data URL for display, profileImageFile holds the actual File object
  const [profileImage, setProfileImage] = useState(null); // Initialize to null so avatar logic kicks in
  const [profileImageFile, setProfileImageFile] = useState(null); // For actual file upload

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    newProductAlerts: false,
    promotions: true,
    newsletter: true,
    premiumReminders: true
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'card1', type: 'Visa', last4: '4242', expiry: '12/26', default: true },
    { id: 'card2', type: 'Mastercard', last4: '1111', expiry: '08/25', default: false },
  ]);

  const [digitalProducts, setDigitalProducts] = useState({
    books: [
      { id: 'book1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', purchasedDate: '2023-01-15' },
      { id: 'book2', title: '1984', author: 'George Orwell', purchasedDate: '2023-03-20' },
      { id: 'book3', title: 'To Kill a Mockingbird', author: 'Harper Lee', purchasedDate: '2024-01-10' },
    ],
    premiumAccounts: [
      { id: 'prem1', service: 'Pro Developer Plan', status: 'Active', renewalDate: '2025-12-31' },
      { id: 'prem2', service: 'Platinum Reader Subscription', status: 'Active', renewalDate: '2026-06-30' },
      { id: 'prem3', service: 'Creative Cloud Access', status: 'Expired', renewalDate: '2024-05-15' },
    ]
  });

  // Status messages for the main "Save Changes" button
  const [mainStatusMessage, setMainStatusMessage] = useState('');
  const [mainIsSuccess, setMainIsSuccess] = useState(false);
  const [mainIsSubmitting, setMainIsSubmitting] = useState(false);

  // State for deactivation confirmation
  const [showDeactivationConfirm, setShowDeactivationConfirm] = useState(false);


  // --- Data Fetching (useEffect) ---
  useEffect(() => {
    const fetchUserData = async () => {
      setMainIsSubmitting(true); // Indicate loading state for the page
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
            phone: user.phone || '', // Include phone from backend
          });
          // Set initial notification settings if they exist on the user object
          // For now, assuming default values or fetching from a separate endpoint
          if (user.notificationSettings) { // If your user model stores notification settings
            setNotificationSettings(user.notificationSettings);
          }
          // If user has a profile picture URL stored in backend, set it here
          // Example: if (user.profilePictureUrl) setProfileImage(user.profilePictureUrl);

          // You would also fetch payment methods, books, premium accounts from backend here
          // For now, keeping dummy data for these sections
        } else {
          setMainStatusMessage(response.data.message || 'Failed to fetch user data. Please log in again.');
          setMainIsSuccess(false);
          // Redirect to login if data fetch fails (e.g., unauthorized)
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching user data for profile:", error.response?.data || error.message);
        setMainStatusMessage(error.response?.data?.message || 'Failed to fetch user data. Please log in again.');
        setMainIsSuccess(false);
        // Redirect to login if unauthorized
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setMainIsSubmitting(false); // End loading state
      }
    };

    fetchUserData();
  }, [navigate]); // navigate is a dependency for useCallback stability

  // NEW: Clear status messages and field errors when activeSection changes
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
    // Clear specific error message when user starts typing
    setPersonalInfoErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handlePasswordInfoChange = (e) => {
    const { id, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [id]: value }));
    // Clear specific error message when user starts typing
    setPasswordErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleNotificationChange = (e) => {
    const { id, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMainStatusMessage('File size exceeds 5MB limit.');
        setMainIsSuccess(false);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setMainStatusMessage('Only JPG, PNG, GIF formats are allowed.');
        setMainIsSuccess(false);
        return;
      }

      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result); // Set the Data URL for immediate display
      };
      reader.readAsDataURL(file);
      // NOTE: For persistent profile pictures, you would send 'file' to a backend upload endpoint here.
      // Example: uploadProfileImage(file);
    }
  };

  const handleEditPaymentMethod = (id) => {
    console.log(`Edit payment method: ${id}`);
    // In a real app, this would open a modal or navigate to an edit page
    setMainStatusMessage('Edit payment method functionality not yet implemented.');
    setMainIsSuccess(false);
  };

  // Custom confirmation for removing payment method
  const handleRemovePaymentMethod = (id) => {
    // Replace with custom modal if needed, for now using simple confirmation
    if (window.confirm('Are you sure you want to remove this payment method?')) {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
        setMainStatusMessage('Payment method removed successfully.');
        setMainIsSuccess(true);
    }
  };

  const handleAddPaymentMethod = () => {
    console.log('Add new payment method functionality.');
    setMainStatusMessage('Add new payment method functionality not yet implemented.');
    setMainIsSuccess(false);
  };

  // Custom confirmation for deactivating account
  const handleDeactivateAccount = () => {
    setShowDeactivationConfirm(true); // Show confirmation UI
  };

  const confirmDeactivation = async () => {
    setShowDeactivationConfirm(false); // Hide confirmation
    setMainIsSubmitting(true);
    setMainStatusMessage('');
    setMainIsSuccess(false);

    try {
        // Backend API call to delete the account
        const response = await axios.delete(`${USER_API_BASE_URL}/delete-account`, {
            withCredentials: true,
        });

        if (response.data.success) {
            setMainStatusMessage('Your account has been successfully deleted. Redirecting to home page...');
            setMainIsSuccess(true);
            // Log user out by clearing cookie (backend handles this on successful deletion)
            setTimeout(() => {
                navigate('/'); // Redirect to home page
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
    setShowDeactivationConfirm(false); // Hide confirmation
    setMainStatusMessage('Account deactivation cancelled.');
    setMainIsSuccess(false);
  };

  // --- Main Save Changes Handler (for Personal Info and Notification Settings) ---
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setMainIsSubmitting(true);
    setMainStatusMessage('');
    setMainIsSuccess(false);
    setPersonalInfoErrors({ firstName: '', lastName: '', email: '', phone: '' }); // Clear previous errors

    try {
      // Send personal info updates
      const profileResponse = await axios.put(`${USER_API_BASE_URL}/update-profile`, {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone // Include phone if it's part of your user model
      }, { withCredentials: true });

      if (!profileResponse.data.success) {
        // If backend sends specific errors, you'd parse them here.
        // For now, if the message is generic, it will show as mainStatusMessage.
        // If it's email conflict, we can set email error.
        if (profileResponse.data.message && profileResponse.data.message.includes('email is already registered')) {
          setPersonalInfoErrors(prev => ({ ...prev, email: profileResponse.data.message }));
        } else {
          setMainStatusMessage(profileResponse.data.message || 'Failed to update personal info.');
        }
        setMainIsSuccess(false);
        return; // Stop execution if personal info update failed
      }

      // If you had a separate endpoint for notification settings, you'd call it here
      // Example: await axios.put(`${USER_API_BASE_URL}/update-notifications`, notificationSettings, { withCredentials: true });

      setMainStatusMessage('Your profile settings have been updated successfully!');
      setMainIsSuccess(true);
      // Update local personalInfo state with any data returned from backend (e.g., if email was normalized)
      setPersonalInfo(prev => ({
        ...prev,
        firstName: profileResponse.data.user.firstName,
        lastName: profileResponse.data.user.lastName,
        email: profileResponse.data.user.email,
        // Update phone if returned by backend
        phone: profileResponse.data.user.phone || prev.phone
      }));

      // Handle profile image upload if a new file is selected
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('profileImage', profileImageFile);
        // NOTE: This requires a backend route and file upload middleware (e.g., Multer)
        // Example: await axios.post(`${USER_API_BASE_URL}/upload-profile-image`, formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        //   withCredentials: true,
        // });
        setMainStatusMessage(prev => prev + ' (Image upload simulated - backend storage needed)');
      }

    } catch (error) {
      console.error('Failed to update settings:', error.response?.data || error.message);
      setMainStatusMessage(error.response?.data?.message || 'Failed to update settings. Please try again.');
      setMainIsSuccess(false);
    } finally {
      setMainIsSubmitting(false);
    }
  };

  // --- Change Password Handler ---
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setMainIsSubmitting(true); // Use main submitting state for consistency
    setMainStatusMessage(''); // Clear main status message
    setMainIsSuccess(false);
    setPasswordErrors({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear previous errors

    // Client-side validation for required fields
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmNewPassword) {
        // Set specific errors for missing fields
        setPasswordErrors(prev => ({
            currentPassword: !passwordInfo.currentPassword ? 'Current password is required.' : '',
            newPassword: !passwordInfo.newPassword ? 'New password is required.' : '',
            confirmNewPassword: !passwordInfo.confirmNewPassword ? 'Confirm new password is required.' : '',
        }));
        setMainIsSuccess(false); // Indicate failure
        setMainIsSubmitting(false);
        return;
    }

    // Client-side validation for password match
    if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      setPasswordErrors(prev => ({ ...prev, newPassword: 'Passwords do not match.', confirmNewPassword: 'Passwords do not match.' }));
      setMainIsSuccess(false);
      setMainIsSubmitting(false);
      return;
    }

    // Client-side validation for password length
    if (passwordInfo.newPassword.length < 8) {
      setPasswordErrors(prev => ({ ...prev, newPassword: 'New password must be at least 8 characters long.' }));
      setMainIsSuccess(false);
      setMainIsSubmitting(false);
      return;
    }

    // Client-side validation for new password being same as current
    if (passwordInfo.newPassword === passwordInfo.currentPassword) {
      setPasswordErrors(prev => ({ ...prev, newPassword: 'New password cannot be the same as the current password.' }));
      setMainIsSuccess(false);
      setMainIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(`${USER_API_BASE_URL}/change-password`, {
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
        confirmNewPassword: passwordInfo.confirmNewPassword,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMainStatusMessage('Password changed successfully! You will be logged out shortly.');
        setMainIsSuccess(true);
        // Clear password fields
        setPasswordInfo({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        // Redirect to login after a short delay to allow cookie to clear
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Backend error messages for password change are quite specific, map them
        const backendMessage = response.data.message || 'Failed to change password.';
        if (backendMessage.includes('Incorrect current password')) {
          setPasswordErrors(prev => ({ ...prev, currentPassword: backendMessage }));
        } else if (backendMessage.includes('New password must be at least 8 characters long')) {
          setPasswordErrors(prev => ({ ...prev, newPassword: backendMessage }));
        } else if (backendMessage.includes('New password and confirmation do not match')) {
          setPasswordErrors(prev => ({ ...prev, newPassword: backendMessage, confirmNewPassword: backendMessage }));
        } else if (backendMessage.includes('New password cannot be the same as the current password')) {
          setPasswordErrors(prev => ({ ...prev, newPassword: backendMessage }));
        } else {
          // Fallback for any other unexpected backend errors
          setMainStatusMessage(backendMessage);
        }
        setMainIsSuccess(false);
      }
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'An error occurred while changing password.';
      // Attempt to map common error messages to specific fields
      if (errorMessage.includes('Incorrect current password')) {
        setPasswordErrors(prev => ({ ...prev, currentPassword: errorMessage }));
      } else if (errorMessage.includes('New password must be at least 8 characters long')) {
        setPasswordErrors(prev => ({ ...prev, newPassword: errorMessage }));
      } else if (errorMessage.includes('New password and confirmation do not match')) {
        setPasswordErrors(prev => ({ ...prev, newPassword: errorMessage, confirmNewPassword: errorMessage }));
      } else if (errorMessage.includes('New password cannot be the same as the current password')) {
        setPasswordErrors(prev => ({ ...prev, newPassword: errorMessage }));
      } else {
        setMainStatusMessage(errorMessage); // Display as general message if not specific
      }
      setMainIsSuccess(false);
    } finally {
      setMainIsSubmitting(false);
    }
  };


  // Render loading state for initial data fetch
  if (mainIsSubmitting && mainStatusMessage === '') { // Only show loading if no error message yet
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-700">Loading profile data...</p>
        </div>
        <FooterWithSitemap />
      </>
    );
  }

  // The full-screen error rendering block has been removed.
  // Errors from initial fetch will now be displayed by the mainStatusMessage logic below.

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title with Hamburger and User Icon */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              My Account Settings
            </h1>
            {/* Hamburger Icon for mobile only */}
            <button
              onClick={toggleMobileNav}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <ProfileSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isMobileNavOpen={isMobileNavOpen}
              onMobileNavLinkClick={toggleMobileNav} // Pass the toggle function
            />
            {/* The form now wraps only the content area that needs to be submitted */}
            <div className="flex-grow"> {/* This div replaces the form for layout purposes */}
              <ProfileContentArea
                activeSection={activeSection}
                personalInfo={personalInfo}
                handlePersonalInfoChange={handlePersonalInfoChange}
                personalInfoErrors={personalInfoErrors} // Pass personalInfoErrors
                passwordInfo={passwordInfo}
                handlePasswordInfoChange={handlePasswordInfoChange}
                passwordErrors={passwordErrors} // Pass passwordErrors
                profileImage={profileImage}
                handleProfileImageChange={handleProfileImageChange}
                userEmail={personalInfo.email} // Pass user's email for avatar generation
                notificationSettings={notificationSettings}
                handleNotificationChange={handleNotificationChange}
                paymentMethods={paymentMethods}
                handleEditPaymentMethod={handleEditPaymentMethod}
                handleRemovePaymentMethod={handleRemovePaymentMethod}
                handleAddPaymentMethod={handleAddPaymentMethod}
                digitalProducts={digitalProducts}
                handleDeactivateAccount={handleDeactivateAccount}
                handleViewBookDetails={handleViewBookDetails}
                handleViewPremiumDetails={handleViewPremiumDetails}
                showDeactivationConfirm={showDeactivationConfirm}
                confirmDeactivation={confirmDeactivation}
                cancelDeactivation={cancelDeactivation}
              />

              {/* Display mainStatusMessage here, as a smaller alert */}
              {mainStatusMessage && (
                (mainIsSuccess || // Always show success messages
                 (activeSection === 'security' && Object.values(passwordErrors).every(err => !err)) || // Show error if security section and no specific password errors
                 (activeSection === 'personal-info' && Object.values(personalInfoErrors).every(err => !err)) || // Show error if personal info section and no specific personal info errors
                 (activeSection !== 'security' && activeSection !== 'personal-info') // Show error for other sections (e.g., initial fetch, account management)
                ) &&
                <div className={`mt-6 p-3 rounded-lg text-center text-sm font-medium ${mainIsSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {mainStatusMessage}
                </div>
              )}
              
              {/* Only show "Save Changes" button for sections that modify profile data */}
              {(activeSection === 'personal-info' || activeSection === 'security' || activeSection === 'account-management') && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="button" // Changed to type="button" as the form is now split
                    onClick={activeSection === 'security' ? handleChangePasswordSubmit : handleSaveChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    disabled={mainIsSubmitting}
                  >
                    {mainIsSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterWithSitemap />

      {/* Render Overlays conditionally */}
      {showBookDetails && (
        <BookDetailsOverlay book={selectedBook} onClose={handleCloseBookDetails} />
      )}
      {showPremiumDetails && (
        <PremiumAccountDetailsOverlay account={selectedPremiumAccount} onClose={handleClosePremiumDetails} />
      )}
    </>
  );
};

export default ProfileSettingsPage;
