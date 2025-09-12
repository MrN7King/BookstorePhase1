// src/context/MiniCartContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const MiniCartContext = createContext();


export const useMiniCart = () => {
  const context = useContext(MiniCartContext);
  if (!context) {
    throw new Error('useMiniCart must be used within a MiniCartProvider');
  }
  return context;
};

export const MiniCartProvider = ({ children }) => {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState(null);
  const autoCloseTimeoutRef = useRef(null);

  // Clear auto-close timeout when component unmounts
  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

  const openMiniCart = () => {
    setIsMiniCartOpen(true);
    
    // Clear any existing auto-close timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
  };

  const closeMiniCart = () => {
    setIsMiniCartOpen(false);
    
    // Clear recently added item after closing animation completes
    setTimeout(() => setRecentlyAddedItem(null), 300);
    
    // Clear auto-close timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
  };

  const showMiniCartWithItem = (item) => {
    setRecentlyAddedItem(item);
    setIsMiniCartOpen(true);
    
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    // Auto-close after 5 seconds if user doesn't interact
    autoCloseTimeoutRef.current = setTimeout(() => {
      setIsMiniCartOpen(false);
      autoCloseTimeoutRef.current = null;
    }, 5000);
  };

  const toggleMiniCart = () => {
    if (isMiniCartOpen) {
      closeMiniCart();
    } else {
      openMiniCart();
    }
  };

  // Reset auto-close timer when cart is manually opened
  const resetAutoCloseTimer = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = setTimeout(() => {
        setIsMiniCartOpen(false);
        autoCloseTimeoutRef.current = null;
      }, 5000);
    }
  };

  const value = {
    isMiniCartOpen,
    recentlyAddedItem,
    openMiniCart,
    closeMiniCart,
    toggleMiniCart,
    showMiniCartWithItem,
    resetAutoCloseTimer,
  };

  return (
    <MiniCartContext.Provider value={value}>
      {children}
    </MiniCartContext.Provider>
  );
};