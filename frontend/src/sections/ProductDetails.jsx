import React, { useState } from 'react';

const ProductDisplay = ({ initialRating = 4.2 }) => { // Added initialRating prop for dynamism
  const [activeTab, setActiveTab] = useState('description');

  // Function to render stars dynamically based on a rating value
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Rounds to the nearest 0.5 (e.g., 4.2 -> 4.0, 4.7 -> 4.5)

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(<span key={i} className="material-icons text-yellow-500 text-2xl">star</span>);
      } else if (i - 0.5 === roundedRating) {
        // Half star
        stars.push(<span key={i} className="material-icons text-yellow-500 text-2xl">star_half</span>);
      } else {
        // Empty star
        stars.push(<span key={i} className="material-icons text-gray-300 text-2xl">star_border</span>);
      }
    }
    return stars;
  };

  // Dummy content for each section
  const content = {
    description: (
      <>
        <p className="mb-4">The phenomenal fifth book in the Hunger Games series!</p>
        <p className="mb-4">When you've been set up to lose everything you love, what is there left to fight for?</p>
        <p className="mb-4">As the day dawns on the fifteenth annual Hunger Games, fear grips the districts of Panem. This year, in honor of the Quarter Quell, twice as many tributes will be taken from their homes.</p>
        <p className="mb-4">Back in District 12, Haymitch Abernathy is trying not to think too hard about his chances. All he cares about is making it through the day and being with the girl he loves.</p>
        <p>When Haymitch's name is called, he can feel all his dreams break. He's torn from his family and his love, shuttled to the Capitol with the three other District 12 tributes; a young friend who's nearly a sister to him, a compulsive oddsmaker, and the most stuck-up girl in town. As the Games begin, Haymitch understands he's been set up to fail. But there's something in him that wants to fight. . . and have that fight reverberate far beyond the deadly arena.</p>
      </>
    ),
    reviews: (
      <p className="text-gray-700">No reviews yet. Be the first to review "Taste of Italy".</p>
    ),
    productDetails: (
      <ul className="list-disc pl-5 text-gray-700">
        <li className="mb-2"><strong>Product Type:</strong> Book</li>
        <li className="mb-2"><strong>Genre:</strong> Fiction, Dystopian</li>
        <li className="mb-2"><strong>Publisher:</strong> Mockingjay Press</li>
        <li className="mb-2"><strong>Language:</strong> English</li>
        <li className="mb-2"><strong>ISBN:</strong> 978-0000000000</li>
        <li className="mb-2"><strong>Dimensions:</strong> 6 x 9 inches</li>
        <li className="mb-2"><strong>Weight:</strong> 1.5 lbs</li>
      </ul>
    ),
    aboutTheAuthor: (
      <>
        <p className="mb-4 text-gray-700"><strong>Matt Murdock</strong> is a prolific writer known for his captivating storytelling and intricate character development. With a background in law, Murdock brings a unique perspective to his narratives, often exploring themes of justice, morality, and the human condition.</p>
        <p className="text-gray-700">His works have garnered critical acclaim and a dedicated global fanbase. "Taste of Italy" is his latest masterpiece, showcasing his signature blend of suspense, emotion, and thought-provoking insights.</p>
      </>
    ),
  };

  const renderContent = () => {
    return content[activeTab];
  };

  return (
    <div className="flex flex-col md:flex-row p-5 max-w-6xl mx-auto font-sans">
      {/* Left Column (Image and Add to Cart/Favourites) */}
      <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-10 md:flex-1">
        <img
          src="/assets/Book1.jpg" // Replace with your image import
          alt="Product Image"
          className="w-full max-w-[250px] h-auto rounded-lg shadow-md"
        />
        <div className="flex items-center my-4">
          {renderStars(initialRating)}
          <span className="text-base text-gray-600 ml-2">({initialRating.toFixed(1)}/5 Stars)</span>
        </div>
        <button className="flex items-center justify-center bg-[var(--Primary-Text)] text-white border-none rounded-md py-3 px-6 text-base cursor-pointer mt-2 w-full max-w-[250px] hover:bg-gray-700 transition-colors duration-200">
          <span className="material-icons mr-2 text-xl">shopping_cart</span>
          Add To Cart
        </button>
        <button className="flex items-center justify-center bg-[var(--Accent-text)] text-white border border-gray-300 rounded-md py-3 px-6 text-base cursor-pointer mt-3 w-full max-w-[250px] hover:bg-[var(--Accent-hover)] transition-colors duration-200">
          <span className="material-icons mr-2 text-xl">favorite_border</span>
          Add to Favourites
        </button>
      </div>

      {/* Right Column (Product Details and Description) */}
      <div className="md:flex-[2]">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Taste of Italy</h1>
        <p className="text-lg text-gray-600 mb-4">BY Matt Murdock</p>
        <p className="text-3xl font-bold text-[var(--Accent-text)] mb-3">LKR 1275.00</p>
        <p className="text-base text-gray-700 mb-5">Available In Stock : 7477 Items</p>

        <div className="flex flex-wrap border-b border-gray-200 mb-5">
          <button
            className={`py-2 px-4 text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
              activeTab === 'description'
                ? 'text-[var(--Primary-Text)] border-[var(--Primary-Text)] font-semibold'
                : 'text-gray-600 border-transparent hover:text-[var(--Accent-text)] hover:border-[var(--Accent-text)]'
            }`}
            onClick={() => setActiveTab('description')}
          >
            DESCRIPTION
          </button>
          <button
            className={`py-2 px-4 text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
              activeTab === 'reviews'
                ? 'text-[var(--Primary-Text)] border-[var(--Primary-Text)] font-semibold'
                : 'text-gray-600 border-transparent hover:text-[var(--Accent-text)] hover:border-[var(--Accent-text)]'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            REVIEWS (0)
          </button>
          <button
            className={`py-2 px-4 text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
              activeTab === 'productDetails'
                ? 'text-[var(--Primary-Text)] border-[var(--Primary-Text)] font-semibold'
                : 'text-gray-600 border-transparent hover:text-[var(--Accent-text)] hover:border-[var(--Accent-text)]'
            }`}
            onClick={() => setActiveTab('productDetails')}
          >
            PRODUCT DETAILS
          </button>
          <button
            className={`py-2 px-4 text-base cursor-pointer outline-none border-b-2 transition-all duration-300 ${
              activeTab === 'aboutTheAuthor'
                ? 'text-[var(--Primary-Text)] border-[var(--Primary-Text)] font-semibold'
                : 'text-gray-600 border-transparent hover:text-[var(--Accent-text)] hover:border-[var(--Accent-text)]'
            }`}
            onClick={() => setActiveTab('aboutTheAuthor')}
          >
            ABOUT THE AUTHOR
          </button>
        </div>
        <div className="text-base leading-relaxed text-gray-800">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;