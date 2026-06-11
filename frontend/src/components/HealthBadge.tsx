'use client';

import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export function HealthBadge() {
  const [state, setState] = useState<'loading' | 'ok' | 'down'>('loading');
  const [data, setData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: HealthResponse) => {
        if (cancelled) return;
        setData(json);
        setState('ok');
      })
      .catch(() => {
        if (cancelled) return;
        setState('down');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'loading') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
        Checking…
      </span>
    );
  }
  if (state === 'down') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Backend unreachable
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
      title={data ? new Date(data.timestamp).toLocaleString() : ''}
    >
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {data?.service ?? 'Backend'} OK
    </span>
  );
}
