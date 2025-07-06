// File: backend/models/PremiumCredential.js
import mongoose from 'mongoose';

const premiumCredentialSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  email: String,
  password: String,
  additionalNotes: String,
  isAssigned: {
    type: Boolean,
    default: false,
  },
  assignedToOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('PremiumCredential', premiumCredentialSchema);
