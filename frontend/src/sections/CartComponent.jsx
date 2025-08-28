// src/sections/CartComponent.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { useCheckout } from '../context/CheckoutContext';

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
  const { cart, setCart, loading, addOrUpdateItem, setItemQuantity, removeItem } = useCart();
  const { updateCheckoutData } = useCheckout();

  // Sample cart items. In a real application, this would come from a global state or fetched from a database.
  // Each item includes a unique ID, image, title, author, price, and initial quantity.
const cartItems = cart.map(it => ({
  id: it.product?._id,  // always from product
  image: it.product?.thumbnailUrl || 'https://placehold.co/80x120',
  title: it.product?.name || 'Untitled',
  author: it.product?.author || '',
  price: Number(it.product?.price),
  quantity: it.quantity,
  raw: it
}));

  // State for coupon code input
  const [couponCode, setCouponCode] = useState('');
  // State for any messages (e.g., coupon applied, error)
  const [message, setMessage] = useState('');

  // Calculate subtotal of all items in the cart

  // subtotal
  const calculateSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const subtotal = calculateSubtotal();
  const shippingCost = 0.00;
  const total = subtotal + shippingCost;


  // Optimistic increase
  const handleQuantityIncrease = async (id) => {
    // optimistic UI
    setCart(prev => prev.map(i => i.id === id ? ({ ...i, quantity: i.quantity + 1 }) : i));

    // persist (hook handles guest vs auth)
    try {
      await setItemQuantity(id, (cart.find(i => i.id === id)?.quantity || 0) + 1);
    } catch (err) {
      // rollback on failure: re-fetch from hook or simple decrement
      console.error('increase qty failed', err);
      // naive rollback:
      setCart(prev => prev.map(i => i.id === id ? ({ ...i, quantity: Math.max(1, i.quantity - 1) }) : i));
    }
  };

  // Optimistic decrease
  const handleQuantityDecrease = async (id) => {
    const current = cart.find(i => i.id === id);
    if (!current) return;
    const next = Math.max(1, current.quantity - 1);

    // optimistic UI
    setCart(prev => prev.map(i => i.id === id ? ({ ...i, quantity: next }) : i));

    try {
      await setItemQuantity(id, next);
    } catch (err) {
      console.error('decrease qty failed', err);
      // rollback:
      setCart(prev => prev.map(i => i.id === id ? ({ ...i, quantity: current.quantity }) : i));
    }
  };

  // Remove with optimistic UI
  const handleRemove = async (id) => {
    const snapshot = cart; // keep snapshot for rollback
    // optimistic remove
    setCart(prev => prev.filter(i => i.id !== id));

    try {
      await removeItem(id);
    } catch (err) {
      console.error('remove item failed', err);
      // rollback
      setCart(snapshot);
    }
  };

  // Handler for applying coupon code (dummy logic for now)
  const handleApplyCoupon = () => {
    if (!couponCode) return setMessage('Enter a coupon code.');
    if (couponCode.toLowerCase() === 'discount20') {
      setMessage('Coupon "discount20" applied! (This is a dummy message)');
    } else setMessage('Invalid coupon code.');
  };

  // Handler for "Continue Shopping" button
  const handleContinueShopping = () => {
    navigate('/AllBooks'); // Redirects to /AllBooks page
  };

  // Handler for "Proceed to Checkout" button
  const handleProceedToCheckout = () => {
    updateCheckoutData({
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        productName: item.title,
        price: item.price
      }))
    });
    navigate('/checkout'); // Navigate to the Checkout Details page
  };

  if (loading) {
    return <div className="p-8 text-center">Loading cart…</div>;
  }

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
          <div className="hidden md:grid grid-cols-7 gap-4 py-3 px-2 border-b border-gray-200 font-semibold text-gray-600 text-sm uppercase">
            <div className="col-span-2">Product</div>
            <div>Price</div>
            <div className="text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
            <div className="text-right"></div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">Your cart is empty.</p>
          ) : (
            // replace the mapped item block with this (inside cartItems.map(...))
            cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
                {/* Left: image + title/author */}
                <div className="col-span-full md:col-span-2 flex items-center gap-3 text-center sm:text-left">
                  {/* Product image */}
                  <img src={item.image} alt={item.title} className="w-20 h-24 object-cover rounded-md mr-0 shadow-sm" />

                  {/* Title & author */}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.author}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-gray-700 font-medium text-center md:text-left">
                  Rs. {item.price.toFixed(2)}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-center md:justify-start">
                  <button onClick={() => handleQuantityDecrease(item.id)} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300">-</button>
                  <span className="mx-3 text-lg font-medium text-gray-800">{item.quantity}</span>
                  <button onClick={() => handleQuantityIncrease(item.id)} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300">+</button>
                </div>

                {/* Subtotal */}
                <div className="col-span-full md:col-span-2 text-right font-semibold text-blue-600 text-lg">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove button column (rightmost) */}
                <div className="text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    aria-label={`Remove ${item.title}`}
                    className="inline-flex items-center justify-center text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                      <path d="M9 3a1 1 0 00-.894.553L7 5H4a1 1 0 100 2h1v12a2 2 0 002 2h10a2 2 0 002-2V7h1a1 1 0 100-2h-3l-1.105-1.447A1 1 0 0015 3H9zm2 5a1 1 0 012 0v9a1 1 0 11-2 0V8zm-4 0a1 1 0 012 0v9a1 1 0 11-2 0V8z" />
                    </svg>
                  </button>
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