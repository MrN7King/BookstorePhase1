"use client";

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AllBooksFilter } from '../components/AllBooksFilter';
import BooksDisplay from '../components/CardsDisplay';

export default function AllBooksBody({ genres }) {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalResults: 0,
        totalPages: 1,
    });
    const [activeFilters, setActiveFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    const openFilterMenu = () => {
        setIsFilterMenuOpen(true);
    };

    const closeFilterMenu = () => {
        setIsFilterMenuOpen(false);
    };

    const handleApplyFilters = (filters) => {
        // Update URL search parameters to reflect new filters
        const newSearchParams = new URLSearchParams();
        if (filters.categories) {
            newSearchParams.set('genres', filters.categories);
        }
        setSearchParams(newSearchParams);
        setActiveFilters(filters);
        setPagination(prev => ({ ...prev, page: 1 }));
        closeFilterMenu();
    };

    const fetchBooks = useCallback(async (filters, page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                ...filters,
                page,
                limit: pagination.limit,
            };

            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            const response = await axios.get('http://localhost:5000/api/productEbook/filtered', { params });

            setBooks(response.data.ebooks);
            setPagination({
                page: response.data.page,
                limit: response.data.limit,
                totalResults: response.data.totalResults,
                totalPages: Math.ceil(response.data.totalResults / response.data.limit),
            });
        } catch (err) {
            console.error("Error fetching books:", err);
            setError("Failed to load books. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [pagination.limit]);

    // Initial filter sync with URL
    useEffect(() => {
        const genreParam = searchParams.get('genres');
        if (genreParam) {
            const initialFilters = { categories: genreParam };
            setActiveFilters(initialFilters);
        } else {
            setActiveFilters({});
        }
    }, [searchParams]);

    // Effect hook to fetch books whenever activeFilters or page changes
    useEffect(() => {
        fetchBooks(activeFilters, pagination.page);
    }, [activeFilters, pagination.page, fetchBooks]);

    return (
        <div className="min-h-screen bg-White font-sans antialiased flex flex-col">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>{`body { font-family: 'Inter', sans-serif; }`}</style>

            <div className="fixed top-4 right-4 z-50 lg:hidden">
                <button
                    onClick={openFilterMenu}
                    className="flex items-center justify-center space-x-2 mt-16 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Open filters"
                >
                    <span className="font-semibold text-lg">Filter By</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-360 280-560h400L480-360Z"/></svg>
                </button>
            </div>

            <div className="flex flex-1 relative">
                <aside className="hidden lg:block lg:w-1/4 lg:max-w-xs p-4 overflow-y-auto">
                    <AllBooksFilter onApplyFilters={handleApplyFilters} initialFilters={activeFilters} genres={genres} />
                </aside>

                <main className="flex-1 p-4 lg:p-8">
                    {loading && <div className="text-center text-lg text-blue-600">Loading books...</div>}
                    {error && <div className="text-center text-lg text-red-600">{error}</div>}
                    {!loading && !error && books.length === 0 && (
                        <div className="text-center text-lg text-gray-700">No books found matching your criteria.</div>
                    )}
                    {!loading && !error && books.length > 0 && (
                        <>
                            <BooksDisplay books={books} />
                        </>
                    )}
                </main>
            </div>

            {isFilterMenuOpen && (
                <div className="fixed inset-0 bg-white z-[60] overflow-y-auto flex flex-col">
                    <AllBooksFilter onClose={closeFilterMenu} onApplyFilters={handleApplyFilters} initialFilters={activeFilters} genres={genres} />
                </div>
            )}
        </div>
    );
}