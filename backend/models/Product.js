// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  type: { type: String, enum: ['ebook', 'premium_account'], required: true },
  name: String,
  description: String,
  price: Number,
  isAvailable: Boolean,
  tags: [String],
  language: String,
  thumbnailUrl: String,
  deliveryFormat: { type: String, default: 'email' },
  cloudfrontFileKey: String,
  metadata: {
    pageCount: Number,
    platform: String
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
