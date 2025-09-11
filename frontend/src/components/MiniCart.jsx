// src/components/MiniCart.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';

const MiniCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, loading, isUpdating, removeItem, setItemQuantity } = useCart();
  const miniCartRef = useRef();
  const [displayCart, setDisplayCart] = useState([]);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());

  // Transform cart data for display - with immediate sync
  useEffect(() => {
    const transformedItems = cart.map(item => ({
      id: item.product?._id || item.id,
      image: item.product?.thumbnailUrl || 'https://placehold.co/80x120',
      title: item.product?.name || 'Untitled',
      author: item.product?.author || item.product?.platform || '',
      price: Number(item.product?.price || 0),
      quantity: item.quantity,
    }));
    
    setDisplayCart(transformedItems);
  }, [cart]);

  // Listen for real-time cart changes with enhanced handling
  useEffect(() => {
    const handleCartChange = (event) => {
      const { type, timestamp } = event.detail;
      
      // Prevent duplicate updates
      if (timestamp && timestamp <= lastUpdateTimestamp) {
        return;
      }
      
      setLastUpdateTimestamp(timestamp || Date.now());
      
      // Force immediate re-render for certain events
      if (['itemAdded', 'itemUpdated', 'itemRemoved', 'quantityChanged'].includes(type)) {
        // Small delay to ensure state has propagated
        setTimeout(() => {
          const newTransformedItems = cart.map(item => ({
            id: item.product?._id || item.id,
            image: item.product?.thumbnailUrl || 'https://placehold.co/80x120',
            title: item.product?.name || 'Untitled',
            author: item.product?.author || item.product?.platform || '',
            price: Number(item.product?.price || 0),
            quantity: item.quantity,
          }));
          setDisplayCart(newTransformedItems);
        }, 50);
      }
    };

    window.addEventListener('cartChanged', handleCartChange);
    return () => window.removeEventListener('cartChanged', handleCartChange);
  }, [cart, lastUpdateTimestamp]);

  // Close mini cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (miniCartRef.current && !miniCartRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const subtotal = displayCart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await setItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = async (itemId) => {
    await removeItem(itemId);
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 bg-opacity-25 z-40"
            onClick={onClose}
          />

          {/* Mini Cart Panel */}
          <motion.div
            ref={miniCartRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 max-w-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({displayCart.length})
                {isUpdating && (
                  <span className="ml-2 inline-flex items-center">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading...</span>
                  </div>
                </div>
              ) : displayCart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 10-4 0v5.01" />
                  </svg>
                  <p className="text-gray-500 text-center">Your cart is empty</p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/AllBooks');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {displayCart.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${item.quantity}`} // Include quantity in key for animations
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            scale: 1
                          }}
                          exit={{ 
                            opacity: 0, 
                            x: 20,
                            scale: 0.95
                          }}
                          layout
                          transition={{ 
                            duration: 0.2,
                            delay: index * 0.05 // Stagger animation for multiple items
                          }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            {item.author && (
                              <p className="text-xs text-gray-500 truncate">{item.author}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-blue-600">
                                Rs. {item.price.toFixed(2)}
                              </span>
                              <div className="flex items-center space-x-2">
                                {/* Quantity Controls */}
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-xs transition-colors"
                                  disabled={isUpdating}
                                >
                                  −
                                </button>
                                <motion.span 
                                  key={`qty-${item.id}-${item.quantity}`}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.1 }}
                                  className="text-sm font-medium w-8 text-center"
                                >
                                  {item.quantity}
                                </motion.span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-xs transition-colors"
                                  disabled={isUpdating}
                                >
                                  +
                                </button>
                                {/* Remove Button */}
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 ml-2 transition-colors"
                                  aria-label={`Remove ${item.title}`}
                                  disabled={isUpdating}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Subtotal with animation */}
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-900">Subtotal:</span>
                      <motion.span 
                        key={`subtotal-${subtotal}`}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg font-bold text-blue-600"
                      >
                        Rs. {subtotal.toFixed(2)}
                      </motion.span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleViewCart}
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        disabled={isUpdating}
                      >
                        View Cart
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        disabled={isUpdating || displayCart.length === 0}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MiniCart;