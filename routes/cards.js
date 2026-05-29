import express from 'express';
import PCBuild from '../models/PCBuild.js';
import { generateCardImage } from '../utils/cardGenerator.js';

const router = express.Router();

// Generate card image
router.post('/generate', async (req, res) => {
  try {
    const { buildId, theme = 'dark', format = 'desktop' } = req.body;
    
    const build = await PCBuild.findOne({ buildId })
      .populate('components.cpu components.gpu components.psu components.ram components.storage components.cooler');
    
    if (!build) {
      return res.status(404).json({ success: false, error: 'Build not found' });
    }
    
    const image = await generateCardImage(build, theme, format);
    
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="build_${buildId}.png"`);
    res.send(image);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download card
router.get('/:buildId/download', async (req, res) => {
  try {
    const { theme = 'dark', format = 'desktop' } = req.query;
    
    const build = await PCBuild.findOne({ buildId: req.params.buildId })
      .populate('components.cpu components.gpu components.psu components.ram components.storage components.cooler');
    
    if (!build) {
      return res.status(404).json({ success: false, error: 'Build not found' });
    }
    
    const image = await generateCardImage(build, theme, format);
    
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="manotake_build_${req.params.buildId}.png"`);
    res.send(image);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
