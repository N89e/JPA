import express from 'express';
import { submitContact } from '../controllers/contactController.js';
import { validateContactMiddleware } from '../middleware/validation.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST - Soumettre un message de contact
// Rate limited to 5 requests per 15 minutes per IP
router.post('/submit', contactLimiter, validateContactMiddleware, submitContact);

// GET - Check contact form status
router.get('/status', (req, res) => {
  res.json({
    available: true,
    rateLimit: {
      requests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 5),
      windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000) / 60000,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
