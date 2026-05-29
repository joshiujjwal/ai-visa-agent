// src/api/app.ts — Express application factory
// Returns a configured Express app (without starting the server).
// This separation makes integration testing easier (Supertest can import this directly).

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { logger } from '@/lib/logger.js';

// TODO (Phase 3): Import and mount route files
// import { authRouter } from './routes/auth.js';
// import { applicationsRouter } from './routes/applications.js';
// import { agentRouter } from './routes/agent.js';
// import { countriesRouter } from './routes/countries.js';

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env['VITE_API_BASE_URL'] ?? 'http://localhost:5173',
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10kb' }));

  // Request logging
  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url }, 'incoming request');
    next();
  });

  // Global rate limit (apply stricter limits on specific routes)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Health check (no auth required)
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // TODO (Phase 3): Mount routers
  // app.use('/api/auth', authRouter);
  // app.use('/api/applications', applicationsRouter);
  // app.use('/api/agent', agentRouter);
  // app.use('/api/countries', countriesRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  // Error handler
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      logger.error({ err }, 'unhandled error');
      res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      });
    }
  );

  return app;
}
