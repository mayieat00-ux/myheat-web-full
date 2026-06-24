/**
 * OpenFoodFacts client.
 * - No API key required.
 * - Friendly User-Agent per OFF guidelines.
 * - Defensive parsing — many fields are optional.
 */

import axios from 'axios';
import { z } from 'zod';

import type { NutrientsPer100g, NutriGrade } from '@/shared';
import { HttpError } from './error';

const OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v2';
const USER_AGENT = 'MayiEat/0.1 (https://mayieat.app)';
const TIMEOUT_MS = 8000;

// Tolerant parser — OFF returns lots of optional fields. Always default to null.
const nutrimentsSchema = z
  .object({
    'energy-kcal_100g': z.number().nullable().optional(),
    proteins_100g: z.number().nullable().optional(),
    carbohydrates_100g: z.number().nullable().optional(),
    sugars_100g: z.number().nullable().optional(),
    fiber_100g: z.number().nullable().optional(),
    fat_100g: z.number().nullable().optional(),
    'saturated-fat_100g': z.number().nullable().optional(),
    salt_100g: z.number().nullable().optional(),
    sodium_100g: z.number().nullable().optional(),
  })
  .passthrough();

const productSchema = z
  .object({
    code: z.string().optional(),
    product_name: z.string().optional(),
    product_name_en: z.string().optional(),
    brands: z.string().optional(),
    image_url: z.string().optional(),
    image_front_url: z.string().optional(),
    ingredients_text: z.string().optional(),
    ingredients_text_en: z.string().optional(),
    additives_tags: z.array(z.string()).optional(),
    nutriscore_grade: z.string().optional(),
    nutriscore_score: z.number().optional(),
    nutriments: nutrimentsSchema.optional(),
  })
  .passthrough();

const responseSchema = z.object({
  status: z.number(),
  status_verbose: z.string().optional(),
  code: z.string().optional(),
  product: productSchema.optional(),
});

export interface OffProduct {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  nutrients: NutrientsPer100g;
  ingredients: string | null;
  additives: string[];
  nutriScoreGrade: NutriGrade | null;
  nutriScoreValue: number | null;
  /** Raw OFF payload, stored for debugging / future re-processing. */
  raw: unknown;
}

function normalizeGrade(g?: string): NutriGrade | null {
  if (!g) return null;
  const up = g.toUpperCase();
  return up === 'A' || up === 'B' || up === 'C' || up === 'D' || up === 'E' ? up : null;
}

function cleanAdditive(tag: string): string {
  // "en:e322i" → "e322i"
  return tag.includes(':') ? tag.split(':')[1]! : tag;
}

/**
 * Fetch a product by barcode. Throws HttpError(404) on not-found.
 */
export async function fetchByBarcode(barcode: string): Promise<OffProduct> {
  let payload: unknown;
  try {
    const res = await axios.get<unknown>(`${OFF_BASE_URL}/product/${barcode}.json`, {
      timeout: TIMEOUT_MS,
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      validateStatus: (s) => s < 500, // treat 404 as a successful (empty) response
    });
    payload = res.data;
  } catch (err) {
    throw new HttpError(
      502,
      'openfoodfacts_unreachable',
      err instanceof Error ? err.message : 'Failed to reach OpenFoodFacts',
    );
  }

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new HttpError(502, 'openfoodfacts_invalid_response', 'Unexpected OFF payload shape');
  }
  const body = parsed.data;
  if (body.status !== 1 || !body.product) {
    throw new HttpError(404, 'product_not_found', `No product found for barcode ${barcode}`);
  }

  const p = body.product;
  const n = p.nutriments ?? {};

  const name = p.product_name_en ?? p.product_name ?? `Unknown product (${barcode})`;
  const ingredients = p.ingredients_text_en ?? p.ingredients_text ?? null;

  return {
    barcode,
    name: name.trim(),
    brand: p.brands ? p.brands.split(',')[0]!.trim() : null,
    imageUrl: p.image_url ?? p.image_front_url ?? null,
    nutrients: {
      kcal: n['energy-kcal_100g'] ?? null,
      protein: n.proteins_100g ?? null,
      carbs: n.carbohydrates_100g ?? null,
      sugar: n.sugars_100g ?? null,
      fiber: n.fiber_100g ?? null,
      fat: n.fat_100g ?? null,
      satFat: n['saturated-fat_100g'] ?? null,
      salt: n.salt_100g ?? null,
      sodium: n.sodium_100g ?? null,
    },
    ingredients,
    additives: (p.additives_tags ?? []).map(cleanAdditive),
    nutriScoreGrade: normalizeGrade(p.nutriscore_grade),
    nutriScoreValue: typeof p.nutriscore_score === 'number' ? p.nutriscore_score : null,
    raw: payload,
  };
}
