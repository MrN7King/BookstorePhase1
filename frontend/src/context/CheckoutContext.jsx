// src/context/CheckoutContext.jsx
import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState({
    email: '',
    items: [], // [{ productId, quantity, productName, price }]
    sessionId: null,
    orderId: null,
    totalAmount: 0
  });

  const updateCheckoutData = (data) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
  };

  const clearCheckout = () => {
    setCheckoutData({
      email: '',
      items: [],
      sessionId: null,
      orderId: null,
      totalAmount: 0
    });
  };

  const value = {
    checkoutData,
    updateCheckoutData,
    clearCheckout
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};