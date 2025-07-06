// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Add a product
router.post('/', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
