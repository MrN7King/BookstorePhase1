"use client";

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { PremiumAccountFilter } from '../components/AllBooksFilter'; // Correct path
import PremiumAccountsDisplay from '../components/PremiumCardDisplay'; // Correct path

const API_BASE_URL = 'http://localhost:5000'; // Define your backend URL here

export default function PremiumAccountsBody() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [premiumAccounts, setPremiumAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Assuming 12 items per load for infinite scroll consistency
    totalResults: 0,
    totalPages: 1,
  });
  const [activeFilters, setActiveFilters] = useState({}); // State to store filters to be applied

  // Function to open the filter modal
  const openFilterMenu = () => {
    setIsFilterMenuOpen(true);
  };

  // Function to close the filter modal
  const closeFilterMenu = () => {
    setIsFilterMenuOpen(false);
  };

  // Function to fetch premium accounts from the backend
  const fetchPremiumAccounts = useCallback(async (filters, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters from filters and pagination
      const params = {
        ...filters,
        page,
        limit: pagination.limit, // Use current limit
      };

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await axios.get(`${API_BASE_URL}/api/premium`, { params });

      // Append new data for infinite scroll if page > 1, otherwise set new data
      setPremiumAccounts(prevAccounts =>
        page === 1
          ? response.data.products || []
          : [...prevAccounts, ...(response.data.products || [])]
      );

      setPagination({
        page: response.data.page,
        limit: pagination.limit, // Keep original limit from state or response if provided
        totalResults: response.data.total, // Corrected property name from .totalResults to .total
        totalPages: response.data.totalPages, // Corrected property name from .totalPages to .totalPages
      });
    } catch (err) {
      console.error("Error fetching premium accounts:", err);
      setError("Failed to load premium accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]); // fetchPremiumAccounts now depends on pagination.limit

  // Handler for applying filters from the PremiumAccountFilter component
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters); // Update the active filters state
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new filters
    closeFilterMenu(); // Close modal after applying filters
  };

  // Effect hook to fetch premium accounts whenever activeFilters or page changes
  useEffect(() => {
    fetchPremiumAccounts(activeFilters, pagination.page);
  }, [activeFilters, pagination.page, fetchPremiumAccounts]);

  // Adjust pagination.page for infinite scroll
  const loadMorePremiumAccounts = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.totalPages, loading]);


  return (
    <div className="min-h-screen bg-white font-sans antialiased flex flex-col">
      {/* Mobile "Filter By" Button */}
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

      {/* Main content area */}
      <div className="flex flex-1 relative">
        {/* Filter Component (Desktop Sidebar) */}
        <aside className="hidden lg:block lg:w-1/4 lg:max-w-xs p-4 overflow-y-auto">
          <PremiumAccountFilter onApplyFilters={handleApplyFilters} />
        </aside>

        {/* Main Content - Premium Accounts Display */}
        <main className="flex-1 p-4 lg:p-8">
          <PremiumAccountsDisplay
            premiumAccounts={premiumAccounts} // Pass fetched premium accounts
            loading={loading}
            error={error}
            loadMore={loadMorePremiumAccounts} // Pass the loadMore function
            hasMore={pagination.page < pagination.totalPages} // Indicate if more pages exist
          />
        </main>
      </div>

      {/* Full-screen Filter Modal for Mobile */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto flex flex-col">
          <PremiumAccountFilter onClose={closeFilterMenu} onApplyFilters={handleApplyFilters} />
        </div>
      )}
    </div>
  );
}