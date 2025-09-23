"use client";

import { useState } from "react";


const Card = ({ book, onCardClick, onAddToCart }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!book) return null;

  
  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    if (isAddingToCart || addedToCart) return;

    setIsAddingToCart(true);

    try {
      const payload = {
        _id: book.id,
        name: book.title,
        price: Number(book.price) || 0,
        thumbnailUrl: book.image,
      };

      await onAddToCart?.(payload);

      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000); // Revert back after 2 seconds

    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optional: Show an error message to the user
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getButtonContent = () => {
    if (addedToCart) {
      return (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 animate-checkmark" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
          <span className="animate-fadeIn">Added!</span>
        </>
      );
    }
    
    if (isAddingToCart) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="ml-2">Adding...</span>
        </div>
      );
    }
    
    return (
      <>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add to Cart</span>
      </>
    );
  };

  const getButtonStyles = () => {
    const baseStyles = "w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md";
    
    if (addedToCart) {
      return `${baseStyles} bg-green-600 hover:bg-green-700 text-white animate-pulse-once`;
    }
    
    if (isAddingToCart) {
      return `${baseStyles} bg-gray-600 text-white cursor-not-allowed`;
    }
    
    return `${baseStyles} bg-gray-900 hover:bg-gray-800 text-white hover:scale-[1.02] active:scale-[0.98]`;
  };

  return (
    <div
      onClick={() => onCardClick?.(book.id)}
      className="
        relative group flex flex-col w-full max-w-[250px]
        rounded-2xl shadow-md border border-white/10 overflow-hidden cursor-pointer
        bg-gradient-to-br from-[#b9dfff] via-[#e0f2fe] to-[#dafff7]
        transition-shadow hover:shadow-xl duration-300
      "
    >
      {/* Book Cover */}
      <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
        <img
          src={book.image || "https://placehold.co/160x220/eeeeee/444444?text=Book"}
          alt={book.title || "Book Cover"}
          className="w-full h-full object-cover duration-500 hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x220/eeeeee/444444?text=Error"; }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/70 backdrop-blur-md px-2 py-0.5 text-xs font-semibold rounded-full text-gray-700">
          {book.genre || "Genre"}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{book.title || "Untitled Book"}</h3>
        <p className="text-sm text-gray-600">{book.author || "Unknown Author"}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-sky-700">{book.price ? `LKR ${book.price.toFixed(2)}` : "Free"}</span>
         
        </div>
      </div>

      {/* Add to Cart */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleAddToCartClick}
          disabled={isAddingToCart || addedToCart}
          className={getButtonStyles()}
        >
          {getButtonContent()}
        </button>
      </div>

      {/* Add these styles for the animations */}
      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-checkmark {
          animation: checkmark 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Card;