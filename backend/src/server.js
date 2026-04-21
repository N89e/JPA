import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Routes
import contactRoutes from './routes/contact.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';

// Middleware
import { apiLimiter } from './middleware/rateLimiter.js';
import logger, { requestLoggerMiddleware } from './utils/logger.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for load balancers
app.set('trust proxy', 1);

// ================ REQUEST ID MIDDLEWARE ================
// Add unique ID to every request for tracing
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ================ REQUEST LOGGING ================
app.use(requestLoggerMiddleware);

// ================ CORS CONFIGURATION ================
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

// ================ BODY PARSING ================
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_SIZE || '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ================ SECURITY HEADERS ================
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
  
  // HSTS (HTTP Strict-Transport-Security) si en production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ================ GENERAL API RATE LIMITER ================
app.use('/api', apiLimiter);

// ================ STATIC ASSETS (FOR EMAIL IMAGES) ================
// Serve images for email templates - makes them cloud-portable
const imagesPath = process.env.IMAGES_PATH || './frontend/src/assets/images';
app.use('/images', express.static(imagesPath, {
  maxAge: '1d',
  etag: false,
}));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        api: 'up',
      },
      requestId: req.id,
    };
    
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

// 404 Handler
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    requestId: req.id,
  });

  res.status(404).json({
    error: 'Route non trouvée',
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Une erreur interne est survenue'
    : err.message;

  res.status(statusCode).json({
    error: message,
    requestId: req.id,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('Backend server started', {
    port: PORT,
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    corsOrigins: allowedOrigins,
  });
});

// ================ GRACEFUL SHUTDOWN ================
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

// ================ UNHANDLED REJECTION ================
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
  });
});

export default app;
