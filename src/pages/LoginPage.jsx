"use client"; // This directive is necessary for client-side components like those using useState, useEffect, and motion.
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion"; // Corrected import from "motion/react" to "framer-motion"
import { useEffect, useState } from 'react';

// Reusable InputField component for consistency
const InputField = ({ label, type, id, value, onChange, placeholder, className = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      className={`shadow-sm appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

// AnimatedTooltip Component (Provided by user, adjusted for h-8 w-8 avatars)
export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event) => {
    // Use currentTarget for event delegation to get the element the event listener is attached to
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          // Adjusted margin to reduce overlap. -mr-1 is less aggressive than -mr-2.
          // The goal is to make them slightly overlap but still be distinct.
          className="group relative -mr-1"
          key={item.id} // Use item.id as key for unique items
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
                {/* Decorative gradients for the tooltip */}
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                {/* Tooltip content */}
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            // Set explicit height and width attributes to match Tailwind classes (h-8 w-8 = 32px)
            height={32}
            width={32}
            src={item.image}
            alt={item.name}
            // Ensure the image styling matches the original avatars
            className="relative !m-0 h-8 w-8 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </>
  );
};


// Main Login Page Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Effect to load Tailwind CSS and Inter font.
  // In a full application, this would typically be in your main App.jsx or index.html.
  useEffect(() => {
    const interLink = document.createElement('link');
    interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    interLink.rel = 'stylesheet';
    document.head.appendChild(interLink);

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    const style = document.createElement('style');
    style.innerHTML = `
      body {
        font-family: 'Inter', sans-serif;
        background-color: #F8F9FA; /* Light background to match the image */
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove injected elements if component unmounts
    return () => {
      document.head.removeChild(interLink);
      document.head.removeChild(tailwindScript);
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle login logic here
    console.log('Login attempt:', { email, password, rememberMe });
    // Using alert for demo, replace with proper UI feedback
    // IMPORTANT: Do NOT use alert() in production apps or in final Canvas submissions.
    // Use a custom modal or toast notification instead.
    alert('Login form submitted! (Check console for data)');
  };

  
  const readers = [];
  for (let i = 1; i <= 5; i++) {
    readers.push({
      id: i, // Unique ID for each looped item
      name: "Alice Wonderland",
      designation: "Avid Fantasy Reader",
      image: "https://placehold.co/32x32/FFD700/FFFFFF?text=R1",
    });
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg max-w-md w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-left">Welcome back</h2>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* "or" separator */}
            <div className="flex items-center justify-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="flex items-center justify-center flex-grow bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
              <button className="flex items-center justify-center flex-grow bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
                <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" alt="Apple" className="w-5 h-5 mr-2" />
                Sign in with Apple
              </button>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex justify-between items-center mb-6 text-sm">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
              Sign in to your account
            </button>
          </form>

          {/* Don't have an account? Sign up */}
          <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">Sign up</a>
          </div>
        </div>
      </div>

      {/* Right Section: Blue Description Panel (Hidden on mobile) */}
      <div className="hidden md:flex w-full md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center text-center p-8 lg:p-12">
        <div className="max-w-md">
          {/* Bookstore Logo/Icon - Using a simple book icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-3xl font-extrabold">BookVerse</span> {/* Changed to BookVerse */}
          </div>

          {/* Updated Bookstore Description */}
          <h3 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Explore a universe of captivating stories.
          </h3>
          <p className="text-base lg:text-lg mb-8">
            Thousands of readers and authors from around the world share their passion
            for literature on BookVerse - your gateway to endless adventures and knowledge.
          </p>

          {/* Customer Avatars and Count - Now using AnimatedTooltip */}
          <div className="flex items-center justify-center">
            <div className="flex -space-x-2 overflow-hidden">
              <AnimatedTooltip items={readers} />
            </div>
            <span className="text-lg font-semibold">Over <span className="text-yellow-300">15.7K</span> Happy Readers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
