"use client";

import { useState } from 'react';
import { FooterWithSitemap } from '../sections/Footer';
import Navigation from '../sections/Navigation';

// Reusable FAQ Item component for clean code
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// The About Us and FAQ component
const AboutUsAndFAQ = ({}) => {
  // Define your FAQ data
  const faqData = [
    {
      question: "What kind of premium accounts do you sell?",
      answer: "We offer a curated selection of premium accounts for popular services. Our inventory is constantly updated to bring you access to the best digital experiences."
    },
    {
      question: "How do I receive my premium account details after purchase?",
      answer: "After a successful purchase, your premium account details will be delivered directly to your registered email address typically within minutes. For some specialized accounts, delivery might take up to a few hours, but we aim for immediate access."
    },
    {
      question: "Are the books you sell digital or physical?",
      answer: "All books available on our platform are digital and physical. You'll receive a download link or access instructions immediately after purchase, allowing you to read them on your preferred device."
    },
    {
      question: "What if I have issues with my purchase?",
      answer: "Our dedicated support team is here to help! If you encounter any issues with your premium account or e-book purchase, please contact us at support@yourbookstore.com or through our contact form. We strive to resolve all inquiries promptly."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the nature of digital goods and premium accounts, our refund policy varies by product. Please review the specific product description or our comprehensive Refund Policy page for detailed information before making a purchase. Your satisfaction is important to us, and we'll always work to find a fair resolution."
    }
  ];

  return (
    <div className="bg-white " style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero section with background image */}
      <div
        className="relative h-100 w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
        style={{ backgroundImage: `url('/assets/contact1.jpg')` }} // You can change this image to something more book/digital themed
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight " >
            About Us
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Your gateway to premium digital experiences and a world of knowledge.
          </p>
        </div>
        </div>

      {/* Main content sections with internal padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 ">

        {/* About Us Section */}
        <div className="text-center mb-16">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Our Story</p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Welcome to BookUniverse, your premier online destination for both cutting-edge digital premium accounts and an extensive library of e-books. Founded in 2025, we embarked on a mission to simplify access to exclusive digital services and foster a love for reading in the digital age.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            We understand the growing demand for premium online experiences and instant access to knowledge. That's why we meticulously curate our offerings, ensuring you get legitimate, reliable premium accounts and a diverse collection of e-books across all genres. Our platform is built for ease of use, security, and instant gratification.
          </p>
        </div>

        {/* Values/Principles Section */}
        <div className="mb-16">
          <h3 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Value 1: Accessibility */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Accessibility Icon (e.g., a hand reaching for a book/screen) */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h4>
              <p className="text-gray-600">
                We aim to make premium digital experiences and vast knowledge bases easily accessible to everyone.
              </p>
            </div>

            {/* Value 2: Trust & Security */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Trust & Security Icon (e.g., a shield) */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.928 14H12c-.447 0-.877.086-1.282.247M21 12c0 3.86-1.28 7.49-3.488 10A11.955 11.955 0 0112 21.056c-2.456 0-4.789-.854-6.688-2.308"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Trust & Security</h4>
              <p className="text-gray-600">
                We prioritize the legitimacy of our products and the security of your transactions and data.
              </p>
            </div>

            {/* Value 3: Diverse Selection */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Diverse Selection Icon (e.g., multiple books or a variety of shapes) */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Diverse Selection</h4>
              <p className="text-gray-600">
                From cutting-edge premium accounts to a rich library of e-books, we offer variety for every interest.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mt-16 mb-16">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Frequently Asked Questions</p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Have questions about buying premium accounts or e-books? Find quick answers here!
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
           <h2 className="mt-5 text-md text-center font-semibold text-blue-600">Still have questions? We're here to help!</h2>
        </div>

      </div>

    </div>
  );
};


// The main AboutUsPage component
const AboutUsPage = () => {
  // Example of how you might get the image URL dynamically (e.g., from an API or a local state)
  const [currentBgImage, setCurrentBgImage] = useState('/assets/about-bg.jpg'); // Default image (you might want to find a more suitable image for an e-bookstore)

  // You could add an input field here or in an admin panel to change this state
  const handleImageChange = (e) => {
    setCurrentBgImage(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content Area (About Us & FAQ) */}
      <main className="flex-grow">
        <AboutUsAndFAQ heroBgImage={currentBgImage} /> {/* Pass the image URL as a prop */}
      </main>

      {/* Footer */}
      <FooterWithSitemap />
    </div>
  );
};

export default AboutUsPage;