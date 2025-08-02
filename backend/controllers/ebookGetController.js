// backend/controllers/ebooksGetController.js
import ProductModel from '../models/Product.js'; // Import the base Product model


export const getAllEbooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;       // Current page
    const limit = parseInt(req.query.limit) || 20;     // Items per page
    const skip = (page - 1) * limit;

    const query = { type: 'ebook' };

    const [totalItems, ebooks] = await Promise.all([
      ProductModel.countDocuments(query),
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      products: ebooks,
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error('Error fetching paginated ebooks:', error);
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
