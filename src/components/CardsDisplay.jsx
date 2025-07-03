"use client";
import { useState } from "react";
import Cards from "@/components/Cards"; // Assuming Card is in the same folder

const BooksDisplay = () => {
  const books = [
    { id: 1, title: 'Mystery of the Lost Island', author: 'Jane Doe', rating: 4.5, price: 'LKR 175.00', image: './assets/Book1.jpg' },
    { id: 2, title: 'The Enigmatic Code', author: 'John Smith', rating: 3.8, price: 'LKR 200.00', image: './assets/Book1.jpg' },
    { id: 3, title: 'Whispers in the Dark', author: 'Alice Johnson', rating: 5.0, price: 'LKR 150.00', image: './assets/Book1.jpg' },
    { id: 4, title: 'Journey to the Stars', author: 'Robert Brown', rating: 4.2, price: 'LKR 220.00', image: './assets/Book1.jpg' },
    { id: 5, title: 'The Silent Forest', author: 'Emily White', rating: 3.5, price: 'LKR 180.00', image: './assets/Book1.jpg' },
    { id: 6, title: 'Echoes of the Past', author: 'Michael Green', rating: 4.7, price: 'LKR 250.00', image: './assets/Book1.jpg' },
    { id: 7, title: 'City of Shadows', author: 'Sarah Davis', rating: 4.0, price: 'LKR 190.00', image: './assets/Book1.jpg' },
    { id: 8, title: 'The Last Key', author: 'David Wilson', rating: 4.9, price: 'LKR 210.00', image: './assets/Book1.jpg' },
    { id: 9, title: 'Beyond the Horizon', author: 'Olivia Moore', rating: 4.3, price: 'LKR 230.00', image: './assets/Book1.jpg' },
    { id: 10, title: 'Secrets of the Deep', author: 'Daniel Taylor', rating: 3.9, price: 'LKR 160.00', image: './assets/Book1.jpg' },
    { id: 11, title: 'The Forgotten Prophecy', author: 'Sophia King', rating: 4.6, price: 'LKR 240.00', image: './assets/Book1.jpg' },
    { id: 12, title: 'Wings of Dawn', author: 'James Lee', rating: 4.1, price: 'LKR 195.00', image: './assets/Book1.jpg' },
    { id: 13, title: 'Starlight Saga', author: 'Ava Wright', rating: 4.8, price: 'LKR 260.00', image: './assets/Book1.jpg' },
    { id: 14, title: 'The Crystal Caves', author: 'Noah Hall', rating: 3.7, price: 'LKR 170.00', image: './assets/Book1.jpg' },
  ];

  const BOOKS_PER_LOAD = 12;
  const [visibleCount, setVisibleCount] = useState(BOOKS_PER_LOAD);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BOOKS_PER_LOAD);
  };

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="grid max-[325px]:grid-cols-1 max-[325px]:place-items-center min-[326px]:grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
      ">
        {books.slice(0, visibleCount).map((book, idx) => (
          <Cards
            key={book.id}
            book={book}
            index={idx}
            current={null}
            onCardClick={() => console.log("Clicked:", book.title)}
          />
        ))}
      </div>

      {visibleCount < books.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-700 transition-transform active:scale-95"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksDisplay;
