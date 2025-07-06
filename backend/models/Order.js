// backend/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      type: String,
      deliveryDetails: {
        cloudfrontUrl: String,
        credentials: {
          email: String,
          password: String
        }
      }
    }
  ],
  totalAmount: Number,
  emailDeliveredTo: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  logs: [
    {
      status: { type: String, enum: ['sent', 'failed'] },
      message: String,
      timestamp: Date
    }
  ]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
