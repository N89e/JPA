/**
 * CORRECTED contact.js Route
 * 
 * Improvements:
 * ✅ Rate limiting integrated
 * ✅ Better error handling
 * ✅ Structured logging
 * ✅ Request tracing
 * 
 * Usage: Update backend/src/routes/contact.js with these improvements
 */

import express from 'express';
import { submitContact } from '../controllers/contactController.js';
import { validateContactForm } from '../middleware/validation.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/contact/submit
 * 
 * Request body:
 * {
 *   name: string (max 100 chars)
 *   email: string (valid email)
 *   subject: string (max 200 chars)
 *   message: string (max 5000 chars)
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   message: string
 *   data: { name, email, subject, emailsSent: { userEmail, ownerEmail } }
 * }
 */
router.post('/submit',
  // 1. Rate limiting (5 requests per 15 minutes per IP)
  contactLimiter,
  
  // 2. Validation (check fields, sanitize, DOMPurify)
  validateContactForm,
  
  // 3. Handler (send emails)
  submitContact,
  
  // 4. Error handler
  (err, req, res, next) => {
    logger.error('Contact form submission error', {
      error: err.message,
      requestId: req.id,
      userEmail: req.body?.email,
    });

    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors de l\'envoi de votre demande',
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * GET /api/contact/status
 * Check if contact form is accepting submissions
 */
router.get('/status', (req, res) => {
  res.json({
    available: true,
    rateLimit: {
      requests: 5,
      window: '15 minutes',
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;

/**
 * INTEGRATION STEPS:
 * 
 * 1. Update import in backend/src/server.js:
 *    import { contactLimiter } from './middleware/rateLimiter.js';
 * 
 * 2. Use in server.js:
 *    app.use('/api/contact', contactLimiter, contactRoutes);
 * 
 * 3. OR add rate limiting in route (as shown above):
 *    router.post('/submit', contactLimiter, validation, submitContact);
 * 
 * 4. Test rate limiting:
 *    for i in {1..6}; do curl -X POST http://localhost:5000/api/contact/submit; done
 *    6th request should return 429
 * 
 * 5. Monitor rate limiting:
 *    Check logs for "Rate limit exceeded" messages
 */
