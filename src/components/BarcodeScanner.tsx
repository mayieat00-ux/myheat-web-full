'use client';

import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from '@zxing/browser';
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'requesting' | 'scanning' | 'denied' | 'unavailable' | 'error';

export function BarcodeScanner({
  onDetected,
  paused,
}: {
  onDetected: (barcode: string) => void;
  paused?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lastReportedRef = useRef<string | null>(null);
  const lastReportedAtRef = useRef<number>(0);

  useEffect(() => {
    if (paused) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;
    const reader = new BrowserMultiFormatReader();
    setStatus('requesting');

    reader
      .decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoEl,
        (result, _err, controls) => {
          if (cancelled) {
            controls.stop();
            return;
          }
          if (status !== 'scanning') setStatus('scanning');
          controlsRef.current = controls;
          if (!result) return;

          const text = result.getText();
          // Debounce duplicate detections within 1.5 s.
          const now = Date.now();
          if (lastReportedRef.current === text && now - lastReportedAtRef.current < 1500) return;
          lastReportedRef.current = text;
          lastReportedAtRef.current = now;
          onDetected(text);
        },
      )
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err && typeof err === 'object' && 'name' in err ? String(err.name) : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setStatus('denied');
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          setStatus('unavailable');
        } else {
          setStatus('error');
          setErrorMsg(err instanceof Error ? err.message : 'Could not start camera');
        }
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="h-full w-full object-cover"
      />

      {/* viewfinder overlay */}
      {status === 'scanning' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-44 w-72 max-w-[80%] rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
            <Corner className="-left-0.5 -top-0.5 rounded-tl-2xl border-l-4 border-t-4" />
            <Corner className="-right-0.5 -top-0.5 rounded-tr-2xl border-r-4 border-t-4" />
            <Corner className="-bottom-0.5 -left-0.5 rounded-bl-2xl border-b-4 border-l-4" />
            <Corner className="-bottom-0.5 -right-0.5 rounded-br-2xl border-b-4 border-r-4" />
            <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-brand-400" />
          </div>
        </div>
      )}

      {status !== 'scanning' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 px-6 text-center text-white">
          {status === 'requesting' && (
            <>
              <Spinner />
              <p className="mt-4 text-base">Starting camera…</p>
              <p className="mt-1 text-xs text-gray-400">Allow camera access when prompted.</p>
            </>
          )}
          {status === 'idle' && <p className="text-sm text-gray-400">Initializing…</p>}
          {status === 'denied' && (
            <>
              <BlockedIcon />
              <p className="mt-3 text-base font-semibold">Camera permission denied</p>
              <p className="mt-1 max-w-xs text-sm text-gray-300">
                Enable camera access in your browser settings and reload the page.
              </p>
            </>
          )}
          {status === 'unavailable' && (
            <>
              <BlockedIcon />
              <p className="mt-3 text-base font-semibold">No camera available</p>
              <p className="mt-1 max-w-xs text-sm text-gray-300">
                Use the manual entry below to type the barcode instead.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <BlockedIcon />
              <p className="mt-3 text-base font-semibold">Camera error</p>
              <p className="mt-1 max-w-xs text-sm text-gray-300">{errorMsg}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Corner({ className = '' }: { className?: string }) {
  return <div className={`absolute h-6 w-6 border-white ${className}`} />;
}

function Spinner() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="animate-spin text-brand-400" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" fill="none" />
      <path d="M16 3a13 13 0 0 1 13 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BlockedIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-red-400" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M5.5 5.5l13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
