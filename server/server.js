import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { generalLimiter, aiLimiter } from './middleware/rateLimiter.js';
import { sanitizeEventInput } from './middleware/sanitizer.js';
import { logger } from './utils/logger.js';
import {
  handleGeneratePlan,
  handleRegenerateSection,
  handleChatPlanner,
  handleGetStatus
} from './controllers/planController.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow Vite dev server and production clients
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      // Allow any localhost during development
      if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parsing with size limit
app.use(express.json({ limit: '2mb' }));

// Apply general rate limiter to API routes
app.use('/api', generalLimiter);

// Health & status endpoints
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get(['/api/status', '/status'], handleGetStatus);

// AI Planning routes with sanitization and dedicated AI rate limiter
app.post(
  ['/api/plan/generate', '/plan/generate'],
  aiLimiter,
  sanitizeEventInput,
  handleGeneratePlan
);
app.post(
  ['/api/plan/regenerate-section', '/plan/regenerate-section'],
  aiLimiter,
  sanitizeEventInput,
  handleRegenerateSection
);
app.post(['/api/plan/chat', '/plan/chat'], aiLimiter, sanitizeEventInput, handleChatPlanner);

// 404 handler for API routes
app.use(['/api/*', '/*'], (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handling
app.use((err, req, res, _next) => {
  logger.error('Unhandled server error:', err.message || err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error occurred while processing your event plan.';
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
});

// Determine if executed directly as main script or imported as a module
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename;

// Start listening only in standalone server mode (not when imported in tests or Vercel serverless functions)
if (!process.env.VERCEL && isDirectExecution) {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(
      `Gemini Status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Demo Mode (Intelligent Planner)'}`
    );
  });
}

export default app;
