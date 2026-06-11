import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mayieat-backend',
    timestamp: new Date().toISOString(),
  });
});
