// backend/routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('userId');
  res.json(orders);
});

export default router;
