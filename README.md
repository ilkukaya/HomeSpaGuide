# HomeSpaGuide

Shopify-grade Amazon affiliate storefront for the home spa / hot tub niche. Built with Astro 5, React 19 islands, Tailwind 4, and Decap CMS. Hosted on Netlify, content lives in Git.

> Tagline: _"Your trusted guide to home spas, hot tubs, and everything that makes water feel like home."_

## What this is (and isn't)

- ✅ A real editorial storefront — products, categories, buying guides, blog, search, wishlist, compare.
- ✅ Every CTA links to Amazon via the Associates program. Properly disclosed, properly tagged.
- ❌ No fake cart, no checkout, no user accounts.
- ❌ No cookies, no PII, no signup. Wishlist + compare + recently-viewed live in `localStorage` only.

## Local development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

### Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `PUBLIC_SITE_URL` | Production URL (used in canonical/og/sitemap). |
| `AMAZON_ASSOCIATE_TAG` | Your Amazon tracking ID, e.g. `homespaguide-20`. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Your Plausible domain (optional). |
| `PUBLIC_PLAUSIBLE_SCRIPT` | Plausible script URL (optional). |

## Scripts

```bash
npm run dev         # local dev server
npm run build       # production build + pagefind index
npm run preview     # preview production build
npm run typecheck   # astro check + content schemas + editorial-voice linter
npm run new-product # scaffold a product .md (curator-framed body)
npm run new-blog    # scaffold a blog post
npm run audit-links # validate Amazon link format
npm run audit-voice # editorial-voice linter on src/content/**/*.md
```

## Project structure

```
src/
├── assets/         shared images
├── components/     UI primitives, product, catalog, blog, seo
├── content/        Astro Content Collections (Zod-typed)
│   ├── products/
│   ├── categories/
│   ├── brands/
│   ├── blog/
│   ├── guides/
│   └── collections/
├── layouts/        BaseLayout, ProductLayout, BlogLayout, GuideLayout
├── lib/            amazon, prices, filters, sort, score, slugify, cn
├── pages/          routes
└── styles/         globals.css + design tokens
public/
├── admin/          Decap CMS shell + config
├── favicon.svg
└── robots.txt
```

## Deploying to Netlify

1. Push to GitHub.
2. In Netlify, "Add new site" → "Import from Git".
3. Build command: `npm run build`. Publish directory: `dist`.
4. Add the env vars from above in **Site settings → Build & deploy → Environment**.
5. Enable **Identity** in **Site settings → Identity → Enable Identity**.
6. Under Identity → **Registration**, set to "Invite only".
7. Under Identity → **Services → Git Gateway**, click **Enable Git Gateway**.
8. Invite your admin email — they'll get an invitation and can log in at `https://yourdomain.com/admin/`.

## Editing content

### Through the CMS (recommended)

Visit `/admin/` while logged in. The CMS surfaces every content collection — products, categories, brands, blog, guides, collections — with widgets matching the Zod schema. Edits commit to `main` and trigger a Netlify rebuild (1–2 min).

### Through the CLI

```bash
npm run new-product  # scaffolds src/content/products/<slug>.md with valid frontmatter
npm run new-blog     # scaffolds src/content/blog/<slug>.md
```

Edit the file in your editor of choice, commit, push.

### Through Git directly

Each piece of content is one Markdown file. Frontmatter is validated by Zod at build time — if you break a required field, `npm run build` will tell you exactly which file failed and why.

## Amazon Associates compliance — must-reads

- **Every page** carries an affiliate disclosure (footer + banner on blog/guide pages).
- **All affiliate links** route through `lib/amazon.ts → buildAmazonUrl()`. Never hardcode the tag — read it from `AMAZON_ASSOCIATE_TAG`.
- **No price scraping.** We show curated `priceRange` enums instead. Update them quarterly.
- **No rating cloning.** We use the editor score system instead. Link out with "See latest reviews on Amazon."
- **No "Add to cart"** language anywhere. Only "View on Amazon", "Check Price on Amazon", "Buy on Amazon".
- **Amazon trademark.** Logo + "Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates" sits in the footer.
- **No email-based affiliate links** (newsletter, transactional). If you ever add a newsletter, link to the site, not Amazon.
- **No Google Ads bidding on "amazon" keyword** if you ever buy paid traffic.

Run `npm run audit-links` regularly to catch mistakes.

## Content guidelines

Before writing or editing any customer-facing content, read
[`EDITORIAL_VOICE.md`](./EDITORIAL_VOICE.md). It is the authoritative ruleset
for HomeSpaGuide's editorial voice and FTC / Amazon Associates compliance.

The one-paragraph summary: HomeSpaGuide is a curated affiliate publication,
**not** a testing lab. Never write "we tested", "we measured", "we ran it
for X days", or any first-person measurement claim. Use curator framings
instead — "we selected", "manufacturer's published spec", "owner reviews on
Amazon consistently report", "based on the spec sheets". Editor Scores are
curation judgments, not test results.

`npm run typecheck` runs a voice linter (`scripts/audit-voice.mjs`) that
will fail the build if banned phrases land in `src/content/**/*.md`. Run
`npm run audit-voice` on its own to scan without the rest of the type
check.

## Content style guide

- Be honest. If a product is mediocre, score it that way and say why.
- Editor's Score breakdowns must add up — readers will check.
- Price ranges are seven buckets, not exact prices.
- Editor badges are sparing — fewer than 25% of products should be "Editor Pick".
- Affiliate disclosure at top of every blog/guide is non-negotiable.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails with "Cannot find module 'astro:content'" | Run `npm run typecheck` once — it regenerates `.astro/types.d.ts`. |
| CMS shows "Failed to load entries" | Git Gateway not enabled, or branch mismatch (default branch must be `main`). |
| Search doesn't find anything | `npm run build` re-runs Pagefind. Dev mode does not index. |
| Image errors on build | Frontmatter `primaryImage` paths must be relative to the .md file (e.g. `../../assets/...`). |

## License

This repository's code is private. Editorial content is © HomeSpaGuide.
