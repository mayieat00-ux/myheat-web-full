/**
 * Free-tier weekly AI quota. Pro is unlimited.
 * See plan §11 — Subscription Model.
 */
export const FREE_TIER_WEEKLY_AI_QUOTA = 2;

/**
 * Daily cap on diet-plan regeneration for Pro users.
 */
export const PRO_DIET_REGENERATE_DAILY_CAP = 3;

/**
 * Nutri-Score → 0–100 score mapping.
 * Higher Nutri-Score points = unhealthier, so score is inverted.
 */
export const NUTRI_SCORE_OFFSET = 15;
export const NUTRI_SCORE_RANGE = 40;

/**
 * Mifflin-St Jeor activity multipliers.
 */
export const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
} as const;

/**
 * Goal-based calorie adjustments (kcal/day).
 */
export const GOAL_CALORIE_ADJUSTMENT = {
  LOSE: -500,
  MAINTAIN: 0,
  GAIN: 500,
} as const;

/**
 * Nutrient warning thresholds (per 100 g).
 */
export const NUTRIENT_THRESHOLDS = {
  HIGH_SODIUM_MG: 400,
  HIGH_SUGAR_G: 15,
  HIGH_SAT_FAT_G: 5,
  HIGH_CALORIE_PER_100G: 400,
  HIGH_FIBER_G: 6,
  HIGH_PROTEIN_G: 12,
} as const;

/**
 * Image upload limits.
 */
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION_PX = 1024;
