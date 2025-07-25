//backend/models/Ebook.js
import Product from './Product.js';
import mongoose from 'mongoose';

const EbookSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    ISBN: String,
    publicationDate: Date,
    publisher: String,
    edition: String,
    metadata: {
      pageCount: Number,
      fileSize: Number,    // in KB or MB
      fileFormat: String,  // PDF, EPUB, MOBI
    },
  },
  { _id: false }
);

// Creates a separate logical model under the same collection
export const Ebook = Product.discriminator('ebook', EbookSchema);