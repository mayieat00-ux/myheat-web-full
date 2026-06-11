import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { authRouter } from './routes/auth.js';
import { healthRouter } from './routes/health.js';
import { profileRouter } from './routes/profile.js';
import { scanRouter } from './routes/scan.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// API routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/scan', scanRouter);

// Root
app.get('/', (_req, res) => {
  res.json({ service: 'mayieat-backend', version: '0.1.0' });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[mayieat-backend] listening on http://localhost:${env.PORT}`);
});
