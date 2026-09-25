# Portfolio Website

Coded rebuild of [aryanx.framer.website](https://aryanx.framer.website), with
[Sanity](https://sanity.io) as the CMS so content stays editable without touching code.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 ·
Sanity (Studio embedded at `/studio`) · Motion + Lenis · deployed on Vercel

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the Sanity values
npm run dev
```

The site runs at `localhost:3000`, the CMS at `localhost:3000/studio`.

Without `NEXT_PUBLIC_SANITY_PROJECT_ID` set, the site still builds and runs — it
just renders empty states. This is intentional, so the build never depends on
content existing.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run check` | Typecheck + lint + format check (run before pushing) |
| `npm run check:ui` | Browser checks — needs a running server (see below) |
| `npm run typegen` | Regenerate TS types from the Sanity schema |

### Browser checks

`npm run check` cannot see layout or motion. `npm run check:ui` drives a real
Chromium over the site and asserts the things that only appear when it renders:
the card deck stays inside its column, the ghost CTA is reachable, no content is
stranded invisible under reduced motion, and no route overflows at phone width.

```bash
npm run build && npm start        # in one terminal
npm run check:ui                  # in another
BASE_URL=http://localhost:3200 npm run check:ui   # if using another port
```

These caught three bugs typecheck and lint could not: a reduced-motion branch
that stranded the hero at opacity 0, fanned cards clipping against their frame,
and a View button buried under the deck.

**Run `npm run typegen` after any schema change** — the generated types are what
keep queries honest against the content model.

## How content updates reach the site

Pages are statically generated. Content is read inside `use cache` scopes tagged
by document type. When you publish in the Studio, a Sanity webhook calls
`/api/revalidate`, which invalidates just the affected tags.

Net effect: edits go live in seconds, with no rebuild and no redeploy.

### Wiring the webhook (once, after deploying)

1. In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**
2. **URL:** `https://<your-domain>/api/revalidate`
3. **Dataset:** `production` · **Trigger on:** Create, Update, Delete
4. **HTTP method:** `POST` · **API version:** `v2021-03-25`
5. **Projection:** `{_type, "slug": slug.current}`
6. **Secret:** the same value as `SANITY_REVALIDATE_SECRET` in your env

## Deploying to Vercel

1. [vercel.com/new](https://vercel.com/new) → import this repository
2. Set the production branch under **Settings → Git** if not using `main`
3. **No environment variables are required** — the site builds and renders
   fully on the seed content in `src/sanity/lib/seed.ts`
4. Deploy

Once a Sanity project exists, add the four variables below and the site
switches from seed to live CMS content with no code change.

**Set `NEXT_PUBLIC_SITE_URL` once the domain is known.** The sitemap, OG images
and canonical URLs all derive from it; without it they fall back to the Vercel
preview domain.

### Known advisories

`npm audit` reports three high-severity issues in `adm-zip`, `js-yaml` and
`smol-toml`. All three are transitive dependencies of the **Sanity CLI** — they
never reach the browser or the server runtime. npm's suggested fix is `sanity`
5.14.1, which is a *downgrade* from the 6.16.0 this project uses (the current
latest), so taking it would cost a major CMS version to silence DoS advisories
in build tooling. Left as-is pending an upstream update.

## Environment variables

See `.env.example` — every variable is documented there with where to get it.
The same set must be added to the Vercel project settings.

`SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are server-only. Never
give them a `NEXT_PUBLIC_` prefix; that would publish them in the browser bundle.

## Project structure

```
src/app/            Routes. /studio is the embedded Sanity Studio.
src/components/     UI — ui/ primitives, motion/ animation, sections/ page blocks
src/sanity/         Schemas, GROQ queries, client, image helper
src/lib/            Env access and shared utilities
```
