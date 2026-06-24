export const Sex = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;
export type Sex = (typeof Sex)[keyof typeof Sex];

export const ActivityLevel = {
  SEDENTARY: 'SEDENTARY',
  LIGHT: 'LIGHT',
  MODERATE: 'MODERATE',
  ACTIVE: 'ACTIVE',
  VERY_ACTIVE: 'VERY_ACTIVE',
} as const;
export type ActivityLevel = (typeof ActivityLevel)[keyof typeof ActivityLevel];

export const Goal = {
  LOSE: 'LOSE',
  MAINTAIN: 'MAINTAIN',
  GAIN: 'GAIN',
} as const;
export type Goal = (typeof Goal)[keyof typeof Goal];

export const DietaryPref = {
  VEGETARIAN: 'VEGETARIAN',
  VEGAN: 'VEGAN',
  PESCATARIAN: 'PESCATARIAN',
  KETO: 'KETO',
  LOW_CARB: 'LOW_CARB',
  HALAL: 'HALAL',
  KOSHER: 'KOSHER',
  GLUTEN_FREE: 'GLUTEN_FREE',
  DAIRY_FREE: 'DAIRY_FREE',
} as const;
export type DietaryPref = (typeof DietaryPref)[keyof typeof DietaryPref];

export const MedicalFlag = {
  DIABETES: 'DIABETES',
  HYPERTENSION: 'HYPERTENSION',
  HIGH_CHOLESTEROL: 'HIGH_CHOLESTEROL',
  PCOS: 'PCOS',
  CELIAC: 'CELIAC',
  KIDNEY_DISEASE: 'KIDNEY_DISEASE',
} as const;
export type MedicalFlag = (typeof MedicalFlag)[keyof typeof MedicalFlag];

export const ScanMethod = {
  BARCODE: 'BARCODE',
  IMAGE: 'IMAGE',
} as const;
export type ScanMethod = (typeof ScanMethod)[keyof typeof ScanMethod];

export const FoodSource = {
  BARCODE: 'BARCODE',
  AI_VISION: 'AI_VISION',
  MANUAL: 'MANUAL',
} as const;
export type FoodSource = (typeof FoodSource)[keyof typeof FoodSource];

export const SubscriptionPlan = {
  FREE: 'FREE',
  PRO: 'PRO',
} as const;
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const AIFeature = {
  IMAGE_SCAN: 'IMAGE_SCAN',
  RATING_EXPLANATION: 'RATING_EXPLANATION',
  DIET_PLAN: 'DIET_PLAN',
} as const;
export type AIFeature = (typeof AIFeature)[keyof typeof AIFeature];

export const NutriGrade = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
} as const;
export type NutriGrade = (typeof NutriGrade)[keyof typeof NutriGrade];

export const MealSlot = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
} as const;
export type MealSlot = (typeof MealSlot)[keyof typeof MealSlot];
