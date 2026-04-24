import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import contactRoutes from './routes/contact.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';

// Middleware
import { contactLimiter, apiLimiter } from './middleware/rateLimiter.js';
import logger, { requestLoggerMiddleware } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ================== TRUST PROXY ==================
// Obligatoire sur Render (load balancer devant le serveur)
app.set('trust proxy', 1);

// ================== REQUEST ID ==================
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ================== REQUEST LOGGING ==================
app.use(requestLoggerMiddleware);

// ================== ORIGINES AUTORISÉES ==================
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  process.env.FRONTEND_URL ||
  'http://localhost:3000'
)
  .split(',')
  .map(url => url.trim());

// ================== PROTECTION ANTI-ABUS DIRECTE ==================
// Bloque les appels directs (curl, Postman, scripts) sur les routes sensibles
// Les navigateurs envoient toujours un Origin — les outils directs non
const blockDirectAccess = (req, res, next) => {
  const origin = req.headers.origin;
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // En production : bloquer si pas d'origin ET user-agent suspect
  if (IS_PROD) {
    // Bloquer les outils d'automatisation connus
    const blockedAgents = ['curl/', 'python-requests', 'wget/', 'go-http', 'java/', 'ruby'];
    const isSuspectAgent = blockedAgents.some(agent => userAgent.includes(agent));

    // Pas d'origin + agent suspect = appel direct malveillant
    if (!origin && isSuspectAgent) {
      logger.warn('Direct API access blocked', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        requestId: req.id,
      });
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Origin présent mais non autorisé = bloqué
    if (origin && !allowedOrigins.includes(origin)) {
      logger.warn('Unauthorized origin blocked', {
        ip: req.ip,
        origin,
        requestId: req.id,
      });
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
  }

  next();
};

// ================== CORS ==================
app.use(cors({
  origin: (origin, callback) => {
    // Autorise si pas d'origin (appels serveur-à-serveur légitimes, health checks)
    // ou si l'origin est dans la liste blanche
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS rejection', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ================== BODY PARSING ==================
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_SIZE || '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ================== SECURITY HEADERS ==================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; " +
    "connect-src 'self'; " +  // Plus d'URL Render exposée ici
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );

  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Masquer la technologie utilisée
  res.removeHeader('X-Powered-By');

  next();
});

// ================== RATE LIMITING GLOBAL ==================
app.use('/api', apiLimiter);

// ================== STATIC ASSETS ==================
const imagesPath = process.env.IMAGES_PATH || './frontend/src/assets/images';
app.use('/images', express.static(imagesPath, { maxAge: '1d', etag: false }));

// ================== API ROUTES ==================

// Contact : rate limit + protection anti-abus directe
app.use('/api/contact', blockDirectAccess, contactLimiter, contactRoutes);

// Projets & Services : lecture publique, pas de protection stricte nécessaire
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);

// ================== HEALTH CHECK ==================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV,
  });
  // Pas de requestId ni d'infos sensibles exposées en prod
});

// ================== 404 HANDLER ==================
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    requestId: req.id,
  });
  res.status(404).json({
    error: 'Route non trouvée',
    requestId: req.id,
  });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
  });

  const statusCode = err.statusCode || 500;
  const message = IS_PROD ? 'Une erreur interne est survenue' : err.message;

  res.status(statusCode).json({
    error: message,
    requestId: req.id,
    ...(!IS_PROD && { stack: err.stack }),
  });
});

// ================== DÉMARRAGE ==================
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('Backend server started', {
    port: PORT,
    environment: process.env.NODE_ENV,
    allowedOrigins,
  });
});

// ================== GRACEFUL SHUTDOWN ==================
const shutdown = (signal) => {
  logger.info(`${signal} received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
});

export default app;