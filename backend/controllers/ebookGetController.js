// backend/controllers/ebooksGetController.js
import ProductModel from '../models/Product.js'; // Import the base Product model


export const getAllEbooks = async (req, res) => {
  try {
    const ebooks = await ProductModel.find({ type: 'ebook' }); // Filter by the discriminator key 'ebook'
    res.status(200).json({ success: true, ebooks });
  } catch (error) {
    console.error('Error fetching all ebooks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ebooks' });
  }
};


export const getEbookById = async (req, res) => {
  try {
    const ebook = await ProductModel.findOne({
      _id: req.params.id,
      type: 'ebook' // Ensure it's an ebook
    });

    if (!ebook) {
      return res.status(404).json({ success: false, message: 'Ebook not found' });
    }

    res.status(200).json({ success: true, ebook });
  } catch (error) {
    console.error('Error fetching ebook by ID:', error);
    // Handle CastError for invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ebook ID format' });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch ebook' });
  }
};
