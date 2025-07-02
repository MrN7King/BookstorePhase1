// src/sections/NewsletterSection.jsx
"use client";

import { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribe email:', email);
    alert(`Thank you for subscribing, ${email}!`); 
    setEmail(''); 
  };

  return (
    // Outer container: full width, no external margins/paddings
    // Background color matching the screenshot's muted tone
    <section className="w-full bg-sky-300/50 text-black"> {/* Muted beige/tan background */}
      <div className="flex flex-col md:flex-row items-center justify-between
                      px-4 py-4 md:py-5 lg:py-6 /* Reduced padding for compactness */
                      max-w-screen-xl mx-auto">

        {/* Left Side: Newsletter Title and Description */}
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-extrabold font-poppins uppercase tracking-wider text-gray-800"> {/* Darker text, uppercase, tracking */}
            Newsletter
          </h2>
          <p className="text-sm sm:text-base mt-1 text-gray-600"> {/* Smaller, subtle description */}
            Sign up for early access to our <span className="inline md:block">latest products and exclusive offers.</span> {/* MODIFIED: Line break only on md (laptop) and larger screens */}
          </p>
        </div>

        {/* Right Side: Email Input Field and Button */}
        <div className="w-full md:w-auto flex-grow flex justify-center md:justify-end">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-sm"> {/* MODIFIED: Removed space-x-2 to make them stick */}
            <input
              type="email"
              placeholder="Email" // Placeholder text as in screenshot
              className="flex-grow p-2.5 border border-gray-300 bg-white text-gray-900
                         placeholder-gray-500 focus:outline-none 
                         transition-all duration-200 shadow-sm rounded-l-md /* MODIFIED: Added rounded-l-md, removed rounded-md */
                         rounded-r-none /* MODIFIED: Ensure no right roundness */"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#040417] text-white px-5 py-2.5 font-semibold font-poppins
                         hover:bg-blue-700 active:scale-98 transition-all duration-200
                         shadow-sm hover:shadow-md focus:outline-none 
                         rounded-r-md /* MODIFIED: Added rounded-r-md, removed rounded-md */
                         rounded-l-none /* MODIFIED: Ensure no left roundness */"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
