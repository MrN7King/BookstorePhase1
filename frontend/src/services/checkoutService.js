// src/services/checkoutService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export const checkoutService = {
  // Create an order in the backend
  async beginCheckout(checkoutData) {
    try {
         const response = await axios.post(`${API_BASE}/orders/begin-checkout`, {
        email: checkoutData.email,
        items: checkoutData.items, // [{ productId, quantity }]
        paymentSessionId: checkoutData.paymentSessionId || crypto.randomUUID()
      });
      
      return response.data;
    } catch (error) {
      console.error('Begin checkout error:', error);
      throw new Error(error.response?.data?.error || 'Failed to begin checkout');
    }
  },

  // Complete payment (for demo purposes)
  async completePayment(sessionId) {
    try {
      const response = await axios.post(`${API_BASE}/payment/complete`, {
        sessionId
      });
      
      return response.data;
    } catch (error) {
      console.error('Complete payment error:', error);
      throw new Error(error.response?.data?.error || 'Failed to complete payment');
    }
  }
};

export default checkoutService;