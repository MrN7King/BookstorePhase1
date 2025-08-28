// frontend/src/pages/ThankYouPage.jsx
import Navigation from '@/sections/Navigation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer';
import { useCheckout } from '../context/CheckoutContext';
import useCart from '../hooks/useCart';
import axios from 'axios';

const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/data');
        if (response.data.success) {
            return {
                isLoggedIn: true,
                user: response.data.user
            };
        }
    } catch (error) {
        console.error("Authentication check failed:", error.response?.data?.message || error.message);
    }
    return { isLoggedIn: false, user: null };
};

function ThankYouPage() {
    const navigate = useNavigate();
    const { checkoutData, clearCheckout } = useCheckout();
    const { clearCart } = useCart(); // Get the clearCart function
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initPage = async () => {
            // Check authentication status
            const { isLoggedIn: loggedInStatus, user } = await fetchUserData();
            setIsLoggedIn(loggedInStatus);
            setUserData(user);
            setLoading(false);

            // Clear the cart after successful payment
            try {
                console.log("Clearing cart after successful payment...");
                await clearCart();
                console.log("Cart cleared successfully");
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }

            // Clear checkout data
            clearCheckout();
        };

        initPage();
    }, [clearCart, clearCheckout]);

    const handleContinueShopping = () => {
        navigate('/AllBooks');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing your order...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='container mx-auto pt-8 overflow-hidden'>
                <Navigation user={userData} isLoggedIn={isLoggedIn} />
            </div>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8 min-h-screen">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Success Icon */}
                    <div className="mb-8">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                            <svg 
                                className="h-12 w-12 text-green-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 48 48" 
                                aria-hidden="true"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Thank You for Your Purchase!
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        Your order has been successfully processed and will be delivered to your email shortly.
                    </p>

                    {/* Order Details (if available) */}
                    {checkoutData.orderId && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="font-medium">Order ID:</span> {checkoutData.orderId}</p>
                                <p><span className="font-medium">Email:</span> {checkoutData.email}</p>
                                {checkoutData.totalAmount > 0 && (
                                    <p><span className="font-medium">Total:</span> LKR {checkoutData.totalAmount.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Delivery Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">What Happens Next?</h3>
                        <div className="text-sm text-blue-700 space-y-2">
                            <p>• <strong>eBooks:</strong> Download links will be sent to your email within minutes</p>
                            <p>• <strong>Premium Codes:</strong> Access codes will be included in your email</p>
                            <p>• <strong>Download Links:</strong> Valid for 24 hours from delivery</p>
                            <p>• <strong>Support:</strong> Contact us if you don't receive your email within 10 minutes</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleContinueShopping}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Go to Homepage
                        </button>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-12 text-sm text-gray-500">
                        <p>
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@yourbookstore.com" className="text-blue-600 hover:underline">
                                support@yourbookstore.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <FooterWithSitemap />
        </>
    );
}

export default ThankYouPage;