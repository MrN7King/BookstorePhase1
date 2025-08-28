import Navigation from '@/sections/Navigation';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer';
import { useCheckout } from '../context/CheckoutContext';
import { checkoutService } from '../services/checkoutService';
import useCart from '../hooks/useCart';
import { useState, useEffect } from 'react';

// Helper function to generate UUID (more compatible than crypto.randomUUID())
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function PaymentPage() {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { clearCart } = useCart(); 

  // If no checkout data, redirect to cart
  useEffect(() => {
    if (!checkoutData.email || !checkoutData.items.length) {
      console.log('No checkout data found, redirecting to cart');
      navigate('/cart');
    }
  }, [checkoutData, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Create order if not already created
      let sessionId = checkoutData.sessionId;
      let orderId = checkoutData.orderId;

      if (!sessionId) {
        console.log('Creating order...', checkoutData);
        const beginResponse = await checkoutService.beginCheckout({
          email: checkoutData.email,
          items: checkoutData.items,
          paymentSessionId: generateUUID()
        });

        sessionId = beginResponse.sessionId;
        orderId = beginResponse.orderId;
        
        updateCheckoutData({
          sessionId,
          orderId,
          totalAmount: beginResponse.amount
        });

        console.log('Order created:', { sessionId, orderId });
      }

      // Step 2: Complete the payment (demo)
      console.log('Completing payment for session:', sessionId);
      const completeResponse = await checkoutService.completePayment(sessionId);
      
     if (completeResponse.success) {
        console.log('Payment completed successfully');
        
        // Clear the cart after successful payment
        try {
          console.log('Clearing cart after successful payment...');
          await clearCart();
          console.log('Cart cleared successfully');
        } catch (cartError) {
          console.error('Failed to clear cart:', cartError);
          // Don't fail the entire flow if cart clearing fails
        }
        
        console.log('Navigating to thank you page');
        navigate('/thank-you');
      } else {
        throw new Error('Payment completion failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailed = () => {
    setError('Payment was cancelled or failed. Please try again.');
    // Optionally redirect back to checkout after a delay
    setTimeout(() => {
      navigate('/checkout');
    }, 3000);
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
          
          {/* Order Summary */}
          <div className="mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">Order Summary:</h3>
            <p className="text-sm text-gray-600 mb-1">Email: {checkoutData.email}</p>
            <p className="text-sm text-gray-600 mb-1">Items: {checkoutData.items.length}</p>
            
            {/* Show item details for debugging */}
            {checkoutData.items.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">Items:</p>
                {checkoutData.items.map((item, index) => (
                  <p key={index} className="text-xs text-gray-600">
                    • {item.productName || 'Item'} (x{item.quantity})
                  </p>
                ))}
              </div>
            )}
            
            {checkoutData.totalAmount > 0 && (
              <p className="text-sm font-semibold text-gray-800 mt-2">
                Total: LKR {checkoutData.totalAmount.toFixed(2)}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <p className="text-gray-600 mb-6">
            This is a demo payment page. Click "Payment Success" to test the delivery system.
            Your order will be processed and delivered via email.
          </p>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handlePaymentSuccess}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : '✅ Payment Success (Demo)'}
            </button>
            
            <button
              onClick={handlePaymentFailed}
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ❌ Payment Failed (Demo)
            </button>
          </div>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(checkoutData, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
      <FooterWithSitemap />
    </>
  );
}

export default PaymentPage;