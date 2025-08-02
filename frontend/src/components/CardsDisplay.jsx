"use client";

import Cards from "@/components/Cards";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const BooksDisplay = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const BOOKS_PER_LOAD = 12;
  const observerRef = useRef(); // Ref for Intersection Observer

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/productEbook/');

        if (response.data.success) {
          const fetchedEbooks = response.data.ebooks.filter(book => book.type === 'ebook');
          setBooks(fetchedEbooks);
        } else {
          setError(response.data.message || 'Failed to fetch ebooks.');
        }
      } catch (err) {
        console.error('Error fetching ebooks:', err.response?.data || err.message);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < books.length) {
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
  }, [books.length, visibleCount]);

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
        <p className="text-xl font-semibold">No ebooks found.</p>
        <p>It looks like there are no ebooks available at the moment.</p>
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
            onCardClick={() => console.log("Clicked:", book.name)}
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
