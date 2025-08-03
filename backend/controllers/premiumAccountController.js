//backend/controllers/premiumAccountController.js
import Product from '../models/Product.js';
import { PremiumProduct } from '../models/PremiumProduct.js';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'premium-thumbnails',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};

export const createPremiumProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      isAvailable,
      status,
      platform,
      duration,
      licenseType,
    } = req.body;

     let tags = req.body.tags;
    // Convert tags string to array if needed
    if (typeof tags === 'string') {
      tags = tags.split(',').filter(tag => tag.trim() !== '');
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

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

    // Handle thumbnail upload
    let thumbnailUrl = '';
    let thumbnailPublicId = '';

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        thumbnailUrl = result.secure_url;
        thumbnailPublicId = result.public_id;
      } catch (uploadError) {
        console.error('Thumbnail upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Thumbnail upload failed'
        });
      }
    }

    // Create new premium product
    const premiumProduct = new PremiumProduct({
      name,
      slug,
      description: description || '',
      price: parseFloat(price),
      isAvailable: Boolean(isAvailable),
      status: status.toLowerCase(),
      tags,
      deliveryFormat: 'email',
      type: 'premium_account',
      platform,
      duration,
      licenseType,
      thumbnailUrl,
      thumbnailPublicId
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
      .sort({ createdAt: -1 })
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