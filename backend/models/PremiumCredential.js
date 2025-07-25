//backend/models/PremiumCredential.js
import mongoose from 'mongoose';

const premiumCredentialSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  additionalNotes: String,
  isAssigned: { type: Boolean, default: false },
  assignedToOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
}, { timestamps: true });

export default mongoose.model('PremiumCredential', premiumCredentialSchema);