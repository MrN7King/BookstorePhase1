// backend/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import { mergeCart } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Register (basic)
router.post('/register', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Existing routes...
router.post('/merge-cart', protect, mergeCart); // 👈 This is new

export default router;


//✅ 5. Frontend Merge Logic
// After login/register success on the frontend:

// js
// Copy
// Edit
// const localCart = JSON.parse(localStorage.getItem('cart')) || [];

// if (localCart.length > 0) {
//   try {
//     await axios.post('/api/users/merge-cart', { cart: localCart }, {
//       headers: { Authorization: `Bearer ${userToken}` }
//     });
//     localStorage.removeItem('cart'); // Clear guest cart
//   } catch (err) {
//     console.error('Cart merge failed:', err);
//   }
// }