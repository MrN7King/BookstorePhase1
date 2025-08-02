// File: backend/controllers/PremiumAccountEditController.js
import { PremiumProduct } from '../models/PremiumProduct.js';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import stream from 'stream';


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