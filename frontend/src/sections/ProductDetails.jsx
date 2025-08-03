// file: frontend/src/sections/productDetails.jsx

import { Spinner } from "@material-tailwind/react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Define your API base URL here (from .env file)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/productEbook/${bookId}`); // Use base URL

        if (response.data.success && response.data.ebook) {
          setBook(response.data.ebook);
        } else {
          setError(response.data.message || 'Failed to fetch book details.');
        }
      } catch (err) {
        console.error('Error fetching book details:', err.response?.data || err.message);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const renderStars = (rating) => {
    const stars = [];
    const safeRating = typeof rating === 'number' ? rating : 0;
    const roundedRating = Math.round(safeRating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} className="material-icons text-yellow-500 text-lg sm:text-xl md:text-2xl">star</span>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<span key={i} className="material-icons text-yellow-500 text-lg sm:text-xl md:text-2xl">star_half</span>);
      } else {
        stars.push(<span key={i} className="material-icons text-gray-300 text-lg sm:text-xl md:text-2xl">star_border</span>);
      }
    }
    return stars;
  };

  // Dynamic content for different tabs (Description, Reviews, Product Details)
  const content = {
    description: (
      <>
        <p className="text-sm sm:text-base mb-4">{book?.description || "No description available."}</p>
      </>
    ),
    reviews: (
      <p className="text-sm sm:text-base text-gray-700">No reviews yet for "{book?.name}". Be the first to review!</p>
    ),
    productDetails: (
      <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
        <li className="mb-2"><strong>Product Type:</strong> {book?.type || 'N/A'}</li>
        {book?.tags && book.tags.length > 0 && (
          <li className="mb-2 flex flex-wrap items-center">
            <strong>Genre:</strong>
            <div className="flex flex-wrap gap-2 ml-2">
              {book.tags.map((tag, index) => (
                <span
                  key={index}
                  className="
                    bg-gray-200 text-gray-800 text-xs sm:text-sm px-3 py-1 rounded-full
                    hover:bg-gray-300 transition-colors duration-200
                    font-medium
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        )}
        <li className="mb-2"><strong>Publisher:</strong> {book?.publisher || 'N/A'}</li>
        <li className="mb-2"><strong>Language:</strong> {book?.language || 'N/A'}</li>
        <li className="mb-2"><strong>ISBN:</strong> {book?.ISBN || 'N/A'}</li>
        <li className="mb-2"><strong>Publication Date:</strong> {book?.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : 'N/A'}</li>
        <li className="mb-2"><strong>File Format:</strong> {book?.metadata?.fileFormat || 'N/A'}</li>
        <li className="mb-2"><strong>File Size: </strong> {book?.metadata?.fileSize ? `${(book.metadata.fileSize / (1024)).toFixed(2)} MB` : 'N/A'}</li> {/* Corrected to MB from Bytes */}
        <li className="mb-2"><strong>Page Count:</strong> {book?.metadata?.pageCount || 'N/A'}</li>
      </ul>
    ),
    aboutTheAuthor: (
      <p className="text-sm sm:text-base text-gray-700">Details about {book?.author || 'the author'} are not available yet.</p>
    )
  };

  const renderContent = () => {
    return content[activeTab];
  };

  // --- Conditional Rendering for Loading, Error, and Not Found States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[70vh]">
        <Spinner className="h-12 w-12" />
        <p className="ml-4 text-lg text-gray-700">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 sm:p-8 min-h-[50vh] sm:min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-red-600 text-lg sm:text-xl font-semibold">Error:</p>
        <p className="text-sm sm:text-base">{error}</p>
        <button onClick={() => navigate('/AllBooks')} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-base">Back to Books</button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center p-4 sm:p-8 min-h-[50vh] sm:min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-gray-600 text-lg sm:text-xl font-semibold">Book not found.</p>
        <button onClick={() => navigate('/AllBooks')} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-base">Back to Books</button>
      </div>
    );
  }

  // --- Main Product Display UI (when book data is available) ---
  return (
    <div className="p-4 sm:p-6 md:p-8 font-sans min-h-screen bg-white">
      {/* Ensure Material Icons font is loaded if not already global */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-4 md:py-8 gap-6 md:gap-10">
        {/* Left Column (Image and Actions) */}
        <div className="flex flex-col items-center w-full md:w-1/3 lg:w-2/5">
          <img
            src={book.thumbnailUrl || 'https://placehold.co/250x350?text=No+Image'}
            alt={book.name || "Product Image"}
            className="w-full max-w-[250px] sm:max-w-[300px] h-auto rounded-lg shadow-md object-cover mb-4"
          />
          <div className="flex items-center my-2 sm:my-4">
            {renderStars(book.rating)}
            <span className="text-xs sm:text-sm text-gray-600 ml-2">({(book.rating || 0).toFixed(1)}/5 Stars)</span>
          </div>
          <button className="flex items-center justify-center bg-gray-900 text-white border-none rounded-md py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base cursor-pointer mt-2 w-full max-w-[250px] hover:bg-gray-700 transition-colors duration-200">
            <span className="material-icons mr-2 text-lg sm:text-xl">shopping_cart</span>
            Add To Cart
          </button>
          <button className="flex items-center justify-center bg-blue-600 text-white border border-gray-300 rounded-md py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base cursor-pointer mt-3 w-full max-w-[250px] hover:bg-blue-700 transition-colors duration-200">
            <span className="material-icons mr-2 text-lg sm:text-xl">favorite_border</span>
            Add to Favourites
          </button>
        </div>

        {/* Right Column (Product Details and Description Tabs) */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-800">{book.name || 'Untitled Book'}</h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-4">BY {book.author || 'Unknown Author'}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2 sm:mb-3">LKR {book.price ? book.price.toFixed(2) : 'N/A'}</p>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5">Available In Stock : {book.isAvailable ? 'Yes' : 'No'} {book.quantityAvailable ? `(${book.quantityAvailable} items)` : ''}</p>

          {/* Tab Section: Adjusting font sizes for responsiveness */}
          <div className="flex justify-between border-b border-gray-200 mb-4 sm:mb-5">
            
            <button
              className={`flex-1 text-center py-2 px-1 text-xs sm:text-sm md:text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
                activeTab === 'description'
                  ? 'text-gray-900 border-gray-900 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
              }`}
              onClick={() => setActiveTab('description')}
            >
              DESCRIPTION
            </button>
            <button
              className={`flex-1 text-center py-2 px-1 text-xs sm:text-sm md:text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'text-gray-900 border-gray-900 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              REVIEWS (0)
            </button>
            <button
              className={`flex-1 text-center py-2 px-1 text-xs sm:text-sm md:text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
                activeTab === 'productDetails'
                  ? 'text-gray-900 border-gray-900 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
              }`}
              onClick={() => setActiveTab('productDetails')}
            >
              PRODUCT DETAILS
            </button>
            <button
              className={`flex-1 text-center py-2 px-1 text-xs sm:text-sm md:text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
                activeTab === 'aboutTheAuthor'
                  ? 'text-gray-900 border-gray-900 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
              }`}
              onClick={() => setActiveTab('aboutTheAuthor')}
            >
              ABOUT THE AUTHOR
            </button>
          </div>
          {/* End Tab Section */}

          <div className="text-sm sm:text-base leading-relaxed text-gray-800">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;