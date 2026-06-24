/**
 * Health rating service.
 * Pure functions — no I/O, easy to unit-test.
 *
 * Strategy (per plan §5):
 *   1. Compute / accept a base Nutri-Score (A–E + numeric).
 *   2. Apply user-profile adjustments (max ±25 points).
 *   3. Emit warnings and positives drawn from medical flags, allergies, dietary prefs.
 */

import {
  NUTRIENT_THRESHOLDS,
  type NutrientsPer100g,
  type NutriGrade,
} from '@/shared';

export interface ProfileForRating {
  goal: 'LOSE' | 'MAINTAIN' | 'GAIN';
  allergies: string[];
  dietaryPrefs: string[];
  medicalFlags: string[];
}

export interface RatingInput {
  nutrients: NutrientsPer100g;
  ingredients: string | null;
  additives: string[];
  /** Pre-computed Nutri-Score from OpenFoodFacts, if available. */
  offNutriScoreGrade?: NutriGrade | null;
  offNutriScoreValue?: number | null;
  profile: ProfileForRating;
}

export interface RatingOutput {
  score: number; // 0..100
  grade: NutriGrade;
  warnings: string[];
  positives: string[];
}

const GRADE_TO_BASE_SCORE: Record<NutriGrade, number> = {
  A: 88,
  B: 72,
  C: 56,
  D: 38,
  E: 20,
};

const SCORE_TO_GRADE = (s: number): NutriGrade => {
  if (s >= 80) return 'A';
  if (s >= 65) return 'B';
  if (s >= 45) return 'C';
  if (s >= 25) return 'D';
  return 'E';
};

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

/**
 * Approximate Nutri-Score points from raw nutrients per 100 g.
 * Returns a 0–100 score and letter grade.
 * Used when OFF doesn't provide a Nutri-Score (e.g. AI_VISION foods).
 */
function approximateBaseScore(n: NutrientsPer100g): { score: number; grade: NutriGrade } {
  // Negative points (worse if high)
  let neg = 0;
  if (n.sugar !== null) neg += clamp(n.sugar / 4.5, 0, 10);
  if (n.satFat !== null) neg += clamp(n.satFat, 0, 10);
  if (n.sodium !== null) neg += clamp((n.sodium * 1000) / 90, 0, 10); // sodium in g → mg, threshold 90mg/pt
  if (n.kcal !== null) neg += clamp(n.kcal / 80, 0, 10);

  // Positive points (better if high)
  let pos = 0;
  if (n.fiber !== null) pos += clamp(n.fiber / 0.9, 0, 5);
  if (n.protein !== null) pos += clamp(n.protein / 1.6, 0, 5);

  // Map (neg - pos) range roughly [-10..40] to score [100..0]
  const raw = neg - pos;
  const score = Math.round(clamp(100 - ((raw + 10) / 50) * 100, 0, 100));
  return { score, grade: SCORE_TO_GRADE(score) };
}

function tokensFromText(text: string | null): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[,;()\-/\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

/**
 * Apply profile-based adjustments to the base score.
 * Returns the new score plus warnings/positives.
 */
export function compute(input: RatingInput): RatingOutput {
  const { nutrients, ingredients, additives, offNutriScoreGrade, profile } = input;

  // Start from OFF Nutri-Score if available; otherwise approximate.
  let score: number;
  if (offNutriScoreGrade) {
    score = GRADE_TO_BASE_SCORE[offNutriScoreGrade];
  } else {
    score = approximateBaseScore(nutrients).score;
  }

  const warnings: string[] = [];
  const positives: string[] = [];
  let adjustment = 0;

  // --- Hard rules: allergies ---
  const ingredientTokens = new Set([
    ...tokensFromText(ingredients),
    ...additives.map((a) => a.toLowerCase()),
  ]);
  const matchedAllergens = profile.allergies.filter((al) =>
    ingredientTokens.has(al.toLowerCase()),
  );
  if (matchedAllergens.length > 0) {
    warnings.push(
      `Contains allergen${matchedAllergens.length > 1 ? 's' : ''}: ${matchedAllergens.join(', ')}`,
    );
    // Hard cap to zero — allergens are a non-negotiable risk.
    return { score: 0, grade: 'E', warnings, positives };
  }

  // --- Medical flag adjustments ---
  if (
    profile.medicalFlags.includes('HYPERTENSION') &&
    nutrients.sodium !== null &&
    nutrients.sodium * 1000 > NUTRIENT_THRESHOLDS.HIGH_SODIUM_MG
  ) {
    adjustment -= 15;
    warnings.push(`High sodium — limit with high blood pressure`);
  }
  if (
    profile.medicalFlags.includes('DIABETES') &&
    nutrients.sugar !== null &&
    nutrients.sugar > NUTRIENT_THRESHOLDS.HIGH_SUGAR_G
  ) {
    adjustment -= 15;
    warnings.push(`High sugar — limit with diabetes`);
  }
  if (
    profile.medicalFlags.includes('HIGH_CHOLESTEROL') &&
    nutrients.satFat !== null &&
    nutrients.satFat > NUTRIENT_THRESHOLDS.HIGH_SAT_FAT_G
  ) {
    adjustment -= 10;
    warnings.push(`High saturated fat — limit with elevated cholesterol`);
  }

  // --- Dietary preference adjustments (heuristic — best-effort token match) ---
  if (profile.dietaryPrefs.includes('VEGAN')) {
    const dairyTokens = ['milk', 'butter', 'cream', 'cheese', 'whey', 'lactose', 'casein'];
    const meatTokens = ['beef', 'chicken', 'pork', 'gelatin', 'fish', 'meat'];
    const violation = [...dairyTokens, ...meatTokens].find((t) => ingredientTokens.has(t));
    if (violation) {
      adjustment -= 10;
      warnings.push(`Not vegan-friendly (contains ${violation})`);
    }
  }
  if (profile.dietaryPrefs.includes('VEGETARIAN')) {
    const meatTokens = ['beef', 'chicken', 'pork', 'gelatin', 'fish', 'meat', 'lard'];
    const violation = meatTokens.find((t) => ingredientTokens.has(t));
    if (violation) {
      adjustment -= 10;
      warnings.push(`Not vegetarian-friendly (contains ${violation})`);
    }
  }

  // --- Goal-based adjustments ---
  if (
    profile.goal === 'LOSE' &&
    nutrients.kcal !== null &&
    nutrients.kcal > NUTRIENT_THRESHOLDS.HIGH_CALORIE_PER_100G
  ) {
    adjustment -= 5;
    warnings.push(`Calorie-dense for a weight-loss goal`);
  }
  if (profile.goal === 'GAIN') {
    if (nutrients.protein !== null && nutrients.protein > NUTRIENT_THRESHOLDS.HIGH_PROTEIN_G) {
      adjustment += 5;
      positives.push(`Great protein for muscle gain`);
    }
    if (nutrients.fiber !== null && nutrients.fiber > NUTRIENT_THRESHOLDS.HIGH_FIBER_G) {
      adjustment += 3;
      positives.push(`Good fiber content`);
    }
  }

  // --- General positives ---
  if (nutrients.fiber !== null && nutrients.fiber > NUTRIENT_THRESHOLDS.HIGH_FIBER_G) {
    positives.push(`High fiber (${nutrients.fiber.toFixed(1)} g / 100g)`);
  }
  if (nutrients.protein !== null && nutrients.protein > NUTRIENT_THRESHOLDS.HIGH_PROTEIN_G) {
    positives.push(`High protein (${nutrients.protein.toFixed(1)} g / 100g)`);
  }

  // Cap total adjustment magnitude per plan §5.
  adjustment = clamp(adjustment, -25, 25);
  const finalScore = clamp(score + adjustment, 0, 100);

  return {
    score: Math.round(finalScore),
    grade: SCORE_TO_GRADE(finalScore),
    warnings,
    positives,
  };
}
