// backend/routes/analytics.js
import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'owner')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};

// Dashboard analytics endpoint
router.get('/dashboard', isAdmin, getDashboardAnalytics);

export default router;