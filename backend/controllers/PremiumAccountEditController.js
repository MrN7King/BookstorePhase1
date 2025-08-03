// File: backend/controllers/PremiumAccountEditController.js
import { v2 as cloudinary } from 'cloudinary';
import { PremiumProduct } from '../models/PremiumProduct.js';


// GET single premium product by ID
export const getPremiumProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await PremiumProduct.findById(id).lean();
    if (!product) {
      // Consistent error message structure
      return res.status(404).json({ success: false, message: 'Premium product not found' });
    }
    // Consistent success response structure
    return res.status(200).json({ success: true, premiumProduct: product });
  } catch (err) {
    console.error('Error fetching premium product:', err);
    // Add specific handling for invalid Mongoose IDs
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// PUT update premium product
export const updatePremiumAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const premium = await PremiumProduct.findById(id);
    if (!premium) return res.status(404).json({ error: 'Premium account not found' });
    
    // SAFETY: Handle undefined req.body
    const body = req.body || {};

    // Handle thumbnail upload from Multer
    if (req.file) {
      const thumbFile = req.file;

      // Delete old thumbnail if exists
      if (premium.thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(premium.thumbnailPublicId, { invalidate: true });
        } catch (err) {
          console.warn('Could not delete old thumbnail:', err.message);
        }
      }

      // Upload new thumbnail
      const thumbRes = await new Promise((resolve, reject) => {
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

        // Use the buffer from Multer
        uploadStream.end(thumbFile.buffer);
      });

      premium.thumbnailUrl = thumbRes.secure_url;
      premium.thumbnailPublicId = thumbRes.public_id;
      
      // Clear buffer memory after upload
      thumbFile.buffer = null;
    }

    // Update other fields using the safe 'body' reference
    const updateFields = [
      'name', 'slug', 'description', 'price', 'isAvailable',
      'status', 'tags', 'platform', 'duration', 'licenseType'
    ];

    updateFields.forEach(field => {
      if (body[field] !== undefined) {
        premium[field] = body[field];
      }
    });

    // Handle array fields
    if (body.tags) {
      if (typeof body.tags === 'string') {
        body.tags = body.tags.split(',').filter(tag => tag.trim() !== '');
      }
    }

    if (body.tags !== undefined) {
      premium.tags = body.tags;
    }

    // Convert price to number
    if (body.price) {
      premium.price = parseFloat(body.price);
    }

    // Convert boolean fields
    if (body.isAvailable !== undefined) {
      premium.isAvailable = body.isAvailable === 'true';
    }

    const updated = await premium.save();
    res.json(updated);

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
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

// Controller to create a premium product (assuming this exists)
export const createPremiumProduct = async (req, res) => {
  // ... (existing implementation for creating a premium product)
  try {
    const {
      name, slug, description, price, isAvailable,
      status, tags, thumbnailUrl, thumbnailPublicId, deliveryFormat,
      platform, duration, licenseType
    } = req.body;

    const newPremiumProduct = new PremiumProduct({
      name,
      slug,
      description,
      price,
      isAvailable: isAvailable === 'true', // Convert string to boolean
      status,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      thumbnailUrl,
      thumbnailPublicId,
      deliveryFormat,
      platform,
      duration,
      licenseType,
    });

    const savedProduct = await newPremiumProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating premium product:', error);
    // Handle duplicate slug error specifically if needed
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(409).json({ error: 'A product with this slug already exists.' });
    }
    res.status(500).json({ error: 'Failed to create premium product', details: error.message });
  }
};


// Controller to list all premium products with filtering and pagination
export const listPremiumProducts = async (req, res) => {
  try {
    const {
      page = 1, // Default page to 1
      limit = 12, // Default limit to 12
      searchQuery,
      minPrice,
      maxPrice,
      platform,
      duration,
      licenseType,
      tags,
      status, // isAvailable filter (active/inactive)
    } = req.query;

    const query = { type: 'premium_account' }; // Ensure we only query premium products

    // Search Query
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { platform: { $regex: searchQuery, $options: 'i' } }, // Search in platform as well
      ];
    }

    // Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Platform (can be a comma-separated string)
    if (platform) {
      const platformsArray = platform.split(',').map(p => new RegExp(p.trim(), 'i'));
      query.platform = { $in: platformsArray };
    }

    // Duration (can be a comma-separated string)
    if (duration) {
      const durationsArray = duration.split(',').map(d => new RegExp(d.trim(), 'i'));
      query.duration = { $in: durationsArray };
    }

    // License Type (can be a comma-separated string)
    if (licenseType) {
      const licenseTypesArray = licenseType.split(',').map(lt => new RegExp(lt.trim(), 'i'));
      query.licenseType = { $in: licenseTypesArray };
    }

    // Tags (can be a comma-separated string)
    if (tags) {
      const tagsArray = tags.split(',').map(t => new RegExp(t.trim(), 'i'));
      query.tags = { $in: tagsArray };
    }

    // Status (isAvailable is a boolean, status is 'active'/'inactive')
    if (status) {
      // Assuming 'status' filter on frontend maps to 'isAvailable' on backend
      // Or if you want to filter by the 'status' field ('active', 'inactive')
      // Let's assume frontend 'status' refers to 'isAvailable' for now, as that's
      // a common user-facing filter (e.g., "Available items").
      // If you intend to filter by the `status` enum ('active', 'inactive'),
      // then adjust the frontend filter name and this logic accordingly.
       query.status = status; // This directly uses the enum 'active'/'inactive'
    }


    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const products = await PremiumProduct.find(query)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use .lean() for faster query results if you don't need Mongoose Document methods

    const totalResults = await PremiumProduct.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limitNum);

    res.status(200).json({
      products,
      page: pageNum,
      limit: limitNum,
      total: totalResults,
      totalPages,
    });

  } catch (err) {
    console.error('Error listing premium products:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

