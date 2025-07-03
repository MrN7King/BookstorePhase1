// src/sections/CartComponent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Main App component (or your main component where this CartPage will be rendered)
export default function CartComponent() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <CartPage />
    </div>
  );
}

// CartPage Component
function CartPage() {
  const navigate = useNavigate();

  // Sample cart items. In a real application, this would come from a global state or fetched from a database.
  // Each item includes a unique ID, image, title, author, price, and initial quantity.
  const [cartItems, setCartItems] = useState([
    {
      id: 'book1',
      image: 'https://placehold.co/80x120/E0E7FF/1F2937?text=Book+1', // Placeholder image
      title: '(Rescue Read) Stella Maris',
      author: 'Cormac McCarthy',
      price: 1845.00,
      quantity: 1,
    },
    {
      id: 'book2',
      image: 'https://placehold.co/80x120/E0E7FF/1F2937?text=Book+2', // Placeholder image
      title: 'Unlimited Power: The New Science of Personal Achievement',
      author: 'Anthony Robbins',
      price: 2312.00,
      quantity: 1,
    },
    {
      id: 'book3',
      image: 'https://placehold.co/80x120/E0E7FF/1F2937?text=Book+3', // Placeholder image
      title: 'Braving the Wilderness: The Quest for True Belonging and the Courage to Stand Alone',
      author: 'Brene Brown',
      price: 3752.00,
      quantity: 1,
    },
  ]);

  // State for coupon code input
  const [couponCode, setCouponCode] = useState('');
  // State for any messages (e.g., coupon applied, error)
  const [message, setMessage] = useState('');

  // Calculate subtotal of all items in the cart
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0.00; // Placeholder for shipping cost, can be dynamic in future
  const total = subtotal + shippingCost;

  // Handler for increasing item quantity
  const handleQuantityIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handler for decreasing item quantity
  const handleQuantityDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handler for applying coupon code (dummy logic for now)
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount20') {
      setMessage('Coupon "discount20" applied! (This is a dummy message)');
      // In a real app, you'd apply a discount to the total here
    } else {
      setMessage('Invalid coupon code.');
    }
  };

  // Handler for "Continue Shopping" button
  const handleContinueShopping = () => {
    navigate('/AllBooks'); // Redirects to /AllBooks page
  };

  // Handler for "Proceed to Checkout" button
  const handleProceedToCheckout = () => {
    navigate('/checkout'); // Navigate to the Checkout Details page
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Progress Bar/Header */}
      <div className="flex justify-items-start items-center mb-8 text-xs sm:text-sm md:text-base">
        <div className="flex items-center text-blue-600 font-semibold">
          <span className="mr-2">1</span>
          <span className="uppercase">Shopping Cart</span>
        </div>
        <div
          className="flex items-center text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleProceedToCheckout} // Make this clickable
        >
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section: Cart Items */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 gap-4 py-3 px-2 border-b border-gray-200 font-semibold text-gray-600 text-sm uppercase">
            <div className="col-span-2">Product</div>
            <div>Price</div>
            <div className="text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Info */}
                <div className="col-span-full md:col-span-2 flex items-center flex-col sm:flex-row text-center sm:text-left">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-md mr-4 mb-2 sm:mb-0 shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.author}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-gray-700 font-medium text-center md:text-left">
                  Rs. {item.price.toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center md:justify-start">
                  <button
                    onClick={() => handleQuantityDecrease(item.id)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="mx-3 text-lg font-medium text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityIncrease(item.id)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal for item */}
                <div className="col-span-full md:col-span-2 text-right font-semibold text-blue-600 text-lg">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}

          {/* Continue Shopping Button */}
          <div className="mt-8 text-center md:text-left">
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center px-6 py-3 border border-yellow-500 text-yellow-600 font-semibold rounded-lg shadow-sm hover:bg-yellow-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Section: Cart Totals & Coupon */}
        <div className="w-full lg:w-96 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Cart Totals</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center border-b pb-2 border-gray-100">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2 border-gray-100">
              <span className="text-gray-600">Shipping</span>
              <span className="text-xs text-gray-500 italic">
                {shippingCost === 0 ? 'Shipping costs are calculated during checkout.' : `Rs. ${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-blue-600">Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Proceed to Checkout
          </button>

          {/* Coupon Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="flex items-center text-gray-700 font-semibold mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 0 014-4z"
                />
              </svg>
              Coupon
            </h3>
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-3"
            />
            <button
              onClick={handleApplyCoupon}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply coupon
            </button>
            {message && (
              <p className="mt-3 text-sm text-center text-gray-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}