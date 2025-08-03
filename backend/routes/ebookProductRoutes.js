// File: backend/routes/ebookProductRoutes.js
import express from 'express';
import { createEbook } from '../controllers/ebookAddController.js';
import { getAllEbooks, getEbookById, getFilteredAndSearchedEbooks } from '../controllers/ebookGetController.js'; // Import functions from your controller

const router = express.Router();

router.post('/', createEbook); 
router.get('/AllBooks', getAllEbooks);
router.get('/filtered', getFilteredAndSearchedEbooks);
router.get('/:id', getEbookById);


export default router;