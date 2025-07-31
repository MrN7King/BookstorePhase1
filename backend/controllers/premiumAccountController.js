//backend/controllers/premiumAccountController.js
import Product from '../models/Product.js';
import { PremiumProduct } from '../models/PremiumProduct.js';

export const createPremiumProduct = async (req, res) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      price, 
      isAvailable, 
      status, 
      tags, 
      platform, 
      duration, 
      licenseType 
    } = req.body;

    // Validate required fields
    if (!name || !slug || !price || !platform || !duration || !licenseType) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        error: 'Slug must be unique'
      });
    }

    // Create new premium product
    const premiumProduct = new PremiumProduct({
      name,
      slug,
      description: description || '',
      price: parseFloat(price),
      isAvailable: Boolean(isAvailable),
      status: status.toLowerCase(),
      tags: Array.isArray(tags) ? tags : [],
      deliveryFormat: 'email',
      type: 'premium_account',
      platform,
      duration,
      licenseType
    });

    const savedProduct = await premiumProduct.save();

    res.status(201).json({
      success: true,
      message: 'Premium account created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating premium product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


// GET /api/premium
export const listPremiumProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await PremiumProduct.find()
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PremiumProduct.countDocuments();

    return res.status(200).json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error listing premium products', err);
    return res.status(500).json({ error: 'Failed to fetch premium products' });
  }
};