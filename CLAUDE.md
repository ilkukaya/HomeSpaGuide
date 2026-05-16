# CLAUDE.md

This file is read by Claude Code sessions on every spin-up. Keep it short
and load-bearing.

## Content rules

HomeSpaGuide is a curated affiliate publication, not a testing lab. Never
write "we tested", "we measured", "we ran it for X days", or any
first-person measurement claim. Instead use "we selected", "manufacturer's
published spec", "owner reviews on Amazon consistently report", "based on
the spec sheets". Editor Scores are curation judgments, not test results.
See `EDITORIAL_VOICE.md` for the full ruleset before writing customer-facing
content. `npm run typecheck` runs a voice linter that will fail the build
if banned phrases land in `src/content/**/*.md`.

## Quick reference

- All affiliate links route through `src/lib/amazon.ts` → `buildAmazonUrl()`.
  Never hardcode the Associates tag — read `AMAZON_ASSOCIATE_TAG`.
- Prices live in seven `priceRange` buckets defined in
  `src/content/config.ts`. Never quote a live price.
- Editor badges are scarce — fewer than 25% of products should carry
  "Editor Pick".
- Every blog post + guide + product page must carry the affiliate
  disclosure above the fold (the footer disclosure is necessary but not
  sufficient).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build + Pagefind index
- `npm run typecheck` — Astro check + content-schema validation + voice linter
- `npm run new-product` — scaffold a new product `.md` with curator-framed body
- `npm run new-blog` — scaffold a new blog post
- `npm run audit-links` — validate Amazon link format
- `npm run audit-voice` — run the editorial-voice linter on its own
