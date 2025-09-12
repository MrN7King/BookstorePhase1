// src/components/CartIcon.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// import useCart from '../hooks/useCart';
import { useCart } from '../context/CartContext';
import { useMiniCart } from '../context/MiniCartContext';

const CartIcon = ({ className = "" }) => {
  const { cart, loading, isUpdating } = useCart();
  const { toggleMiniCart, showMiniCartWithItem } = useMiniCart();
  
  // Local state for animations
  const [itemCount, setItemCount] = useState(0);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Update local count and trigger animations when cart changes
  useEffect(() => {
    const previousCount = itemCount;
    const newCount = totalItems;
    
    if (newCount !== previousCount && !loading) {
      setItemCount(newCount);
      
      if (newCount > previousCount && newCount > 0) {
        // Item was added - trigger add animation
        setShowAddedAnimation(true);
        setShowPulse(true);
        
        setTimeout(() => {
          setShowAddedAnimation(false);
          setShowPulse(false);
        }, 1000);
      }
    }
  }, [totalItems, itemCount, loading]);

  // Listen for specific cart change events
  useEffect(() => {
    const handleCartChange = (event) => {
      const { type, productId, product, isNewItem } = event.detail;
      
      switch (type) {
        case 'itemAdded':
          if (isNewItem) {
            // Show mini cart automatically when new item is added
            setTimeout(() => {
              showMiniCartWithItem({
                id: productId,
                title: product?.name || 'Unknown Product',
                image: product?.thumbnailUrl || 'https://placehold.co/80x120',
                price: product?.price || 0,
                author: product?.author || product?.platform || ''
              });
            }, 200); // Small delay to let animations settle
          }
          break;
          
        case 'itemUpdated':
        case 'quantityChanged':
          // Trigger subtle pulse animation for updates
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 500);
          break;
          
        case 'itemRemoved':
          // Could add removal animation here if desired
          break;
      }
    };

    window.addEventListener('cartChanged', handleCartChange);
    return () => window.removeEventListener('cartChanged', handleCartChange);
  }, [showMiniCartWithItem]);

  return (
    <button
      onClick={toggleMiniCart}
      className={`relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 ${className}`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Cart Icon with animations */}
      <motion.div
        animate={{
          scale: showAddedAnimation ? [1, 1.2, 1] : 1,
          rotate: showAddedAnimation ? [0, 10, -10, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        className={`relative ${showPulse ? 'animate-pulse' : ''}`}
      >
        <img src="/icons/Vector.svg" alt="cart" className="w-6 h-6" />
        
        {/* Updating indicator */}
        {isUpdating && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        )}
      </motion.div>

      {/* Enhanced badge with animations */}
      {totalItems > 0 && (
        <motion.div
          key={`badge-${totalItems}`} // Key ensures re-mount on count change
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 15,
            duration: 0.3 
          }}
          className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ${
            showAddedAnimation ? 'animate-bounce' : ''
          } ${showPulse ? 'animate-pulse' : ''}`}
        >
          <motion.span
            key={`count-${totalItems}`}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {totalItems > 99 ? '99+' : totalItems}
          </motion.span>
        </motion.div>
      )}
    </button>
  );
};

export default CartIcon;