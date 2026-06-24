import { ACTIVITY_MULTIPLIERS, GOAL_CALORIE_ADJUSTMENT } from '@/shared';
import type { ActivityLevel, Goal, Sex, UserProfile } from '@prisma/client';

import { prisma } from './prisma';

export interface ProfileInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  allergies: string[];
  dietaryPrefs: string[];
  medicalFlags: string[];
}

/**
 * Mifflin-St Jeor BMR + activity multiplier + goal adjustment.
 * Returns target kcal/day (rounded to nearest 10).
 */
function calculateDailyCalorieTarget(input: ProfileInput): number {
  const { sex, weightKg, heightCm, age, activityLevel, goal } = input;

  // BMR (Mifflin-St Jeor)
  let bmr: number;
  if (sex === 'MALE') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (sex === 'FEMALE') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Use average for OTHER
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const target = tdee + GOAL_CALORIE_ADJUSTMENT[goal];
  return Math.round(target / 10) * 10;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  return prisma.userProfile.findUnique({ where: { userId } });
}

export async function upsertProfile(userId: string, input: ProfileInput): Promise<UserProfile> {
  const dailyCalorieTarget = calculateDailyCalorieTarget(input);
  return prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...input, dailyCalorieTarget },
    update: { ...input, dailyCalorieTarget },
  });
}
