import express from 'express';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// GET all analytics
router.get('/', async (req, res) => {
  try {
    const analytics = await Analytics.find().sort({ createdAt: -1 });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Analytics.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new analytics event
router.post('/', async (req, res) => {
  try {
    const event = new Analytics(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Analytics.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
