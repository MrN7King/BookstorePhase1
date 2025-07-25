// File: backend/routes/productRoutes.js
import express from 'express';
import { createEbook } from '../controllers/ebookAddController.js';

const router = express.Router();

router.post('/', createEbook); 

export default router;