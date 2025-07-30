//backend/routes/PremiumProductRoutes.js
import express from 'express';
import {
  createPremiumProduct,
  listPremiumProducts,
} from '../controllers/PremiumAccountController.js';
import {
  getPremiumProduct,
  updatePremiumProduct,
  deletePremiumProduct,
} from '../controllers/PremiumAccountEditController.js';

const router = express.Router();

// Create new premium product
router.post('/', createPremiumProduct);

// List all premium products (for your table)
router.get('/', listPremiumProducts);

// Get Premium Product by ID
router.get('/:id', getPremiumProduct);

//Update Premium Product by ID
router.put('/:id', updatePremiumProduct);

//Delete Premium Product by ID
router.delete('/:id', deletePremiumProduct);

export default router;