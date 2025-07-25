// frontend/app/login/page.jsx
"use client";
import axios from "axios";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react"; // Corrected import: useEffect and useState from 'react'

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Define your backend API base URL
const API_USER_URL = "http://localhost:5000/api/user";
const API_BASE_URL = "http://localhost:5000/api/auth";

// Reusable InputField component
const InputField = ({ label, type, id, value, onChange, placeholder, className = "", formPrefix = "" }) => (
  <div className="mb-3">
    <label htmlFor={`${formPrefix}${id}`} className="block text-gray-700 text-xs font-semibold mb-1">
      {label}
    </label>
    <input
      type={type}
      id={`${formPrefix}${id}`}
      className={`shadow-sm appearance-none border border-gray-200 rounded-md w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

// Tooltip avatars component
export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const x = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 5 };
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  const handleMouseMove = (event) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group relative -mr-0.5"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={32}
            width={32}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-8 w-8 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </>
  );
};

// Forgot Password Modal Component (integrated with backend)
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state for buttons

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage("");
      setIsError(false);
      setLoading(false); // Reset loading state on open
    }
  }, [isOpen]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsError(false);
    setLoading(true); // Set loading true

    if (!email) {
      setMessage("Please enter your email address.");
      setIsError(true);
      setLoading(false); // Reset loading
      return;
    }

    try {
      const response = await axios.post(`${API_USER_URL}/send-reset-otp`, {
        email,
      });
      setMessage(response.data.message || "OTP sent to your email!");
      setIsError(false);
      setStep(2); // Move to OTP input step
    } catch (error) {
      console.error("Request OTP error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Failed to request OTP. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsError(false);
    setLoading(true); // Set loading true

    if (!otp || !newPassword || !confirmNewPassword) {
      setMessage("All fields are required.");
      setIsError(true);
      setLoading(false); // Reset loading
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      setLoading(false); // Reset loading
      return;
    }

    try {
      const response = await axios.post(`${API_USER_URL}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage(response.data.message || "Password reset successfully!");
      setIsError(false);
      setStep(4); // Go to success step
      setTimeout(onClose, 3000); // Close modal after success
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Failed to reset password. Invalid OTP or email."
      );
      setIsError(true);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 z-50"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Dynamic Content based on Step */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter your email address to receive a One-Time Password (OTP).
            </p>

            {message && (
              <div
                className={`bg-${
                  isError ? "red" : "blue"
                }-100 border border-${
                  isError ? "red" : "blue"
                }-200 text-${
                  isError ? "red" : "blue"
                }-700 px-4 py-3 rounded-md mb-4 text-sm`}
                role="alert"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleRequestOtp}>
              <InputField
                label="Email"
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                formPrefix="forgot-pass-"
              />
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold transition mt-4 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Set New Password
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              An OTP has been sent to{" "}
              <span className="font-semibold text-gray-800">{email}</span>. Please
              enter it below along with your new password.
            </p>

            {message && (
              <div
                className={`bg-${
                  isError ? "red" : "blue"
                }-100 border border-${
                  isError ? "red" : "blue"
                }-200 text-${
                  isError ? "red" : "blue"
                }-700 px-4 py-3 rounded-md mb-4 text-sm`}
                role="alert"
              >
                {message}
              </div>
            )}
            <form onSubmit={handleSetNewPassword}>
              <InputField
                label="One-Time Password (OTP)"
                type="number"
                id="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center tracking-widest text-lg"
                formPrefix="forgot-pass-"
              />
              <InputField
                label="New Password"
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                formPrefix="forgot-pass-"
              />
              <InputField
                label="Confirm New Password"
                type="password"
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                formPrefix="forgot-pass-"
              />
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold transition mt-4 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setEmail("");
                  setIsError(false);
                  setLoading(false); // Reset loading
                }}
                className="w-full text-blue-600 hover:underline font-medium mt-3"
                disabled={loading} // Disable resend while resetting
              >
                Resend OTP / Change Email
              </button>
            </form>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Your password has been successfully reset. You can now log in with your
              new password. This modal will close shortly.
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-blue-600 hover:underline font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}

        {step !== 4 && (
          <div className="mt-4 text-center text-xs">
            <button
              onClick={onClose}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Login Form with backend integration
const LoginForm = ({
  onSwitchToSignup,
  onLoginSuccess,
  onForgotPassword,
  formPrefix,
  onOpenVerifyOtpModal,
}) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(`${API_USER_URL}/login`, {
        email,
        password,
      }, { withCredentials: true });

      setMessage(response.data.message || "Login Successful!");
      setIsError(false);
      setTimeout(onLoginSuccess, 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      setIsError(true);

      // Handle unverified account: if backend sends a tempToken, open OTP modal
      if (err.response?.data?.tempToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${err.response.data.tempToken}`;
        onOpenVerifyOtpModal(email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-left">
        Welcome back
      </h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <div
            className={`bg-${
              isError ? "red" : "green"
            }-100 border border-${
              isError ? "red" : "green"
            }-200 text-${
              isError ? "red" : "green"
            }-700 px-4 py-3 rounded-md mb-4 text-sm`}
            role="alert"
          >
            {message}
          </div>
        )}
        <InputField
          label="Email"
          type="email"
          id="email"
          formPrefix={formPrefix}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          id="password"
          formPrefix={formPrefix}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="flex justify-between items-center mb-5 text-xs">
          <label className="flex items-center text-gray-600">
            <input
              type="checkbox"
              className="form-checkbox h-3 w-3 text-blue-600 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="ml-1.5">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 hover:underline font-medium focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign in"}
        </button>
      </form>

      <div className="mt-5 text-center text-gray-600 text-xs">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

// Verify Signup OTP Modal component
const VerifySignupOtpModal = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setMessage(`An OTP has been sent to ${email}. Please enter it below.`);
      setIsError(false);
      setResendCountdown(60);
      setCanResend(false);
    }
  }, [isOpen, email]);

  useEffect(() => {
    let timer;
    if (isOpen && resendCountdown > 0 && !canResend) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [isOpen, resendCountdown, canResend]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (!otp) {
      setMessage("Please enter the OTP.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-email-signup`, {
        email,
        otp
      });
      
      setMessage(response.data.message || "Account verified successfully!");
      setIsError(false);
      
      if (response.data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      setTimeout(() => {
        onVerificationSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/send-initial-verify-otp`, {
        email // Send email to resend OTP
      });
      
      setMessage(response.data.message || "OTP re-sent to your email!");
      setIsError(false);
      setResendCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Failed to resend OTP. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 z-50"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Verify Your Account
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          An OTP has been sent to{" "}
          <span className="font-semibold text-gray-800">{email}</span>. Please
          enter it below to verify your account.
        </p>

        {message && (
          <div
            className={`bg-${
              isError ? "red" : "blue"
            }-100 border border-${
              isError ? "red" : "blue"
            }-200 text-${
              isError ? "red" : "blue"
            }-700 px-4 py-3 rounded-md mb-4 text-sm`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <InputField
            label="One-Time Password (OTP)"
            type="number"
            id="signup-otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            className="text-center tracking-widest text-lg"
            formPrefix="signup-verify-"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold hover:bg-blue-700 transition mt-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            className={`w-full text-blue-600 hover:underline font-medium mt-3 ${
              !canResend || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canResend || loading}
          >
            Resend OTP{" "}
            {resendCountdown > 0 && !canResend ? `(${resendCountdown}s)` : ""}
          </button>
        </form>

        <div className="mt-4 text-center text-xs">
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline font-medium"
          >
            Cancel and Back to Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// SignupForm with backend integration
const SignupForm = ({
  onSwitchToLogin,
  onSignupSuccess,
  formPrefix,
  onOpenVerifyOtpModal,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_USER_URL}/register`, {
        email,
        password,
        confirmPassword,
      });

      setMessage(response.data.message || "Registration successful!");
      setIsError(false);

      if (response.data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      onOpenVerifyOtpModal(email);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || "Signup failed. Please try again."
      );
      setIsError(true);
      
      if (err.response?.data?.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${err.response.data.token}`;
        onOpenVerifyOtpModal(email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-left">
        Create your account
      </h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <div
            className={`bg-${
              isError ? "red" : "green"
            }-100 border border-${
              isError ? "red" : "green"
            }-200 text-${
              isError ? "red" : "green"
            }-700 px-4 py-3 rounded-md mb-4 text-sm`}
            role="alert"
          >
            {message}
          </div>
        )}
        <InputField
          label="Email"
          type="email"
          id="email"
          formPrefix={formPrefix}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          id="password"
          formPrefix={formPrefix}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <InputField
          label="Confirm Password"
          type="password"
          id="confirm-password"
          formPrefix={formPrefix}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-md text-base font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-5 text-center text-gray-600 text-xs">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

// LoginPage component
const LoginPage = ({ isOpen, onClose }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isVerifySignupOtpModalOpen, setIsVerifySignupOtpModalOpen] =
    useState(false);
  const [signupEmailForOtp, setSignupEmailForOtp] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .perspective-1000 { perspective: 1000px; }
      .transform-style-preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const readers = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    name: "Alice Wonderland",
    designation: "Avid Fantasy Reader",
    image: `./public/assets/user1.png`,
  }));

  if (!isOpen) return null;

  const handleOpenForgotPassword = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleOpenVerifySignupOtpModal = (email) => {
    setSignupEmailForOtp(email);
    setIsVerifySignupOtpModalOpen(true);
  };

  const handleCloseVerifySignupOtpModal = () => {
    setIsVerifySignupOtpModalOpen(false);
    setSignupEmailForOtp("");
  };

  const handleSignupVerificationSuccess = () => {
    setIsLoginActive(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden md:h-[500px]"
      >
        {/* Close Button for Main Modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full h-full relative">
          <div className="w-1/2 flex-shrink-0 flex items-center justify-center p-6 bg-white z-10">
            <LoginForm
              onSwitchToSignup={() => setIsLoginActive(false)}
              onLoginSuccess={onClose}
              onForgotPassword={handleOpenForgotPassword}
              onOpenVerifyOtpModal={handleOpenVerifySignupOtpModal}
              formPrefix="desktop-login-"
            />
          </div>
          <div className="w-1/2 flex-shrink-0 flex items-center justify-center p-6 bg-white z-0">
            <SignupForm
              onSwitchToLogin={() => setIsLoginActive(true)}
              onSignupSuccess={onClose}
              onOpenVerifyOtpModal={handleOpenVerifySignupOtpModal}
              formPrefix="desktop-signup-"
            />
          </div>
          <motion.div
            initial={false}
            animate={{ x: isLoginActive ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 text-white flex flex-col justify-center items-center text-center p-8 shadow-lg z-20"
          >
            <div className="max-w-xs">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold">GurUniverse</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 leading-tight">
                {isLoginActive ? "New Here?" : "Welcome Back!"}
              </h3>
              <p className="text-sm mb-6">
                {isLoginActive
                  ? "Sign up and discover a universe of captivating stories and knowledge."
                  : "Already part of our reading community? Sign in to continue your journey."}
              </p>
              <div className="flex items-center justify-center">
                <div className="flex -space-x-2 p-2">
                  <AnimatedTooltip items={readers} />
                </div>
                <span className="text-sm font-semibold">
                  {" "}
                  Over <span className="text-yellow-300">15.7K</span> Happy Readers
                </span>
              </div>
              <button
                onClick={() => setIsLoginActive(!isLoginActive)}
                className="mt-6 px-5 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition"
              >
                {isLoginActive ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full perspective-1000 flex items-center justify-center p-4 sm:p-5">
          <div
            className={`relative w-full h-[500px] transition-transform duration-700 ease-in-out transform-style-preserve-3d ${
              isLoginActive ? "" : "rotate-y-180"
            }`}
          >
            {/* Login Form for Mobile */}
            <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-4">
              <LoginForm
                onSwitchToSignup={() => setIsLoginActive(false)}
                onLoginSuccess={onClose}
                onForgotPassword={handleOpenForgotPassword}
                onOpenVerifyOtpModal={handleOpenVerifySignupOtpModal}
                formPrefix="mobile-login-"
              />
            </div>
            {/* Signup Form for Mobile */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-4">
              <SignupForm
                onSwitchToLogin={() => setIsLoginActive(true)}
                onSignupSuccess={onClose}
                onOpenVerifyOtpModal={handleOpenVerifySignupOtpModal}
                formPrefix="mobile-signup-"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotPasswordModalOpen && (
          <ForgotPasswordModal
            isOpen={isForgotPasswordModalOpen}
            onClose={handleCloseForgotPassword}
          />
        )}
      </AnimatePresence>

      {/* Verify Signup OTP Modal */}
      <AnimatePresence>
        {isVerifySignupOtpModalOpen && (
          <VerifySignupOtpModal
            isOpen={isVerifySignupOtpModalOpen}
            onClose={handleCloseVerifySignupOtpModal}
            email={signupEmailForOtp}
            onVerificationSuccess={handleSignupVerificationSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
