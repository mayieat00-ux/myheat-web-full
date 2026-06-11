'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  ActivityLevel,
  DietaryPref,
  Goal,
  MedicalFlag,
  Sex,
  type UserProfile,
} from '@mayieat/shared';
import { clientFetch } from '@/lib/api';

const schema = z.object({
  age: z.coerce.number().int().min(13).max(120),
  sex: z.enum([Sex.MALE, Sex.FEMALE, Sex.OTHER]),
  heightCm: z.coerce.number().min(80).max(260),
  weightKg: z.coerce.number().min(25).max(400),
  activityLevel: z.enum([
    ActivityLevel.SEDENTARY,
    ActivityLevel.LIGHT,
    ActivityLevel.MODERATE,
    ActivityLevel.ACTIVE,
    ActivityLevel.VERY_ACTIVE,
  ]),
  goal: z.enum([Goal.LOSE, Goal.MAINTAIN, Goal.GAIN]),
  allergies: z.string().optional().default(''),
  dietaryPrefs: z.array(z.string()).optional().default([]),
  medicalFlags: z.array(z.string()).optional().default([]),
});

type FormData = z.infer<typeof schema>;

type ProfileFormProps = {
  initial?: Partial<UserProfile>;
  redirectTo?: string;
  submitLabel?: string;
};

const sexOptions = [
  { value: Sex.MALE, label: 'Male', icon: '♂' },
  { value: Sex.FEMALE, label: 'Female', icon: '♀' },
  { value: Sex.OTHER, label: 'Other', icon: '⚧' },
];

const activityOptions = [
  { value: ActivityLevel.SEDENTARY, label: 'Sedentary', hint: 'Little to no exercise', icon: '🛋️' },
  { value: ActivityLevel.LIGHT, label: 'Light', hint: '1–3 days / week', icon: '🚶' },
  { value: ActivityLevel.MODERATE, label: 'Moderate', hint: '3–5 days / week', icon: '🏃' },
  { value: ActivityLevel.ACTIVE, label: 'Active', hint: '6–7 days / week', icon: '🚴' },
  { value: ActivityLevel.VERY_ACTIVE, label: 'Very active', hint: 'Twice a day', icon: '🏋️' },
];

const goalOptions = [
  { value: Goal.LOSE, label: 'Lose weight', icon: '📉' },
  { value: Goal.MAINTAIN, label: 'Maintain', icon: '⚖️' },
  { value: Goal.GAIN, label: 'Gain muscle', icon: '💪' },
];

const dietaryOptions: { value: string; label: string }[] = [
  { value: DietaryPref.VEGETARIAN, label: '🥕 Vegetarian' },
  { value: DietaryPref.VEGAN, label: '🌱 Vegan' },
  { value: DietaryPref.PESCATARIAN, label: '🐟 Pescatarian' },
  { value: DietaryPref.KETO, label: '🥑 Keto' },
  { value: DietaryPref.LOW_CARB, label: '🍞 Low carb' },
  { value: DietaryPref.HALAL, label: '🕌 Halal' },
  { value: DietaryPref.KOSHER, label: '✡️ Kosher' },
  { value: DietaryPref.GLUTEN_FREE, label: '🌾 Gluten-free' },
  { value: DietaryPref.DAIRY_FREE, label: '🥛 Dairy-free' },
];

const medicalOptions: { value: string; label: string }[] = [
  { value: MedicalFlag.DIABETES, label: 'Diabetes' },
  { value: MedicalFlag.HYPERTENSION, label: 'High blood pressure' },
  { value: MedicalFlag.HIGH_CHOLESTEROL, label: 'High cholesterol' },
  { value: MedicalFlag.PCOS, label: 'PCOS' },
  { value: MedicalFlag.CELIAC, label: 'Celiac' },
  { value: MedicalFlag.KIDNEY_DISEASE, label: 'Kidney disease' },
];

export function ProfileForm({
  initial,
  redirectTo = '/scan',
  submitLabel = 'Save profile',
}: ProfileFormProps) {
  const { data: session, update: refreshSession } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: initial?.age,
      sex: initial?.sex ?? Sex.MALE,
      heightCm: initial?.heightCm,
      weightKg: initial?.weightKg,
      activityLevel: initial?.activityLevel ?? ActivityLevel.MODERATE,
      goal: initial?.goal ?? Goal.MAINTAIN,
      allergies: initial?.allergies?.join(', ') ?? '',
      dietaryPrefs: initial?.dietaryPrefs ?? [],
      medicalFlags: initial?.medicalFlags ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const allergies = values.allergies
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      await clientFetch('/profile', {
        method: 'PUT',
        jwt: session?.backendJwt,
        body: {
          age: values.age,
          sex: values.sex,
          heightCm: values.heightCm,
          weightKg: values.weightKg,
          activityLevel: values.activityLevel,
          goal: values.goal,
          allergies,
          dietaryPrefs: values.dietaryPrefs,
          medicalFlags: values.medicalFlags,
        },
      });

      // Re-run the Auth.js jwt callback so the session cookie picks up
      // profileComplete=true from the backend.
      await refreshSession();

      // Hard navigation (not router.push) on purpose: a client-side push can
      // fire before the freshly-set session cookie has propagated, so the
      // middleware still sees profileComplete=false and bounces the user right
      // back to /onboarding. A full document load guarantees the new cookie is
      // sent with the request to `redirectTo`.
      window.location.assign(redirectTo);
      return; // keep the button in its "Saving…" state through the reload
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-28 sm:pb-6">
      {/* ---- About you ---- */}
      <Section title="About you" emoji="👤" subtitle="The basics we use to size your nutrition.">
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Age"
            suffix="yrs"
            error={errors.age?.message}
            reg={register('age')}
            placeholder="28"
          />
          <NumberField
            label="Weight"
            suffix="kg"
            step="0.1"
            error={errors.weightKg?.message}
            reg={register('weightKg')}
            placeholder="70"
          />
          <NumberField
            label="Height"
            suffix="cm"
            step="0.1"
            error={errors.heightCm?.message}
            reg={register('heightCm')}
            placeholder="175"
          />
          <div className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Sex</span>
            <Segmented options={sexOptions} reg={register('sex')} name="sex" />
            {errors.sex?.message && <ErrorText>{errors.sex.message}</ErrorText>}
          </div>
        </div>
      </Section>

      {/* ---- Goal ---- */}
      <Section title="Your goal" emoji="🎯" subtitle="What are you working towards?">
        <Segmented options={goalOptions} reg={register('goal')} name="goal" stacked />
        {errors.goal?.message && <ErrorText>{errors.goal.message}</ErrorText>}
      </Section>

      {/* ---- Activity ---- */}
      <Section title="Activity level" emoji="🔥" subtitle="How active are you on a typical week?">
        <div className="space-y-2">
          {activityOptions.map((opt) => (
            <RadioCard key={opt.value} value={opt.value} reg={register('activityLevel')}>
              <span className="text-xl">{opt.icon}</span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-gray-900">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.hint}</span>
              </span>
            </RadioCard>
          ))}
        </div>
        {errors.activityLevel?.message && <ErrorText>{errors.activityLevel.message}</ErrorText>}
      </Section>

      {/* ---- Diet & health ---- */}
      <Section title="Diet & health" emoji="🥗" subtitle="Helps us tailor ratings and avoid risks.">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Allergies</span>
          <input
            type="text"
            {...register('allergies')}
            className={inputCls}
            placeholder="e.g. peanuts, shellfish"
          />
          <span className="mt-1 block text-xs text-gray-400">Separate with commas.</span>
        </label>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium text-gray-700">Dietary preferences</legend>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((opt) => (
              <Chip
                key={opt.value}
                value={opt.value}
                reg={register('dietaryPrefs')}
                label={opt.label}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium text-gray-700">
            Medical conditions <span className="font-normal text-gray-400">(optional)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {medicalOptions.map((opt) => (
              <Chip
                key={opt.value}
                value={opt.value}
                reg={register('medicalFlags')}
                label={opt.label}
              />
            ))}
          </div>
        </fieldset>
      </Section>

      {serverError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      {/* Submit — sticky bottom bar on mobile, inline on larger screens */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white/90 px-6 py-3 backdrop-blur safe-pb safe-px sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <button
          type="submit"
          disabled={submitting}
          className="mx-auto block w-full max-w-2xl rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition active:scale-[0.99] hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ----------------------------- building blocks ---------------------------- */

const inputCls =
  'block w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20';

function Section({
  title,
  emoji,
  subtitle,
  children,
}: {
  title: string;
  emoji: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 mb-2 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg">
          {emoji}
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function NumberField({
  label,
  suffix,
  step,
  placeholder,
  error,
  reg,
}: {
  label: string;
  suffix?: string;
  step?: string;
  placeholder?: string;
  error?: string;
  reg: UseFormRegisterReturn;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          placeholder={placeholder}
          {...reg}
          className={`${inputCls} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

/** Segmented pill control backed by radio inputs (touch-friendly). */
// Literal class names so Tailwind's JIT scanner picks them up (dynamic
// template strings like `grid-cols-${n}` are NOT detected).
const COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function Segmented({
  options,
  reg,
  name,
  stacked,
}: {
  options: { value: string; label: string; icon?: string }[];
  reg: UseFormRegisterReturn;
  name: string;
  stacked?: boolean;
}) {
  return (
    <div
      className={`grid gap-2 ${stacked ? 'grid-cols-1 sm:grid-cols-3' : (COLS[options.length] ?? 'grid-cols-3')}`}
    >
      {options.map((opt) => (
        <label key={opt.value} className="cursor-pointer">
          <input type="radio" value={opt.value} {...reg} name={name} className="peer sr-only" />
          <span className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40">
            {opt.icon && <span aria-hidden>{opt.icon}</span>}
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/** Full-width selectable row backed by a radio input. */
function RadioCard({
  value,
  reg,
  children,
}: {
  value: string;
  reg: UseFormRegisterReturn;
  children: React.ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input type="radio" value={value} {...reg} className="peer sr-only" />
      <span className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:ring-1 peer-checked:ring-brand-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40">
        {children}
      </span>
    </label>
  );
}

/** Multi-select chip backed by a checkbox input. */
function Chip({ value, reg, label }: { value: string; reg: UseFormRegisterReturn; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" value={value} {...reg} className="peer sr-only" />
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-700 transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 hover:border-brand-400">
        {label}
      </span>
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <span className="mt-1 block text-xs text-red-600">{children}</span>;
}
