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
const AboutUsAndFAQ = ({}) => { // Added heroBgImage prop with a default
  // Define your FAQ data
  const faqData = [
    {
      question: "What is your mission?",
      answer: "Our mission is to empower individuals and businesses with innovative and reliable solutions that simplify complex processes and foster growth. We strive to create products and services that are intuitive, efficient, and accessible to everyone."
    },
    {
      question: "Where are you located?",
      answer: "We are primarily a remote-first company with team members distributed globally. Our main operational hub is based in Colombo, Sri Lanka, allowing us to draw from diverse talent and perspectives."
    },
    {
      question: "What services do you offer?",
      answer: "We specialize in providing cutting-edge web development, mobile application development, cloud solutions, and IT consulting services. Our offerings are tailored to meet the unique needs of startups, small businesses, and large enterprises."
    },
    {
      question: "How can I get support?",
      answer: "You can reach our support team via email at support@yourcompany.com, by phone at +1-XXX-XXX-XXXX, or by visiting our comprehensive knowledge base for self-service solutions. We aim to respond to all inquiries within 24 business hours."
    },
    {
      question: "Do you offer custom solutions?",
      answer: "Absolutely! We understand that every business has unique requirements. We pride ourselves on developing bespoke solutions that are perfectly aligned with your specific goals and operational needs. Contact us to discuss your project."
    }
  ];

  return (
    <div className="bg-white"> {/* Removed overall py for page padding, will apply to sections */}
      {/* Hero section with background image */}
      <div
        className="relative h-96 w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
        style={{ backgroundImage: `url('/assets/contact1.jpg')` }} // Use the prop here
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            About Us
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Learn more about our mission, values, and the dedicated team behind our success.
          </p>
        </div>
      </div>

      {/* Main content sections with internal padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32"> {/* Added padding here */}

        {/* About Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Our Story</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Who We Are</p> {/* Changed heading */}
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            We are a passionate team dedicated to crafting exceptional digital experiences. Founded in 2020, our journey began with a simple idea: to bridge the gap between complex technology and user-friendly solutions. We believe in innovation, integrity, and building lasting relationships with our clients.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Our expertise spans across various domains, enabling us to deliver high-quality, scalable, and secure applications. From initial concept to deployment and beyond, we are committed to providing unparalleled support and driving success for your projects.
          </p>
        </div>

        {/* Values/Principles Section (Optional, but common in About Us) */}
        <div className="mb-16">
          <h3 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Value 1 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Innovation Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v14m-7 0h14a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-gray-600">
                We constantly explore new technologies and creative approaches to deliver cutting-edge solutions.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Client Focus Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.199-1.299-.575-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.199-1.299.575-1.857m0 0a9.965 9.965 0 011.642-2.316l2.062-2.062a4.86 4.86 0 00.916-.916l-2.062-2.062a9.965 9.965 0 01-2.316-1.642m0 0C6.541 7.247 5.767 6 4 6c-1.767 0-3.041 1.247-4 2.228M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.199-1.299-.575-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.199-1.299.575-1.857m0 0a9.965 9.965 0 011.642-2.316l2.062-2.062a4.86 4.86 0 00.916-.916l-2.062-2.062a9.965 9.965 0 01-2.316-1.642m0 0C6.541 7.247 5.767 6 4 6c-1.767 0-3.041 1.247-4 2.228"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Client Focus</h4>
              <p className="text-gray-600">
                Your success is our priority. We listen, understand, and tailor our solutions to your unique needs.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center items-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Integrity Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.928 14H12c-.447 0-.877.086-1.282.247M21 12c0 3.86-1.28 7.49-3.488 10A11.955 11.955 0 0112 21.056c-2.456 0-4.789-.854-6.688-2.308"></path></svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h4>
              <p className="text-gray-600">
                We operate with transparency, honesty, and a strong commitment to ethical practices in all we do.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mt-16 mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Got Questions?</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Frequently Asked Questions</p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Find quick answers to the most common questions about our company and services below. If you can't find what you're looking for, feel free to contact us directly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

      </div>
    </div>
  );
};


// The main AboutUsPage component
const AboutUsPage = () => {
  // Example of how you might get the image URL dynamically (e.g., from an API or a local state)
  const [currentBgImage, setCurrentBgImage] = useState('/assets/about-bg.jpg'); // Default image

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