# Eleos Medical

Eleos Medical is a Next.js 14 medical-report simplifier. It uses TypeScript, Tailwind CSS, the App Router, a custom shadcn/ui-inspired theme, Lucide icons, Framer Motion, and react-dropzone.

## Run locally

From this project folder, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the Local URL printed by Next.js (usually [http://localhost:3000](http://localhost:3000)). If port 3000 is already occupied, Next.js will use a different port such as `http://localhost:3001`.

## Supabase Auth and interest-list setup

1. Create a Supabase project, enable Email and Google under **Authentication → Providers**, and add `http://localhost:3000/auth/callback` as an allowed redirect URL.
2. Copy `.env.example` to `.env.local` and fill in the Supabase values. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; never put it in a browser-exposed variable.
3. Run `supabase/migrations/20260805_create_users.sql`, `supabase/migrations/20260806_add_onboarding_preferences.sql`, and `supabase/migrations/20260806_create_consult_interest.sql` in the Supabase SQL Editor. The last migration stores only the name and email submitted to the future-consultation interest list.

## OpenAI simplification setup

Add `OPENAI_API_KEY` to `.env.local`. `POST /api/simplify` sends extracted report text to the OpenAI Responses API with `store: false`, then returns a constrained educational-only JSON summary. It does not save the report text in this application. You can set `OPENAI_MODEL` if you need a different supported model.

## In-memory file parsing

`POST /api/parse` accepts one multipart field named `file` containing a PDF or image (up to 20 MB). PDFs are read with `pdf-parse`; images are read with Tesseract.js OCR. The file and raw extracted text are processed only in memory and are not saved.

## Structure

- `app/` — App Router routes and global styles
- `components/` — reusable components and shadcn/ui primitives
- `lib/` — shared utilities
- `types/` — TypeScript types
- `hooks/` — reusable React hooks
