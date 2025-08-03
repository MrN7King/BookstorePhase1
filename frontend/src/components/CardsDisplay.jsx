"use client";

import Cards from "@/components/Cards";
import { Spinner } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

// BooksDisplay now accepts 'books', 'loading', 'error' as props
const BooksDisplay = ({ books, loading, error }) => {
  const navigate = useNavigate();


  const [visibleCount, setVisibleCount] = useState(12);
  const BOOKS_PER_LOAD = 12;
  const observerRef = useRef();


  // Infinite scroll logic - now depends on the 'books' prop's length
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only load more if not currently loading and there are more books to show
        if (!loading && entries[0].isIntersecting && visibleCount < books.length) {
          setVisibleCount((prev) => prev + BOOKS_PER_LOAD);
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
  }, [books.length, visibleCount, loading]); // Added 'loading' to dependencies

  // Handler for when a card is clicked - now redirects to product page
  const handleCardClick = (bookId) => {
    navigate(`/product/${bookId}`);
  };

  // The loading, error, and no books found checks are now handled by the props
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
        <p className="ml-4 text-lg text-gray-700">Loading books...</p>
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

  if (books.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        <p className="text-xl font-semibold">No ebooks found matching your criteria.</p>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="grid max-[325px]:grid-cols-1 max-[325px]:place-items-center min-[326px]:grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {books.slice(0, visibleCount).map((book) => (
          <Cards
            key={book._id}
            book={{
              id: book._id,
              title: book.name,
              author: book.author,
              rating: book.rating || 0,
              price: `LKR ${book.price.toFixed(2)}`,
              image: book.thumbnailUrl || 'https://placehold.co/300x400?text=No+Image',
            }}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Intersection Observer Trigger */}
      {visibleCount < books.length && (
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

export default BooksDisplay;