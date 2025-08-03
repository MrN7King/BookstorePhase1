import express from 'express';
import multer from 'multer';
import { premiumThumbnailUpload } from '../config/multerConfig.js';
import {
  createPremiumProduct,
  listPremiumProducts, // Ensure this is imported
} from '../controllers/PremiumAccountController.js'; // Ensure correct path to your controller
import {
  deletePremiumProduct,
  getPremiumProduct,
  updatePremiumAccount,
} from '../controllers/PremiumAccountEditController.js';

const router = express.Router();

// Create new premium product
router.post('/',
  premiumThumbnailUpload,
  (err, req, res, next) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  createPremiumProduct
);

// List all premium products (for your table) - THIS IS THE ROUTE FOR FILTERS
router.get('/', listPremiumProducts); // Ensure this route exists and points to listPremiumProducts

// Get Premium Product by ID
router.get('/:id', getPremiumProduct);


//Update Premium Product by ID
router.put('/:id',
  premiumThumbnailUpload,
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  updatePremiumAccount
);

//Delete Premium Product by ID
router.delete('/:id', deletePremiumProduct);


export default router;