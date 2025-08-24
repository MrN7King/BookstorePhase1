// src/pages/ThankYouPage.jsx
import Navigation from '@/sections/Navigation';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer';

function ThankYouPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className='container mx-auto pt-8 overflow-hidden'>
                <Navigation />
            </div>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-6">
                        <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Thank You for Your Purchase!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been successfully placed. A confirmation email with your purchase details and a link to download your eBook has been sent to your email address.
                    </p>
                    <div className="mt-8">
                        <p className="text-sm text-gray-500 mb-4">
                            You can also manage your order and downloads from your account.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => navigate('/AllBooks')}
                                className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Check Out More Books
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FooterWithSitemap />
        </>
    );
}

export default ThankYouPage;