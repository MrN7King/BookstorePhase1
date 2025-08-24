"use client";
import Navigation from '@/sections/Navigation';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterWithSitemap } from '../sections/Footer';

axios.defaults.withCredentials = true;

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
        return { isLoggedIn: false, user: null };
    }
};

const InputField = ({ label, type, id, value, onChange, placeholder, className = "" }) => (
    <div className="mb-3">
        <label htmlFor={id} className="block text-gray-700 text-xs font-semibold mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            className={`shadow-sm appearance-none border border-gray-200 rounded-md w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);

const SignupPopup = ({ isOpen, onClose, onSignupSuccess }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const API_URL = "http://localhost:5000/api/user";

    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setOtp('');
            setMessage('');
            setIsError(false);
            setLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            setIsError(true);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/register`, { email, password, confirmPassword });
            setMessage(response.data.message || "Registration successful! A verification code has been sent to your email.");
            setIsError(false);
            setStep(2);
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            setMessage(err.response?.data?.message || "Signup failed. Please try again.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await axios.post(`${API_URL}/verify-email-signup`, { email, otp });
            setMessage(response.data.message || "Account verified successfully! You are now logged in.");
            setIsError(false);

            if (response.data.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            onSignupSuccess();

        } catch (err) {
            console.error("OTP verification error:", err.response?.data || err.message);
            setMessage(err.response?.data?.message || "OTP verification failed. Please check the code and try again.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black" onClick={onClose}></motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6 z-[101]"
            >
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition z-[102]" aria-label="Close">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="max-w-sm w-full mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        {step === 1 ? "Create your account" : "Verify your email"}
                    </h2>
                    {message && (
                        <div
                            className={`bg-${isError ? "red" : "green"}-100 border border-${isError ? "red" : "green"}-200 text-${isError ? "red" : "green"}-700 px-4 py-3 rounded-md mb-4 text-sm`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSubmit}>
                            <InputField
                                label="Email" type="email" id="signup-email"
                                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                            />
                            <InputField
                                label="Password" type="password" id="signup-password"
                                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            />
                            <InputField
                                label="Confirm Password" type="password" id="signup-confirm-password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                            />
                            <button
                                type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold hover:bg-blue-700 transition"
                                disabled={loading}
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                            <div className="mt-5 text-center text-gray-600 text-xs">
                                Already have an account?{" "}
                                <button type="button" onClick={onClose} className="text-blue-600 hover:underline font-medium">
                                    Sign in
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                A 6-digit verification code has been sent to **{email}**. Please enter it below.
                            </p>
                            <InputField
                                label="Verification Code" type="text" id="signup-otp"
                                value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code"
                                className="text-center tracking-widest text-lg"
                            />
                            <button
                                type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-md text-base font-semibold hover:bg-green-700 transition"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify Account"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const ForgotPasswordPopup = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:5000/api/user";

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmNewPassword("");
            setMessage("");
            setIsError(false);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/send-reset-otp`, { email });
            setMessage(response.data.message || "OTP sent to your email!");
            setIsError(false);
            setStep(2);
        } catch (error) {
            console.error("Request OTP error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to request OTP. Please try again.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSetNewPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setMessage("Passwords do not match.");
            setIsError(true);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/reset-password`, { email, otp: String(otp), newPassword });
            setMessage(response.data.message || "Password reset successfully!");
            setIsError(false);
            setStep(3);
            setTimeout(onClose, 3000);
        } catch (error) {
            console.error("Reset password error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to reset password. Invalid OTP or email.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black" onClick={onClose}></motion.div>
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 z-[101]">
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition" aria-label="Close">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Forgot Your Password?</h2>
                        <p className="text-gray-600 text-sm mb-6 text-center">Enter your email to receive a One-Time Password (OTP).</p>
                        {message && <div className={`bg-${isError ? "red" : "blue"}-100 border border-${isError ? "red" : "blue"}-200 text-${isError ? "red" : "blue"}-700 px-4 py-3 rounded-md mb-4 text-sm`} role="alert">{message}</div>}
                        <form onSubmit={handleRequestOtp}>
                            <InputField label="Email" type="email" id="forgot-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" />
                            <button type="submit" className={`w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold transition mt-4 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</button>
                        </form>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Set New Password</h2>
                        <p className="text-gray-600 text-sm mb-6 text-center">An OTP has been sent to <span className="font-semibold text-gray-800">{email}</span>. Please enter it below.</p>
                        {message && <div className={`bg-${isError ? "red" : "blue"}-100 border border-${isError ? "red" : "blue"}-200 text-${isError ? "red" : "blue"}-700 px-4 py-3 rounded-md mb-4 text-sm`} role="alert">{message}</div>}
                        <form onSubmit={handleSetNewPassword}>
                            <InputField label="One-Time Password (OTP)" type="number" id="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="text-center tracking-widest text-lg" />
                            <InputField label="New Password" type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                            <InputField label="Confirm New Password" type="password" id="confirm-new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="••••••••" />
                            <button type="submit" className={`w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold transition mt-4 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} disabled={loading}>{loading ? "Resetting Password..." : "Reset Password"}</button>
                        </form>
                    </>
                )}
                {step === 3 && (
                    <div className="text-center">
                        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900">Success!</h3>
                        <p className="mt-1 text-sm text-gray-500">{message}</p>
                        <div className="mt-4">
                            <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};


function CheckoutDetailsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showGuestEmailInput, setShowGuestEmailInput] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [loginIsError, setLoginIsError] = useState(false);
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            setLoading(true);
            const { isLoggedIn: loggedInStatus, user } = await fetchUserData();
            setIsLoggedIn(loggedInStatus);
            setUserData(user);
            setLoading(false);
        };
        checkLoginStatus();
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginMessage('');
        setLoginIsError(false);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/user/login',
                { email: loginEmail, password: loginPassword }
            );

            if (response.data.success) {
                setIsLoggedIn(true);
                setUserData(response.data.user); // <-- This is the crucial fix
                setLoginMessage('Login successful!');
                setLoginIsError(false);
                setLoginEmail('');
                setLoginPassword('');
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || error.message);
            setLoginMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setLoginIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckoutAsGuestClick = () => {
        setShowGuestEmailInput(true);
    };

    const handleGuestEmailChange = (e) => {
        setGuestEmail(e.target.value);
    };

    const handleProceedToPayment = () => {
        const emailToUse = isLoggedIn ? (userData?.email || '') : guestEmail;

        if (!emailToUse) {
            alert('Please enter your email to continue.');
            return;
        }

        console.log('Proceeding to payment. Email:', emailToUse);
        navigate('/payment');
    };

    const handleOpenSignupPopup = () => {
        setShowSignupPopup(true);
    };

    const handleCloseSignupPopup = () => {
        setShowSignupPopup(false);
    };

    const handleSignupSuccess = async () => {
        const { isLoggedIn: loggedInStatus, user } = await fetchUserData();
        setIsLoggedIn(loggedInStatus);
        setUserData(user);
        setShowSignupPopup(false);
    };

    const handleOpenForgotPasswordPopup = () => {
        setShowForgotPasswordPopup(true);
    };

    const handleCloseForgotPasswordPopup = () => {
        setShowForgotPasswordPopup(false);
    };

    if (loading) {
        return <div className="text-center mt-20 text-gray-600">Loading checkout...</div>;
    }

    return (
        <>
            <div className='container mx-auto pt-8 overflow-hidden'>
                <Navigation user={userData} isLoggedIn={isLoggedIn} />
            </div>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-8">
                <div className="flex justify-items-start items-center mb-8 text-xs sm:text-sm md:text-base">
                    <div
                        className="flex items-center text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate('/cart')}
                    >
                        <span className="mr-2">1</span>
                        <span className="uppercase">Shopping Cart</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold">
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

                {isLoggedIn ? (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Review Your Details</h2>
                        <p className="text-gray-700 mb-6 text-center">
                            Your eBook will be sent to the email address in the text box below.
                        </p>
                        <div className="mb-6">
                            <label htmlFor="userEmail" className="block text-gray-700 text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="userEmail"
                                value={userData?.email || ''}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign in</h2>
                        {loginMessage && (
                            <div
                                className={`bg-${loginIsError ? "red" : "green"}-100 border border-${loginIsError ? "red" : "green"}-200 text-${loginIsError ? "red" : "green"}-700 px-4 py-3 rounded-md mb-4 text-sm`}
                                role="alert"
                            >
                                {loginMessage}
                            </div>
                        )}
                        {!showGuestEmailInput ? (
                            <>
                                <form onSubmit={handleSignIn}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="********"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 mb-6"
                                    >
                                        Sign In
                                    </button>
                                </form>
                                <div className="text-center">
                                    <p className="text-gray-600 mb-2">
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={handleOpenSignupPopup}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                    <p className="text-gray-600 mb-6">
                                        <button
                                            type="button"
                                            onClick={handleOpenForgotPasswordPopup}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    </p>
                                    <div className="text-gray-500 font-bold mb-4">OR</div>
                                    <button
                                        onClick={handleCheckoutAsGuestClick}
                                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        Checkout as Guest
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-700 mb-4 text-center">
                                    Please enter your email address to proceed as a guest. Your eBook will be sent to this email.
                                </p>
                                <div className="mb-6">
                                    <label htmlFor="guestEmail" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="guestEmail"
                                        value={guestEmail}
                                        onChange={handleGuestEmailChange}
                                        className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Proceed to Payment
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <FooterWithSitemap />
            <AnimatePresence>
                {showSignupPopup && (
                    <SignupPopup
                        isOpen={showSignupPopup}
                        onClose={handleCloseSignupPopup}
                        onSignupSuccess={handleSignupSuccess}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showForgotPasswordPopup && (
                    <ForgotPasswordPopup
                        isOpen={showForgotPasswordPopup}
                        onClose={handleCloseForgotPasswordPopup}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default CheckoutDetailsPage;