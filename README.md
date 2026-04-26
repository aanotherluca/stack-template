# Stack Template

A production-ready full-stack starter built with React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and React Router.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + Vite 6 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + CSS variables |
| Components | shadcn/ui (Radix UI primitives) |
| Backend / DB | Supabase (Auth, Postgres, Storage) |
| Routing | React Router v7 |
| Icons | Lucide React |

## Project structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives (Button, Card, Toast, …)
│   ├── Layout.tsx   # Root layout with Navbar + footer
│   └── Navbar.tsx
├── hooks/
│   ├── useSupabase.ts   # Returns the shared Supabase client
│   └── useToast.ts      # Re-exports toast helpers
├── lib/
│   ├── supabase.ts  # Supabase client (reads from env vars)
│   └── utils.ts     # cn() helper (clsx + tailwind-merge)
├── pages/
│   ├── Home.tsx
│   └── NotFound.tsx
├── App.tsx          # Route definitions
├── main.tsx         # Entry point
└── index.css        # Tailwind directives + CSS variable theme
```

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd stack-template
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project under **Settings → API**.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint with ESLint |
| `npm run type-check` | Run `tsc` without emitting files |

## Adding shadcn/ui components

This project ships with `components.json` configured, so the shadcn CLI works out of the box:

```bash
npx shadcn@latest add <component-name>
# e.g.
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
```

Components are added to `src/components/ui/`.

## Using Supabase

Import the pre-configured client anywhere:

```ts
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("your_table").select("*");
```

Or use the hook inside a component:

```ts
import { useSupabase } from "@/hooks/useSupabase";

const supabase = useSupabase();
```

## Adding pages

1. Create a file in `src/pages/`.
2. Add a `<Route>` inside the `<Layout>` element in `src/App.tsx`.
3. Link to it from the Navbar or wherever needed.

## Dark mode

CSS variables for both light and dark themes are already defined in `src/index.css`. Toggle by adding/removing the `dark` class on `<html>` — wire this up to a state or `prefers-color-scheme` as needed.

## Environment variables

All client-side env vars must be prefixed with `VITE_` to be exposed by Vite.

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous (public) key |
| `VITE_APP_NAME` | Application name (optional) |
| `VITE_APP_URL` | Public URL of the deployed app (optional) |

> **Never commit `.env` to git.** Only `.env.example` (with placeholder values) should be version-controlled.

## Deployment

Build the static output and deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, etc.):

```bash
npm run build
```

Remember to set the env vars in your hosting provider's dashboard.
