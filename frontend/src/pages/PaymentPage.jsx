// src/pages/PaymentPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import { FooterWithSitemap } from '../sections/Footer';

function PaymentPage() {
  const navigate = useNavigate();

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
          <div
            className="flex items-center text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/checkout')}
          >
            <span className="mx-2">&gt;</span>
            <span className="mr-2">2</span>
            <span className="uppercase">Checkout Details</span>
          </div>
          <div className="flex items-center text-blue-600 font-semibold">
            <span className="mx-2">&gt;</span>
            <span className="mr-2">3</span>
            <span className="uppercase">Payment</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Information</h2>
          <p className="text-gray-600 mb-6">
            This is where the payment gateway integration would go.
            You can select your payment method and complete your purchase here.
          </p>
          <button
            onClick={() => alert('Proceeding to final order complete!')}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Complete Order
          </button>
        </div>
      </div>
      <FooterWithSitemap />
    </>
  );
}

export default PaymentPage;