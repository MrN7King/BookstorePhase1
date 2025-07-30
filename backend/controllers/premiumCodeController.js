import PremiumCode from '../models/PremiumCode.js';
import { encryptCode, decryptCode } from '../utils/crypto.js';
import Product from '../models/Product.js';

export const addBulkCodes = async (req, res) => {
    try {
        const { productId, codes } = req.body;

        if (!productId || !Array.isArray(codes) || codes.length === 0) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        // Optional: Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const encryptedCodes = codes.map((code) => ({
            productId,
            encryptedCode: encryptCode(code),
        }));

        await PremiumCode.insertMany(encryptedCodes);

        return res.status(201).json({ message: 'Codes added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// For admin display purposes (optional, useful later)
export const getCodesForProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const codes = await PremiumCode.find({ productId });

        const decrypted = codes.map(code => ({
            _id: code._id,
            code: decryptCode(code.encryptedCode),
            isAssigned: code.isAssigned
        }));

        return res.json(decrypted);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch codes' });
    }
};

export const deletePremiumCode = async (req, res) => {
    try {
        const { id } = req.params;
        const code = await PremiumCode.findById(id);
        if (!code || !code.isAssigned) return res.status(400).json({ message: 'Invalid code or not assigned' });

        await code.deleteOne();
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
