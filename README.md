# MayiEat

Healthy food scanner web app. Scan a food (barcode or photo) and get a personalized health rating, full nutrition details, and AI-powered diet suggestions.

## Stack

- **App**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **APIs**: OpenFoodFacts (barcodes) + Google Gemini (vision + diet plans)
- **Auth**: Google OAuth via Auth.js
- **API routes**: Embedded in Next.js (no separate backend server)

## Monorepo layout

```text
mayieat-web/
├── shared/      # Shared types, enums, constants
└── frontend/    # Next.js web app + embedded API routes
```

## Getting started

```bash
# 1. Install all workspaces
npm install

# 2. Fill in the root .env file with your credentials
# See the inline comments in .env

# 3. Initialize the database (PostgreSQL must be running)
npm run db:migrate

# 4. Start the dev server
npm run dev
```

- App: <http://localhost:3001>
- API: <http://localhost:3001/api/v1>

## Subscription model

- **Free**: unlimited barcode scans, 2 AI requests / week
- **Pro**: unlimited AI (payment gateway = Phase 2)

## Disclaimer

MayiEat provides wellness suggestions, **not medical advice**. Always consult a qualified professional for health decisions.
