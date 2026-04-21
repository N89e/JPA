/**
 * CORRECTED server.js for Production
 * 
 * Improvements:
 * ✅ Rate limiting on contact endpoint
 * ✅ Structured logging
 * ✅ Improved error handling with requestID
 * ✅ Enhanced health check
 * ✅ Better CORS configuration
 * ✅ Request logging middleware
 * ✅ Trust proxy for load balancers
 * 
 * Usage: Copy this file to backend/src/server-prod.js
 * Then gradually integrate improvements into server.js
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';  // npm install uuid

// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import contactRoutes from './routes/contact.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';

// Middleware
import { contactLimiter, apiLimiter } from './middleware/rateLimiter.js';
import logger, { requestLoggerMiddleware } from './utils/logger.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================== SECURITY & TRUST PROXY ==================
// Important for load balancers (Nginx, ALB, etc.)
app.set('trust proxy', 1);

// ================== REQUEST ID MIDDLEWARE ==================
// Add unique ID to every request for tracing
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ================== REQUEST LOGGING ==================
app.use(requestLoggerMiddleware);

// ================== CORS CONFIGURATION ==================
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS rejection', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ================== BODY PARSING ==================
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_SIZE || '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ================== SECURITY HEADERS ==================
app.use((req, res, next) => {
  // Prévenir le sniffing de types MIME
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protéger contre le clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Protéger contre XSS (maintenant moins utile avec CSP, mais garde compatibilité)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Politique de référents stricte
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy pour prévenir XSS
  // Ne permet que les ressources depuis le même origin
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  
  // HSTS (HTTP Strict-Transport-Security) en production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ================== STATIC FILES (FRONTEND) ==================
// Serve frontend files from public/ directory
app.use(express.static(path.join(__dirname, '../public')));

// ================== GENERAL API RATE LIMITER ==================
app.use('/api', apiLimiter);

// ================== API ROUTES ==================
app.use('/api/contact', contactLimiter, contactRoutes);  // Rate limited for form
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);

// ================== HEALTH CHECK (ENHANCED) ==================
app.get('/api/health', async (req, res) => {
  try {
    // Check basic service
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        api: 'up',
        // TODO: Add database check
        // TODO: Add email service check
      },
      requestId: req.id,
    };

    // If you add database later:
    // try {
    //   await db.ping();
    //   health.services.database = 'up';
    // } catch (error) {
    //   health.services.database = 'down';
    //   return res.status(503).json({ ...health, status: 'degraded' });
    // }

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service unavailable',
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

// ================== SPA FALLBACK & 404 HANDLER ==================
// For SPA: Serve index.html for non-API routes
// For API: Return 404 JSON
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    logger.warn('API route not found', {
      method: req.method,
      path: req.path,
      requestId: req.id,
    });
    res.status(404).json({
      error: 'API route non trouvée',
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } else {
    // SPA fallback: serve index.html
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// ================== GLOBAL ERROR HANDLER ==================
app.use((err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Une erreur interne est survenue'
    : err.message;

  // Send error response
  res.status(statusCode).json({
    error: message,
    requestId: req.id,
    timestamp: new Date().toISOString(),
    // Include stack trace only in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ================== SERVER STARTUP ==================
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('Backend server started', {
    port: PORT,
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    corsOrigins: allowedOrigins,
  });

  // Graceful shutdown info
  logger.info('Server ready to accept connections');
});

// ================== GRACEFUL SHUTDOWN ==================
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// ================== UNHANDLED REJECTION ==================
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
  });
  // In production, you might want to exit or send alert
});

export default app;

/**
 * MIGRATION STEPS FROM OLD server.js:
 * 
 * 1. npm install uuid  (for requestID)
 * 2. npm install express-rate-limit  (for rate limiting)
 * 3. Create backend/src/utils/logger.js (see CLOUD_READINESS_SOLUTIONS/)
 * 4. Create backend/src/middleware/rateLimiter.js
 * 5. Update backend/src/routes/contact.js to use contactLimiter
 * 6. Test locally with: npm run dev
 * 7. Update docker-compose.yml to use new configuration
 * 8. Deploy to production with: docker-compose -f docker-compose.prod.yml up
 * 
 * KEY IMPROVEMENTS:
 * ✅ Request tracing with UUID
 * ✅ Structured logging
 * ✅ Enhanced error handling
 * ✅ Rate limiting
 * ✅ Security headers
 * ✅ Graceful shutdown
 * ✅ Trust proxy for load balancers
 * ✅ Configurable CORS
 * ✅ Better health check
 */
