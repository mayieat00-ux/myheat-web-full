/**
 * Scan orchestrator.
 *
 *   barcode → Food (cache lookup or OFF fetch) → rating → Scan
 */

import type { Food, Scan } from '@prisma/client';

import type { NutriGrade } from '@mayieat/shared';

import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/error.js';
import { fetchByBarcode } from './openFoodFacts.js';
import { compute as computeRating, type ProfileForRating, type RatingOutput } from './rating.js';

export interface ScanResult {
  scan: Scan;
  food: Food;
  rating: RatingOutput;
}

async function getProfileForRating(userId: string): Promise<ProfileForRating> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new HttpError(409, 'profile_incomplete', 'Complete your profile to scan foods', {
      profileIncomplete: true,
    });
  }
  return {
    goal: profile.goal,
    allergies: profile.allergies,
    dietaryPrefs: profile.dietaryPrefs,
    medicalFlags: profile.medicalFlags,
  };
}

/**
 * Get or create a Food row for a barcode. Cache misses fetch from OFF.
 */
async function getOrCreateFoodByBarcode(barcode: string): Promise<Food> {
  const cached = await prisma.food.findUnique({ where: { barcode } });
  if (cached) return cached;

  const off = await fetchByBarcode(barcode);

  return prisma.food.create({
    data: {
      source: 'BARCODE',
      barcode: off.barcode,
      name: off.name,
      brand: off.brand,
      imageUrl: off.imageUrl,
      nutrients: off.nutrients as unknown as object,
      ingredients: off.ingredients,
      additives: off.additives,
      nutriScoreGrade: off.nutriScoreGrade ?? undefined,
      nutriScoreValue: off.nutriScoreValue ?? undefined,
      rawPayload: off.raw as object,
    },
  });
}

export async function scanByBarcode(userId: string, barcode: string): Promise<ScanResult> {
  const cleanBarcode = barcode.trim();
  if (!/^\d{6,14}$/.test(cleanBarcode)) {
    throw new HttpError(400, 'invalid_barcode', 'Barcode must be 6–14 digits');
  }

  const profile = await getProfileForRating(userId);
  const food = await getOrCreateFoodByBarcode(cleanBarcode);

  const nutrients = food.nutrients as ScanResult['food']['nutrients'] & Record<string, unknown>;
  const rating = computeRating({
    nutrients: nutrients as never,
    ingredients: food.ingredients,
    additives: food.additives,
    offNutriScoreGrade: food.nutriScoreGrade as NutriGrade | null,
    offNutriScoreValue: food.nutriScoreValue,
    profile,
  });

  const scan = await prisma.scan.create({
    data: {
      userId,
      foodId: food.id,
      method: 'BARCODE',
      personalizedRating: rating as unknown as object,
    },
  });

  return { scan, food, rating };
}

export async function getScanById(userId: string, scanId: string): Promise<ScanResult> {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: { food: true },
  });
  if (!scan || scan.userId !== userId) {
    throw new HttpError(404, 'scan_not_found', 'Scan not found');
  }
  return {
    scan,
    food: scan.food,
    rating: scan.personalizedRating as unknown as RatingOutput,
  };
}

export async function listRecentScans(userId: string, limit = 25) {
  return prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { food: true },
  });
}
