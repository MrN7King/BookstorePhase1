// backend/models/Genre.js
import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Genre names should be unique
    trim: true,
  },
  bannerImageUrl: {
    type: String,
    default: '', // Store the Cloudinary URL here. Can be empty if no banner.
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model('Genre', genreSchema);