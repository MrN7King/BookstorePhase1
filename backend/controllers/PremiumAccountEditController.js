// File: backend/controllers/PremiumAccountEditController.js
import { PremiumProduct } from '../models/PremiumProduct.js';
import Product from '../models/Product.js';

// GET single premium product by ID
export const getPremiumProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await PremiumProduct.findById(id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// PUT update premium product
export const updatePremiumProduct = async (req, res) => {
  const { id } = req.params;
  const update = { ...req.body };
  delete update._id; // prevent changing ID

  try {
    const updated = await PremiumProduct.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    // Check for MongoDB duplicate key error (e.g., duplicate slug)
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({
        message: 'Slug must be unique.',
        code: 11000,
        keyPattern: err.keyPattern
      });
    }

    console.error('Error updating product', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// DELETE premium product
export const deletePremiumProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const del = await PremiumProduct.findByIdAndDelete(id).lean();
    if (!del) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product', err);
    return res.status(500).json({ error: 'Server error' });
  }
};