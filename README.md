# Eleos Medical

Eleos Medical is a Next.js 14 app that turns medical-report wording into plain-language educational summaries. It does not diagnose, treat, or replace a qualified healthcare professional.

## Run locally

```bash
npm install
npm run dev
```

Open the Local URL printed by Next.js, usually `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local`, then supply these values:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL, exposed to the browser. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase browser-safe publishable key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only account deletion and interest-list operations. Never expose it with a `NEXT_PUBLIC_` prefix. |
| `OPENAI_API_KEY` | Yes | Server-only OpenAI key for educational summaries. |
| `OPENAI_MODEL` | Optional | Defaults to `gpt-5`. |
| `SIMPLIFY_RATE_LIMIT_MAX` | Optional | Requests per IP in the rate-limit window; defaults to 5. |
| `SIMPLIFY_RATE_LIMIT_WINDOW_MS` | Optional | Rate-limit window in milliseconds; defaults to 600000 (10 minutes). |

## Supabase setup

1. Enable Email and Google authentication in Supabase.
2. Add local and deployed redirect URLs, for example `http://localhost:3000/auth/callback` and `https://your-domain.vercel.app/auth/callback`.
3. Run every SQL file in `supabase/migrations/` in the Supabase SQL Editor, in filename order.

## Deploy to Vercel

1. Push the project to GitHub and import the repository in Vercel using the **Next.js** preset.
2. In **Project Settings → Environment Variables**, add every required value above for **Production**. Add the same non-local values to **Preview** if you use preview deployments.
3. Deploy or redeploy after changing variables; changes apply only to newly created deployments.
4. In Supabase Authentication settings, add the exact Vercel production URL and any preview URL you need to test as redirect URLs.
5. Run a production build before pushing when possible:

```bash
npm run build
```

Vercel environment variables are configured outside source control. Keep `.env.local` private and never commit service-role or OpenAI keys.

## Data handling

Uploaded source files are processed in memory and are not retained. Extracted report text is sent to OpenAI to create a summary and is stored in Supabase when report history is enabled. Read the in-app **Disclaimer & privacy** page before using real patient data.

## Rate limiting

`/api/simplify` has a basic per-IP in-memory limit. It helps prevent accidental or simple abuse, but Vercel functions can run on multiple instances, so use a shared rate-limit service before relying on it as a strict production abuse control.

## Local source backup

An administrator-controlled, local-only backup utility creates a ZIP of the current source code. It excludes `node_modules`, `.env` files, build output, Git metadata, and previous backups. It does not upload anything.

In Windows Command Prompt, run:

```bat
set EXPORT_PROJECT_ADMIN=1 && npm run export:project -- --confirm
```

The ZIP is saved in the ignored `backups/` folder. Run `npm install` after pulling this change so the `tsx` development dependency is available.
