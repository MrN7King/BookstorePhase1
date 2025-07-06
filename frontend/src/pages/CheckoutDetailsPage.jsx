// src/pages/CheckoutDetailsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import { FooterWithSitemap } from '../sections/Footer';

function CheckoutDetailsPage() {
  const navigate = useNavigate();
  // State to manage whether the guest email input should be shown
  const [showGuestEmailInput, setShowGuestEmailInput] = useState(false);
  // State to store the guest's email
  const [guestEmail, setGuestEmail] = useState('');

  const handleSignInClick = () => {
    alert('Sign In functionality would go here!');
    // In a real app, you would navigate to a login page or open a modal
  };

  const handleCheckoutAsGuestClick = () => {
    setShowGuestEmailInput(true);
  };

  const handleGuestEmailChange = (e) => {
    setGuestEmail(e.target.value);
  };

  const handleProceedToPayment = () => {
    if (showGuestEmailInput && !guestEmail) {
      alert('Please enter your email to continue as guest.');
      return;
    }
    // In a real app, you would save the guest email (if applicable) and then
    // navigate to the actual payment page, potentially passing cart details.
    console.log('Proceeding to payment. Guest email:', guestEmail);
    navigate('/payment'); // Navigate to the new payment page
  };

  return (
    <>
      <div className='container mx-auto pt-8 overflow-hidden'>
        <Navigation />
      </div>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        {/* Progress Bar */}
        <div className="flex justify-items-start items-center mb-8 text-xs sm:text-sm md:text-base">
          <div
            className="flex items-center text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/cart')}
          >
            <span className="mr-2">1</span>
            <span className="uppercase">Shopping Cart</span>
          </div>
          <div className="flex items-center text-blue-600 font-semibold">
            <span className="mx-2">&gt;</span>
            <span className="mr-2">2</span>
            <span className="uppercase">Checkout Details</span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">&gt;</span>
            <span className="mr-2">3</span>
            <span className="uppercase">Order Complete</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign in</h2>

          {!showGuestEmailInput ? (
            <>
              {/* Login/Guest Options - based on your image */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
                  Username (your email address)
                </label>
                <input
                  type="email"
                  id="username"
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </div>

              <button
                onClick={handleSignInClick}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 mb-6"
              >
                Continue
              </button>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">Don't have an eBooks.com account?</p>
                <button
                  onClick={handleCheckoutAsGuestClick}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                >
                  Checkout as Guest
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  You can set a password after completing your purchase
                </p>
              </div>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-4">Forgotten your password?</p>
                <button
                  onClick={() => alert('Recover Password functionality!')}
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-300"
                >
                  Recover Password
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest Email Input */}
              <p className="text-gray-700 mb-4 text-center">
                Please enter your email address to proceed as a guest. Your eBook will be sent to this email.
              </p>
              <div className="mb-6">
                <label htmlFor="guestEmail" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="guestEmail"
                  value={guestEmail}
                  onChange={handleGuestEmailChange}
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>
      <FooterWithSitemap />
    </>
  );
}

export default CheckoutDetailsPage;