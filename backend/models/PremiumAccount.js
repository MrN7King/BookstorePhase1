//backend/models/PremiumAccount.js
import Product from './Product.js';
import mongoose from 'mongoose';

const PremiumAccountSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    region: String,
    expirationDate: Date,
  },
  { _id: false }
);

export const PremiumAccount = Product.discriminator('premium_account', PremiumAccountSchema);