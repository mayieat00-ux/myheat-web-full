import { Router } from 'express';
import { z } from 'zod';

import { ActivityLevel, DietaryPref, Goal, MedicalFlag, Sex } from '@mayieat/shared';

import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { getProfile, upsertProfile } from '../services/profile.js';

export const profileRouter = Router();

const profileSchema = z.object({
  age: z.number().int().min(13).max(120),
  sex: z.enum(Object.values(Sex) as [string, ...string[]]),
  heightCm: z.number().min(80).max(260),
  weightKg: z.number().min(25).max(400),
  activityLevel: z.enum(Object.values(ActivityLevel) as [string, ...string[]]),
  goal: z.enum(Object.values(Goal) as [string, ...string[]]),
  allergies: z.array(z.string().min(1).max(50)).max(50),
  dietaryPrefs: z.array(z.enum(Object.values(DietaryPref) as [string, ...string[]])).max(20),
  medicalFlags: z.array(z.enum(Object.values(MedicalFlag) as [string, ...string[]])).max(20),
});

profileRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const profile = await getProfile(userId);
    if (!profile) {
      throw new HttpError(404, 'profile_not_found', 'Profile has not been created yet');
    }
    res.json({ profile });
  }),
);

profileRouter.put(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const input = profileSchema.parse(req.body);
    const profile = await upsertProfile(userId, {
      age: input.age,
      sex: input.sex as Parameters<typeof upsertProfile>[1]['sex'],
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      activityLevel: input.activityLevel as Parameters<typeof upsertProfile>[1]['activityLevel'],
      goal: input.goal as Parameters<typeof upsertProfile>[1]['goal'],
      allergies: input.allergies,
      dietaryPrefs: input.dietaryPrefs,
      medicalFlags: input.medicalFlags,
    });
    res.json({ profile });
  }),
);
