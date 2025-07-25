"use client"; // This directive is important for Next.js client components

import axios from 'axios'; // Import axios for API calls
import { useState } from 'react'; // Import useState
import { FooterWithSitemap } from '../sections/Footer'; // Assuming correct path
import Navigation from '../sections/Navigation'; // Assuming correct path

// Base URL for your backend API
const API_BASE_URL = "http://localhost:5000/api"; // Changed to general API base

// Reusable InputField component
const InputField = ({ label, type, id, value, onChange, placeholder, className = '', isRequired = false }) => (
  <div className={`mb-4 ${className}`}> {/* className passed to the wrapper div */}
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      className="shadow-sm appearance-none border border-gray-200 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-400"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={isRequired}
    />
  </div>
);

// Reusable TextAreaField component
const TextAreaField = ({ label, id, value, onChange, placeholder, className = '', isRequired = false, rows = 4 }) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      rows={rows}
      className="shadow-sm appearance-none border border-gray-200 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-400 resize-y"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={isRequired}
    ></textarea>
  </div>
);

// The actual ContactForm component
const ContactFormComponent = () => { // Renamed to avoid confusion with the page component
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // This is the user's email
    phone: '',
    message: '',
    // recipientEmail is REMOVED from frontend state as it's hardcoded on backend
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(''); // Clear previous status message
    setIsSuccess(false);

    // Basic client-side validation (recipientEmail is no longer validated here)
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatusMessage('Please fill in all required fields.');
      setIsSuccess(false);
      setIsSubmitting(false);
      return;
    }

    try {
      // Make the API call to your backend, sending the formData
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);

      if (response.data.success) {
        setStatusMessage(response.data.message);
        setIsSuccess(true);
        // Clear form fields after successful submission
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        setStatusMessage(response.data.message || 'Failed to send message.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatusMessage(error.response?.data?.message || 'There was an error sending your message. Please try again later.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Main container with full height and overflow-auto to allow scrolling if content overflows
    <div className="min-h-screen bg-white overflow-auto">
      {/* Top half with background image and overlay */}
      <div
        className="relative h-64 md:h-80 lg:h-96 w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
        style={{ backgroundImage: "url('/assets/contact1.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Contact Us text */}
        <div className="relative z-10 text-center text-white">
          <h2 className="mb-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Contact Us
          </h2>
          <p className="font-normal text-white text-sm md:text-base max-w-lg mx-auto">
            Bring on your queries, doubts, wishes and complaints to us. We will get back to you in no time, just fill the form below and see the magic.
          </p>
        </div>
      </div>

      {/* Form and Contact Info Section - Positioned relative to main container */}
      <div className="relative -mt-20 md:-mt-24 lg:-mt-28 z-20 mx-auto max-w-screen-md px-4">
        {/* Contact Form Card (background remains white) */}
        <div className="rounded-lg bg-white p-6 md:p-8 shadow-lg">
          {statusMessage && (
            <div className={`mb-4 rounded-lg p-4 text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="First Name"
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                isRequired={true}
              />
              <InputField
                label="Last Name"
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                isRequired={true}
              />
              <InputField
                label="Your email"
                type="email"
                id="email" // This is the user's email
                value={formData.email}
                onChange={handleChange}
                placeholder="John@gmail.com"
                isRequired={true}
              />
              <InputField
                label="Phone Number"
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 777 7777"
                isRequired={false}
              />
            </div>
            {/* REMOVED: Recipient Email InputField */}
            <TextAreaField
              label="Your message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Leave a comment..."
              isRequired={true}
              rows={6}
            />

            <p className="text-xs text-gray-500 leading-relaxed">
              By submitting this form you agree to our{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                terms and conditions
              </a>{" "}
              and our{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                privacy policy
              </a>{" "}
              which explains how we may collect, use and disclose your personal information including to third parties.
            </p>

            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Send message
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="mt-8 mb-8 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {/* Email Contact */}
            <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {/* Email Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Email us:</h3>
                <p className="mb-3 font-light text-gray-500">Email us for general queries, including marketing and partnership opportunities.</p>
                <a href="mailto:guru@gmail.com" className="font-medium text-blue-600 hover:underline">guru@gmail.com</a>
            </div>

            {/* Phone Contact */}
            <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {/* Phone Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Call us:</h3>
                <p className="mb-3 font-light text-gray-500">Call us to speak to a member of our team. We are always happy to help.</p>
                <a href="tel:+94777777777" className="font-medium text-blue-600 hover:underline">+94 77 777 7777</a>
            </div>

            {/* Visit our Social Media */}
            <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {/* Social Media Icon (e.g., a speech bubble or a network icon) */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18v-3m0-3h.01M6 12h.01M18 12h.01M6 18h.01"></path>
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Social Media:</h3>
                <p className="mb-3 font-light text-gray-500">Connect with us on our social media platforms for updates and engagement.</p>
                <a href="/social-media" className="font-medium text-blue-600 hover:underline inline-flex items-center">
                    Visit our Profiles
                    {/* Arrow Icon */}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};


const ContactUs = () => {
  return (
    <>
      <Navigation />
      <ContactFormComponent /> {/* Render the ContactForm component here */}
      <FooterWithSitemap />
    </>
  );
};

export default ContactUs;
