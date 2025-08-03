// components/PremiumAccountsDisplay.jsx (or wherever you prefer to place it)
"use client";

import Card from "@/components/Cards"; // Assuming Cards.jsx is in components/Cards.jsx
import { Spinner } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom

const PREMIUM_ACCOUNTS_PER_LOAD = 12; // Adjusted constant name

const PremiumAccountsDisplay = ({ premiumAccounts, loading, error }) => {
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(PREMIUM_ACCOUNTS_PER_LOAD);
  const observerRef = useRef();

  // Infinite scroll logic - now depends on the 'premiumAccounts' prop's length
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only load more if not currently loading and there are more premiumAccounts to show
        if (!loading && entries[0].isIntersecting && visibleCount < premiumAccounts.length) {
          setVisibleCount((prev) => prev + PREMIUM_ACCOUNTS_PER_LOAD);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [premiumAccounts.length, visibleCount, loading]);

  // Handler for when a card is clicked - now redirects to premium product page
  const handleCardClick = (premiumAccountId) => {
    // IMPORTANT: Make sure you have a route like /premium-product/:id set up in your frontend router
    navigate(`/premium-product/${premiumAccountId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
        <p className="ml-4 text-lg text-gray-700">Loading premium accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p className="text-xl font-semibold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!premiumAccounts || premiumAccounts.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        <p className="text-xl font-semibold">No premium accounts found matching your criteria.</p>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="grid max-[325px]:grid-cols-1 max-[325px]:place-items-center min-[326px]:grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {premiumAccounts.slice(0, visibleCount).map((account) => (
          <Card
            key={account._id} // Use _id from the backend data
            book={{ // Mapping premium account data to the 'book' prop expected by the Card component
              id: account._id,
              title: account.name || "Untitled Account", // Assuming 'name' from backend is the title
              author: account.platform || "N/A", // Using platform as a secondary identifier if no specific 'author' equivalent
              rating: account.rating || 0, // Premium accounts might not have ratings, default to 0
              price: `LKR ${account.price ? account.price.toFixed(2) : '0.00'}`, // Ensure price is formatted
              image: account.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image', // Assuming thumbnailUrl for image
              genre: account.platform || "Platform", // Using platform as the genre/category
              // Add other relevant premium account fields here if Card can display them
            }}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Intersection Observer Trigger */}
      {visibleCount < premiumAccounts.length && (
        <div
          ref={observerRef}
          className="w-full flex justify-center py-8"
        >
          <Spinner className="h-10 w-10 text-sky-500" />
        </div>
      )}
    </div>
  );
};

export default PremiumAccountsDisplay;