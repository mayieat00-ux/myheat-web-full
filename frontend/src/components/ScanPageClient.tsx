'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ApiError, clientFetch } from '@/lib/api';
import type { ScanResultPayload } from '@mayieat/shared';

type Mode = 'camera' | 'manual';

export function ScanPageClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mode, setMode] = useState<Mode>('camera');
  const [manualValue, setManualValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitBarcode(barcode: string) {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await clientFetch<ScanResultPayload>('/scan/barcode', {
        method: 'POST',
        jwt: session?.backendJwt,
        body: { barcode },
      });
      router.push(`/scan/result/${result.scan.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setError(`No product found for barcode ${barcode}.`);
        else if (err.status === 400) setError('Invalid barcode. Must be 6–14 digits.');
        else if (err.status === 409) {
          router.push('/onboarding');
          return;
        } else setError(err.message);
      } else {
        setError('Could not reach the scanner service. Check your connection.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-gray-950 text-white safe-px">
      {/* Top bar */}
      <header className="safe-pt flex items-center justify-between px-4 pt-4 pb-3">
        <Link
          href="/scan"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur transition active:scale-95"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
        <h1 className="text-base font-semibold">Scan food</h1>
        <Link
          href="/profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur transition active:scale-95"
          aria-label="Profile"
        >
          <UserIcon />
        </Link>
      </header>

      {/* Mode tabs */}
      <div className="px-4">
        <div className="grid grid-cols-2 rounded-full bg-white/10 p-1 text-sm">
          <button
            onClick={() => setMode('camera')}
            className={`h-10 rounded-full font-medium transition ${
              mode === 'camera' ? 'bg-white text-gray-900 shadow' : 'text-white/70'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`h-10 rounded-full font-medium transition ${
              mode === 'manual' ? 'bg-white text-gray-900 shadow' : 'text-white/70'
            }`}
          >
            Manual entry
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="relative mt-4 flex-1">
        {mode === 'camera' ? (
          <BarcodeScanner onDetected={submitBarcode} paused={submitting} />
        ) : (
          <ManualEntryForm
            value={manualValue}
            onChange={setManualValue}
            onSubmit={submitBarcode}
            submitting={submitting}
          />
        )}

        {/* loading overlay */}
        {submitting && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 px-6 py-5 text-white">
              <Spinner />
              <p className="text-sm">Looking it up…</p>
            </div>
          </div>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div className="safe-pb sticky bottom-0 z-20 px-4 pb-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-500/95 px-4 py-3 text-sm shadow-lg">
            <ErrorIcon />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="text-white/80" aria-label="Dismiss">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      {mode === 'camera' && !submitting && !error && (
        <div className="safe-pb px-4 py-4 text-center text-xs text-white/60">
          Align a barcode inside the box. We&apos;ll catch it automatically.
        </div>
      )}
    </div>
  );
}

function ManualEntryForm({
  value,
  onChange,
  onSubmit,
  submitting,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  submitting: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="flex h-full flex-col justify-between px-6 pb-6"
    >
      <div className="mx-auto mt-12 w-full max-w-sm">
        <label className="text-sm text-white/70">Type a barcode</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus
          maxLength={14}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          placeholder="e.g. 3017620422003"
          className="mt-2 block w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-2xl tracking-wider text-white placeholder-white/30 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="mt-2 text-xs text-white/50">
          6–14 digits. Try <code className="text-brand-300">3017620422003</code> (Nutella) to test.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || value.length < 6}
        className="safe-pb mx-auto block w-full max-w-sm rounded-2xl bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-40"
      >
        {submitting ? 'Looking up…' : 'Scan barcode'}
      </button>
    </form>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" className="animate-spin text-brand-400" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" fill="none" />
      <path d="M16 3a13 13 0 0 1 13 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 6v4M10 13v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
