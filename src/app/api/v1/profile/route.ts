import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ActivityLevel, DietaryPref, Goal, MedicalFlag, Sex } from '@/shared';

import { getAuthenticatedUser } from '@/lib/server/session';
import { HttpError, handleError } from '@/lib/server/error';
import { getProfile, upsertProfile } from '@/lib/server/profile';

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

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const profile = await getProfile(user.id);
    if (!profile) {
      throw new HttpError(404, 'profile_not_found', 'Profile has not been created yet');
    }
    return NextResponse.json({ profile });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const input = profileSchema.parse(await request.json());
    const profile = await upsertProfile(user.id, {
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
    return NextResponse.json({ profile });
  } catch (err) {
    return handleError(err);
  }
}
