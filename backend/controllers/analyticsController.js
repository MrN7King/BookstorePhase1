// backend/controllers/analyticsController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);

    // Get today's stats
    const todayOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfToday } 
    });
    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: startOfToday } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);

    // Get weekly stats
    const weeklyOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfWeek } 
    });
    const weeklyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: startOfWeek } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);

    // Get monthly stats
    const monthlyOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: startOfMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);

    // Get yearly stats
    const yearlyOrders = await Order.countDocuments({ 
      createdAt: { $gte: startOfYear } 
    });
    const yearlyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: startOfYear } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$payment.amount" } } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "firstName lastName email");

    // Get top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.productSnapshot.price"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Populate product details for top products
    const topProductsWithDetails = await Product.populate(topProducts, {
      path: "_id",
      select: "name thumbnailUrl"
    });

    // Get sales data for charts
    const salesData = await Order.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$payment.amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0
        },
        weekly: {
          orders: weeklyOrders,
          revenue: weeklyRevenue[0]?.total || 0
        },
        monthly: {
          orders: monthlyOrders,
          revenue: monthlyRevenue[0]?.total || 0
        },
        yearly: {
          orders: yearlyOrders,
          revenue: yearlyRevenue[0]?.total || 0
        },
        recentOrders,
        topProducts: topProductsWithDetails,
        salesData: salesData.map(item => ({
          date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
          sales: item.totalSales,
          revenue: item.totalRevenue
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data"
    });
  }
};