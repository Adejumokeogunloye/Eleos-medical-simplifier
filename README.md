# Next.js 14 Starter

A Next.js 14 project using TypeScript, Tailwind CSS, the App Router, and a custom shadcn/ui theme. It includes `lucide-react`, `framer-motion`, and `react-dropzone`.

## Run locally

Install dependencies, then start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Auth setup

1. Create a Supabase project, enable Email and Google under **Authentication → Providers**, and add `http://localhost:3000/auth/callback` as an allowed redirect URL.
2. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable key.
3. Run `supabase/migrations/20260805_create_users.sql` in the Supabase SQL Editor to create the RLS-protected user profile table.

## Structure

- `app/` — App Router routes and global styles
- `components/` — reusable components and shadcn/ui primitives
- `lib/` — shared utilities
- `types/` — TypeScript types
- `hooks/` — reusable React hooks
