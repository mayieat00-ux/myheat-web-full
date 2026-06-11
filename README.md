# MayiEat

Healthy food scanner web app. Scan a food (barcode or photo) and get a personalized health rating, full nutrition details, and AI-powered diet suggestions.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **APIs**: OpenFoodFacts (barcodes) + Google Gemini (vision + diet plans)
- **Auth**: Google OAuth via Auth.js

## Monorepo layout

```text
mayieat-web/
├── shared/      # Shared types, enums, constants
├── backend/     # Express API server
└── frontend/    # Next.js web app
```

## Getting started

```bash
# 1. Install all workspaces
npm install

# 2. Copy env templates and fill in values
cp .env.example backend/.env
cp .env.example frontend/.env.local

# 3. Initialize the database (PostgreSQL must be running)
npm run db:migrate

# 4. Start both apps in dev mode
npm run dev
```

- Backend: <http://localhost:4000>
- Frontend: <http://localhost:3001>

## Subscription model

- **Free**: unlimited barcode scans, 2 AI requests / week
- **Pro**: unlimited AI (payment gateway = Phase 2)

## Disclaimer

MayiEat provides wellness suggestions, **not medical advice**. Always consult a qualified professional for health decisions.
