// Launches `next dev` with a bumped Node heap. Cross-platform — no shell-specific env syntax.
//   Inherits stdio so output streams to the terminal as usual.
//   Uses 3072 MB heap which is more than enough for our Next 15 + zxing bundle
//   and avoids the OOM crashes we hit on memory-constrained Windows machines.

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const child = spawn(
  process.execPath,
  ['--max-old-space-size=3072', nextBin, 'dev', '--port', '3001'],
  { stdio: 'inherit', env: process.env },
);

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
