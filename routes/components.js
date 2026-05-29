import express from 'express';
import Component from '../models/Component.js';

const router = express.Router();

// Get all components
router.get('/', async (req, res) => {
  try {
    const type = req.query.type;
    const query = type ? { type } : {};
    const components = await Component.find(query).limit(100);
    res.json({ success: true, count: components.length, data: components });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get component by type
router.get('/type/:type', async (req, res) => {
  try {
    const components = await Component.find({ type: req.params.type });
    res.json({ success: true, count: components.length, data: components });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
