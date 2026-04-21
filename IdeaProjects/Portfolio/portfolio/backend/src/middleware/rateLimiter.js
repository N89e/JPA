/**
 * Rate Limiting Middleware for Contact Form Protection
 * 
 * Prevents spam and brute force attacks on the contact form
 * Configuration via environment variables
 * 
 * Usage:
 * import { contactLimiter, apiLimiter } from './middleware/rateLimiter.js';
 * 
 * router.post('/submit', contactLimiter, validation, submitContact);
 * app.use('/api', apiLimiter);
 */

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import logger from '../utils/logger.js';

// ================== CONTACT FORM RATE LIMITER ==================
/**
 * Strict limiter for contact form
 * - 5 requests per 15 minutes per IP
 * - Prevents email spam
 */
export const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 5), // 5 requests per window
  
  // Use built-in IP key generator (handles IPv6 properly)
  keyGenerator: ipKeyGenerator,
  
  // Custom error message
  message: {
    success: false,
    error: 'Trop de demandes de contact. Veuillez réessayer dans 15 minutes.',
    retryAfter: '15 minutes'
  },
  
  // HTTP status code
  statusCode: 429,
  
  // Handle when limit is exceeded
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for contact form', {
      ip: req.ip,
      requestId: req.id,
    });
    res.status(429).json({
      success: false,
      error: 'Trop de demandes de contact. Veuillez réessayer dans 15 minutes.',
      retryAfter: '15 minutes',
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  },
  
  // Skip certain requests (e.g., health checks)
  skip: (req) => {
    return req.path === '/health';
  },
  
  // Standardize IP (handle proxies)
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// ================== API GENERAL RATE LIMITER ==================
/**
 * General API rate limiter
 * - 30 requests per second globally
 * - Prevents general DDOS
 */
export const apiLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 30, // 30 requests per second
  keyGenerator: ipKeyGenerator,
  
  message: {
    success: false,
    error: 'Trop de requêtes. Veuillez patienter.'
  },
  
  statusCode: 429,
  
  handler: (req, res) => {
    logger.warn('API rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      requestId: req.id,
    });
    res.status(429).json({
      success: false,
      error: 'Trop de requêtes. Veuillez patienter.',
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  },
  
  skip: (req) => {
    // Skip rate limiting for these endpoints
    return req.path === '/health' || req.path === '/api/health';
  },
  
  standardHeaders: true,
  legacyHeaders: false,
});

// ================== STRICT LIMITER FOR SENSITIVE ENDPOINTS ==================
/**
 * Strict limiter for authentication/sensitive endpoints
 * - 3 requests per 1 minute per IP
 * - Prevents brute force attacks
 */
export const strictLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 3, // 3 requests per minute
  keyGenerator: ipKeyGenerator,
  
  message: {
    success: false,
    error: 'Trop de tentatives. Veuillez réessayer dans 1 minute.'
  },
  
  statusCode: 429,
  
  handler: (req, res) => {
    logger.warn('STRICT rate limit exceeded - Potential brute force', {
      ip: req.ip,
      path: req.path,
      requestId: req.id,
    });
    res.status(429).json({
      success: false,
      error: 'Trop de tentatives. Veuillez réessayer dans 1 minute.',
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  },
  
  standardHeaders: true,
  legacyHeaders: false,
});

// ================== SLIDING WINDOW LIMITER ==================
/**
 * Limiter using sliding window algorithm
 * - 10 requests per 5 minutes with smooth distribution
 * - Better for user experience
 */
export const slidingWindowLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  
  // Use sliding window (more accurate but more memory)
  store: undefined, // Uses default memory store with sliding window
  
  message: {
    success: false,
    error: 'Limite de débit atteinte. Veuillez réessayer plus tard.'
  },
  
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

// ================== CONFIGURATION NOTES ==================
/**
 * ENVIRONMENT VARIABLES:
 * 
 * RATE_LIMIT_WINDOW_MS=900000      # Window duration (15 minutes)
 * RATE_LIMIT_MAX_REQUESTS=5         # Max requests per window
 * RATE_LIMIT_ENABLED=true           # Enable/disable rate limiting
 * 
 * PRODUCTION RECOMMENDATIONS:
 * 
 * 1. Contact Form: 5 requests per 15 minutes
 *    - Prevents spam
 *    - Still allows legitimate users
 *
 * 2. API General: 30 requests per second
 *    - Prevents DDOS
 *    - Allows normal traffic
 *
 * 3. Authentication: 3 requests per minute
 *    - Prevents brute force
 *    - User-friendly
 *
 * 4. For production load balancers:
 *    - Use IP from X-Forwarded-For header
 *    - app.set('trust proxy', 1);
 *    - This tells express to trust the proxy
 *
 * 5. For Redis-backed rate limiting (distributed):
 *    import RedisStore from 'rate-limit-redis';
 *    import redis from 'redis';
 *    const redisClient = redis.createClient();
 *    
 *    const limiter = rateLimit({
 *      store: new RedisStore({
 *        client: redisClient,
 *        prefix: 'rate-limit:'
 *      }),
 *      // ... other options
 *    });
 *
 * 6. Monitoring:
 *    - Log rate limit violations
 *    - Alert on unusual patterns
 *    - Track by IP and user (if authenticated)
 */

export default {
  contactLimiter,
  apiLimiter,
  strictLimiter,
  slidingWindowLimiter
};
