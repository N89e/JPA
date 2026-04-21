/**
 * Structured Logging Module
 * 
 * Provides JSON-formatted logging for production environments
 * Supports multiple log levels and transports
 * 
 * Usage:
 * import logger from './utils/logger.js';
 * 
 * logger.info('User signup', { userId: '123', email: 'user@example.com' });
 * logger.error('Database connection failed', error);
 * logger.warn('High memory usage', { usage: '85%' });
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ================== LOG LEVELS ==================
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL_NAMES = {
  0: 'ERROR',
  1: 'WARN',
  2: 'INFO',
  3: 'DEBUG',
};

// ================== CONFIGURATION ==================
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase() || 'INFO'];
const logFormat = process.env.LOG_FORMAT || 'json'; // json or text
const logToFile = process.env.LOG_TO_FILE === 'true';
const logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, '../../logs/app.log');

// Create logs directory if it doesn't exist
if (logToFile) {
  const logsDir = path.dirname(logFilePath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// ================== LOGGER CLASS ==================
class Logger {
  constructor() {
    this.context = 'APP';
  }

  /**
   * Format log entry
   */
  formatLog(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const hostname = process.env.HOSTNAME || 'localhost';
    const pid = process.pid;

    if (logFormat === 'json') {
      return JSON.stringify({
        timestamp,
        level: LOG_LEVEL_NAMES[level],
        message,
        context: this.context,
        hostname,
        pid,
        ...metadata,
      });
    } else {
      // Text format
      return `[${timestamp}] [${LOG_LEVEL_NAMES[level]}] ${message} ${
        Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : ''
      }`;
    }
  }

  /**
   * Write log to console and/or file
   */
  write(level, message, metadata = {}) {
    if (level > currentLogLevel) return; // Skip if below log level threshold

    const formattedLog = this.formatLog(level, message, metadata);

    // Console output with colors (for development)
    const colors = {
      0: '\x1b[31m', // Red for ERROR
      1: '\x1b[33m', // Yellow for WARN
      2: '\x1b[32m', // Green for INFO
      3: '\x1b[36m', // Cyan for DEBUG
    };
    const reset = '\x1b[0m';

    if (process.env.NODE_ENV !== 'production') {
      console.log(`${colors[level]}${formattedLog}${reset}`);
    } else {
      // File output only in production
      if (logToFile) {
        try {
          fs.appendFileSync(logFilePath, formattedLog + '\n');
        } catch (error) {
          console.error('Failed to write to log file:', error);
        }
      }
    }
  }

  /**
   * Log error level
   */
  error(message, errorOrMeta = {}) {
    const metadata = errorOrMeta instanceof Error
      ? {
          error: errorOrMeta.message,
          stack: errorOrMeta.stack,
          name: errorOrMeta.name,
        }
      : errorOrMeta;

    this.write(LOG_LEVELS.ERROR, message, metadata);
  }

  /**
   * Log warning level
   */
  warn(message, metadata = {}) {
    this.write(LOG_LEVELS.WARN, message, metadata);
  }

  /**
   * Log info level
   */
  info(message, metadata = {}) {
    this.write(LOG_LEVELS.INFO, message, metadata);
  }

  /**
   * Log debug level
   */
  debug(message, metadata = {}) {
    this.write(LOG_LEVELS.DEBUG, message, metadata);
  }

  /**
   * Log HTTP request
   */
  logRequest(req, res, responseTime = 0) {
    const metadata = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      referer: req.get('referer'),
    };

    const level = res.statusCode >= 500 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    this.write(level, `${req.method} ${req.originalUrl}`, metadata);
  }

  /**
   * Log API endpoint call
   */
  logEndpoint(endpoint, method, statusCode, metadata = {}) {
    const level = statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    this.write(level, `${method} ${endpoint}`, { statusCode, ...metadata });
  }

  /**
   * Set context (e.g., for modules)
   */
  setContext(context) {
    this.context = context;
  }
}

// ================== REQUEST LOGGING MIDDLEWARE ==================
/**
 * Express middleware for automatic request logging
 */
export function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  // Capture the original send method
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;
    
    logger.logRequest(req, res, responseTime);

    // Call the original send
    originalSend.call(this, data);
  };

  next();
}

// ================== SINGLETON LOGGER ==================
const logger = new Logger();

export default logger;

// ================== USAGE EXAMPLES ==================
/**
 * 
 * BASIC USAGE:
 * 
 * import logger from './utils/logger.js';
 * 
 * // Simple message
 * logger.info('Server started');
 * 
 * // With metadata
 * logger.info('User signup', {
 *   userId: '123',
 *   email: 'user@example.com',
 *   timestamp: new Date()
 * });
 * 
 * // Error logging
 * try {
 *   throw new Error('Database connection failed');
 * } catch (error) {
 *   logger.error('Failed to connect to database', error);
 * }
 * 
 * // Debug
 * logger.debug('Processing form data', { name: 'John', email: 'john@example.com' });
 * 
 * // HTTP request middleware
 * app.use(requestLoggerMiddleware);
 * 
 * // Specific endpoint logging
 * app.post('/api/contact/submit', (req, res) => {
 *   try {
 *     logger.info('Contact form submitted', { email: req.body.email });
 *     // Process form...
 *     logger.logEndpoint('/api/contact/submit', 'POST', 200);
 *   } catch (error) {
 *     logger.error('Contact form error', error);
 *     logger.logEndpoint('/api/contact/submit', 'POST', 500, { error: error.message });
 *   }
 * });
 * 
 * ENVIRONMENT VARIABLES:
 * 
 * LOG_LEVEL=info              # debug, info, warn, error
 * LOG_FORMAT=json             # json or text
 * LOG_TO_FILE=true            # true or false
 * LOG_FILE_PATH=/var/log/app.log
 * 
 * PRODUCTION SETUP:
 * 
 * 1. Use JSON format for parsing/analysis
 * 2. Send to centralized logging service:
 *    - ELK Stack (Elasticsearch, Logstash, Kibana)
 *    - DataDog
 *    - Splunk
 *    - CloudWatch (AWS)
 *    - Stackdriver (Google Cloud)
 * 
 * 3. Set up alerts for:
 *    - ERROR level logs
 *    - Rate limit violations
 *    - Database errors
 *    - API timeout errors
 * 
 * 4. Keep logs for at least 30 days for compliance
 */
