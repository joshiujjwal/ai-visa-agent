// src/api/server.ts — HTTP server entry point
// Imports the app factory and starts listening.
// Do not import this in tests — import app.ts directly.

import 'dotenv/config';
import { createApp } from './app.js';
import { logger } from '@/lib/logger.js';

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

const app = createApp();

app.listen(PORT, () => {
  logger.info({ port: PORT }, `AIVisaAgent API listening`);
});
