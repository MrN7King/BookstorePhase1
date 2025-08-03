//backend/controllers/premiumAccountController.js
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
import { PremiumProduct } from '../models/PremiumProduct.js';
import Product from '../models/Product.js'; // Assuming Product is a base model if PremiumProduct extends it, otherwise might not be needed here

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
    // Ensure Product model is relevant or remove if only using PremiumProduct for slug checks
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


// GET /api/premium - THIS IS THE CORRECTED VERSION YOU NEED TO REPLACE
export const listPremiumProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12, // Default to 12 as per frontend's default limit
      searchQuery,
      minPrice,
      maxPrice,
      duration,
      licenseType,
      tags,
      status, // 'active' or 'inactive'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {}; // Initialize an empty query object

    // 1. Apply Search Query (case-insensitive regex for 'name' field)
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }

    // 2. Apply Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // 3. Apply Duration Filter (expects comma-separated string, convert to array if multi-select)
    if (duration) {
      const durationArray = duration.split(',').map(d => d.trim());
      query.duration = { $in: durationArray };
    }

    // 4. Apply License Type Filter (expects comma-separated string, convert to array if multi-select)
    if (licenseType) {
      const licenseTypeArray = licenseType.split(',').map(lt => lt.trim());
      query.licenseType = { $in: licenseTypeArray };
    }

    // 5. Apply Tags Filter (expects comma-separated string, convert to array)
    // Assuming 'tags' in your model is an array of strings
    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagsArray };
    }

    // 6. Apply Status Filter
    if (status) {
      // Ensure the status in the query matches the case in your database
      // Your createPremiumProduct converts it to lowercase, so 'active' or 'inactive'
      query.status = status.toLowerCase();
    }

    // Add this console log for debugging!
    console.log("Constructed MongoDB Query:", query);

    // Get total count of documents matching the filter (for pagination metadata)
    const total = await PremiumProduct.countDocuments(query); // <-- PASS QUERY HERE

    // Fetch products matching the filter
    const products = await PremiumProduct.find(query) // <-- PASS QUERY HERE
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });

  } catch (err) {
    console.error('Error listing premium products:', err);
    return res.status(500).json({ error: 'Failed to fetch premium products' });
  }
};