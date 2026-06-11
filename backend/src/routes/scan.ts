import { Router } from 'express';
import { z } from 'zod';

import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { getScanById, listRecentScans, scanByBarcode } from '../services/scans.js';

export const scanRouter = Router();

const barcodeBodySchema = z.object({
  barcode: z.string().min(6).max(14),
});

scanRouter.post(
  '/barcode',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const { barcode } = barcodeBodySchema.parse(req.body);
    const result = await scanByBarcode(userId, barcode);
    res.json(result);
  }),
);

scanRouter.get(
  '/history',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 25)));
    const items = await listRecentScans(userId, limit);
    res.json({ items });
  }),
);

scanRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const result = await getScanById(userId, String(req.params.id));
    res.json(result);
  }),
);
