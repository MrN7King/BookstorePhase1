//backend/models/Product.js
import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type', // our "type" field
  collection: 'products',    // one physical collection
  timestamps: true,
};

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    tags: { type: [String], default: [] },
    language: String,
    thumbnailUrl: String,
    deliveryFormat: { type: String, default: 'email' },
    fileInfo: {
      fileId: String,
      fileName: String,
      bucketId: String
    },
  },
  baseOptions
);

// Export the base "Product" model
const Product = mongoose.model('Product', ProductSchema);
export default Product;