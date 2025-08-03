"use client";

import Card from "@/components/Cards"; // Assuming Cards.jsx is in components/Cards.jsx
import { Spinner } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

const PremiumAccountsDisplay = ({ premiumAccounts, loading, error, loadMore, hasMore }) => {
  const navigate = useNavigate();
  const observerRef = useRef();

  // State to track if the initial render with data has completed
  const [initialRenderDone, setInitialRenderDone] = useState(false);

  // Infinite scroll logic
  useEffect(() => {
    // Only set up observer once the component has data (to avoid false positives on initial empty array)
    if (!initialRenderDone && premiumAccounts.length > 0) {
      setInitialRenderDone(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger loadMore when the target is intersecting and there's more data to fetch
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore(); // Call the loadMore function passed from the parent
        }
      },
      {
        root: null, // relative to the viewport
        rootMargin: "0px",
        threshold: 1.0, // Trigger when 100% of the target is visible
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore, loadMore, premiumAccounts.length, initialRenderDone]); // Dependencies updated

  const handleCardClick = (premiumAccountId) => {
    navigate(`/premium-product/${premiumAccountId}`);
  };

  if (loading && premiumAccounts.length === 0) { // Only show full spinner on initial load when no data is present
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
        {premiumAccounts.map((account) => (
          <Card
            key={account._id}
            book={{ // Mapping premium account data to the 'book' prop expected by Card
              id: account._id,
              title: account.name || "Untitled Account",
              author: account.platform || "N/A", // Re-using 'author' for platform if needed for display
              rating: account.rating || 0, // Assuming rating might be part of premium account
              price: `LKR ${account.price ? account.price.toFixed(2) : '0.00'}`,
              image: account.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
              genre: account.platform || "Platform", 
            }}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Intersection Observer Trigger */}
      {hasMore && ( // Only show trigger if there's more to load
        <div
          ref={observerRef}
          className="w-full flex justify-center py-8"
        >
          {loading ? ( // Show spinner only when loading more
            <Spinner className="h-10 w-10 text-sky-500" />
          ) : (
            <div className="text-gray-500">Scroll down to load more...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumAccountsDisplay;