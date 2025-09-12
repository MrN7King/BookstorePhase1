// frontend/src/pages/admin/adminPages/Dashboard.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import DemographicCard from "../adminComponents/DemographicCard";
import EcommerceMetrics from "../adminComponents/EcommerceMetrics";
import MonthlySalesChart from "../adminComponents/MonthlySalesChart";
import RecentOrders from "../adminComponents/RecentOrders";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;
const ANALYTICS_API_BASE_URL = "http://localhost:5000/api/analytics";

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ANALYTICS_API_BASE_URL}/dashboard`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <EcommerceMetrics data={analyticsData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <MonthlySalesChart data={analyticsData.salesData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <RecentOrders data={analyticsData.recentOrders} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      
        <DemographicCard/>
      </div>
    </div>
  );
}