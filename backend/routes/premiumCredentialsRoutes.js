import express from 'express';
import PremiumCredential from '../models/PremiumCredential.js';

const router = express.Router();

/**
 * @route   GET /api/premium-credentials
 * @desc    Get all premium credentials
 */
router.get('/', async (req, res) => {
  try {
    const credentials = await PremiumCredential.find();
    res.json(credentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/premium-credentials
 * @desc    Create a new premium credential
 */
router.post('/', async (req, res) => {
  try {
    const credential = new PremiumCredential(req.body);
    await credential.save();
    res.status(201).json(credential);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/premium-credentials/:id
 * @desc    Update a premium credential
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await PremiumCredential.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/premium-credentials/:id
 * @desc    Delete a premium credential
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PremiumCredential.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;