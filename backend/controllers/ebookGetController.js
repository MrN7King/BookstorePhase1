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


export const getFilteredAndSearchedEbooks = async (req, res) => {
    try {
        const {
            searchQuery,
            isAvailable,
            language,
            format, // This is 'E-Book,Audiobook' from frontend
            categories,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
            sortBy = 'name',
            sortOrder = 'asc'
        } = req.query;

        const pipeline = [];
        const matchStage = { type: 'ebook' }; // Always filter by type: 'ebook'

        // 1. Atlas Search Stage (if searchQuery is provided)
        if (searchQuery) {
            pipeline.push({
                $search: {
                    index: 'SearchIndex', // <--- VERIFY THIS NAME! (e.g., 'default')
                    text: {
                        query: searchQuery,
                        path: ['name', 'author', 'description', 'tags']
                    }
                }
            });
        }

        // 2. Filtering by isAvailable (if provided)
        if (isAvailable !== undefined) {
            matchStage.isAvailable = isAvailable === 'true';
        }

        // 3. Filtering by Language (from UI, now correctly handles multiple selections)
        if (language) {
            const languagesArray = language.split(',').map(lang => lang.trim());
            // If 'language' in your DB is a single string:
            // This checks if the document's 'language' field is among the selected languages.
            matchStage.language = { $in: languagesArray };
            // If 'language' in your DB is an array of strings:
            // matchStage.language = { $in: languagesArray }; // Still correct for array field if any match
        }

        // 4. Filtering by Format (from UI, mapping to 'deliveryFormat' in DB)
        if (format) {
            const formatsArray = format.split(',').map(f => f.trim());
            // If 'deliveryFormat' in your DB is a single string:
            matchStage.deliveryFormat = { $in: formatsArray }; // <--- CHANGED FROM .edition to .deliveryFormat
            // If 'deliveryFormat' in your DB is an array of strings:
            // matchStage.deliveryFormat = { $in: formatsArray }; // Still correct
        }

        // 5. Filtering by Categories (from UI, mapping to 'tags' array field)
        if (categories) {
            const categoriesArray = categories.split(',').map(cat => cat.trim());
            matchStage.tags = { $in: categoriesArray };
        }

        // 6. Filtering by Price Range
        const priceRange = {};
        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);
        if (!isNaN(parsedMinPrice)) {
            priceRange.$gte = parsedMinPrice;
        }
        if (!isNaN(parsedMaxPrice)) {
            priceRange.$lte = parsedMaxPrice;
        }
        if (Object.keys(priceRange).length > 0) {
            matchStage.price = priceRange;
        }

        // Add the $match stage if there are any conditions
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // --- Pagination and Sorting ---
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        const sortStage = {};
        if (sortBy === 'price') {
            sortStage.price = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'name') {
            sortStage.name = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'author') {
            sortStage.author = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortStage._id = 1;
        }

        // --- Use $facet for efficient total count + paginated results ---
        pipeline.push({
            $facet: {
                metadata: [{ $count: "totalResults" }],
                data: [
                    { $sort: sortStage },
                    { $skip: skip },
                    { $limit: limitNum },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            author: 1,
                            description: 1,
                            price: 1,
                            thumbnailUrl: 1,
                            isAvailable: 1,
                            quantityAvailable: 1,
                            rating: 1,
                            tags: 1,
                            language: 1, // Ensure this field exists in your DB documents!
                            deliveryFormat: 1, // <--- CHANGED FROM .edition to .deliveryFormat
                            publisher: 1,
                            ISBN: 1,
                            publicationDate: 1,
                            metadata: 1,
                            type: 1
                        }
                    }
                ]
            }
        });

        // Execute the aggregation pipeline
        const [results] = await ProductModel.aggregate(pipeline);

        const ebooks = results.data || [];
        const totalResults = results.metadata[0]?.totalResults || 0;

        res.status(200).json({
            success: true,
            count: ebooks.length,
            totalResults,
            page: parseInt(page),
            limit: parseInt(limit),
            ebooks,
        });

    } catch (error) {
        console.error('Error in getFilteredAndSearchedEbooks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch ebooks with applied filters/search.', error: error.message });
    }
};

export const getNewestEbooks = async (req, res) => {
  try {
    const newestEbooks = await ProductModel.find({ type: 'ebook' })
      .sort({ publicationDate: -1, createdAt: -1 }) // Sort by publicationDate (newest first), then createdAt
      .limit(8); // Limit to 8 books

    res.status(200).json({ success: true, ebooks: newestEbooks });
  } catch (error) {
    console.error('Error fetching newest ebooks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch newest ebooks' });
  }
};

/**
 * @desc    Get 8 random ebooks
 * @route   GET /api/slider-ebooks/random
 * @access  Public
 */
export const getRandomEbooks = async (req, res) => {
  try {
    // Aggregation pipeline to get random documents
    const randomEbooks = await ProductModel.aggregate([
      { $match: { type: 'ebook' } }, // Match only ebook type documents
      { $sample: { size: 8 } }      // Get 8 random samples
    ]);

    res.status(200).json({ success: true, ebooks: randomEbooks });
  } catch (error) {
    console.error('Error fetching random ebooks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch random ebooks' });
  }
};
