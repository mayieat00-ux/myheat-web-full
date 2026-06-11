import type {
  ActivityLevel,
  AIFeature,
  DietaryPref,
  FoodSource,
  Goal,
  MealSlot,
  MedicalFlag,
  NutriGrade,
  ScanMethod,
  Sex,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../enums/index.js';

// ============================================================
// User & Profile
// ============================================================
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  allergies: string[];
  dietaryPrefs: DietaryPref[];
  medicalFlags: MedicalFlag[];
  dailyCalorieTarget: number | null;
  updatedAt: string;
}

export type ProfileInput = Omit<UserProfile, 'userId' | 'dailyCalorieTarget' | 'updatedAt'>;

// ============================================================
// Food & Nutrients
// ============================================================
export interface NutrientsPer100g {
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  sugar: number | null;
  fiber: number | null;
  fat: number | null;
  satFat: number | null;
  salt: number | null;
  sodium: number | null;
}

export interface Food {
  id: string;
  source: FoodSource;
  barcode: string | null;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrients: NutrientsPer100g;
  ingredients: string | null;
  additives: string[];
  nutriScoreGrade: NutriGrade | null;
  nutriScoreValue: number | null;
  createdAt: string;
}

// ============================================================
// Rating
// ============================================================
export interface HealthRating {
  score: number; // 0..100
  grade: NutriGrade;
  warnings: string[];
  positives: string[];
  explanation?: string; // AI-generated, optional
}

// ============================================================
// Scan
// ============================================================
export interface Scan {
  id: string;
  userId: string;
  foodId: string;
  method: ScanMethod;
  imageUrl: string | null;
  personalizedRating: HealthRating;
  createdAt: string;
}

export interface ScanResultPayload {
  scan: Scan;
  food: Food;
  rating: HealthRating;
}

// ============================================================
// Diet Plan
// ============================================================
export interface DietMeal {
  slot: MealSlot;
  name: string;
  kcal: number;
  macros: { protein: number; carbs: number; fat: number };
  rationale: string;
}

export interface DietPlanContent {
  meals: DietMeal[];
  dailyTotals: { kcal: number; protein: number; carbs: number; fat: number };
  tips: string[];
  disclaimer: string;
}

export interface DietPlan {
  id: string;
  userId: string;
  periodType: 'DAILY' | 'WEEKLY';
  periodStart: string;
  content: DietPlanContent;
  model: string;
  createdAt: string;
}

// ============================================================
// Daily Log
// ============================================================
export interface LogEntry {
  foodId: string;
  servingsG: number;
  mealSlot: MealSlot;
}

export interface DailyLogTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  entries: LogEntry[];
  totals: DailyLogTotals;
}

// ============================================================
// Subscription / Billing
// ============================================================
export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
}

export interface BillingStatus {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  weeklyAIUsage: {
    used: number;
    limit: number | null; // null = unlimited (Pro)
    resetsAt: string;
  };
  features: {
    imageScan: boolean;
    aiExplanation: boolean;
    dietPlan: boolean;
    unlimitedHistory: boolean;
  };
}

export interface AIUsageEvent {
  id: string;
  userId: string;
  feature: AIFeature;
  weekKey: string;
  createdAt: string;
}

// ============================================================
// API envelopes
// ============================================================
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

export interface QuotaExceededError extends ApiError {
  error: 'quota_exceeded';
  limit: number;
  used: number;
  resetsAt: string;
  plan: SubscriptionPlan;
}
