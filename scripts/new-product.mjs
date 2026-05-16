#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'src/content/products');
if (!existsSync(target)) mkdirSync(target, { recursive: true });

const rl = readline.createInterface({ input: stdin, output: stdout });
const ask = (q, fallback = '') =>
  rl.question(`${q}${fallback ? ` [${fallback}]` : ''}: `).then((v) => v || fallback);

function slugify(s) {
  return s.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const today = new Date().toISOString().slice(0, 10);

const asin = (await ask('ASIN (10 char)')).trim().toUpperCase();
if (!/^[A-Z0-9]{10}$/.test(asin)) { console.error('Invalid ASIN. Aborting.'); rl.close(); process.exit(1); }
const title = await ask('Product title');
const slug = await ask('Slug', slugify(title));
const shortTitle = await ask('Short title (≤60)', title.slice(0, 60));
const brand = await ask('Brand slug');
const category = await ask('Category slug');
const shortDescription = await ask('Short description (≤220)');
const priceRange = await ask('Price range', '500-1000');
const editorOverall = await ask("Editor's Score (overall, 0-10)", '8.0');
const imageAlt = await ask('Image alt text', shortTitle);

const out = `---
asin: ${asin}
slug: ${slug}
title: ${title}
shortTitle: ${shortTitle}
brand: ${brand}
category: ${category}
subcategories: []
shortDescription: ${JSON.stringify(shortDescription)}
description: |
  ${title} — replace this with a curator-framed description.
  Write as an editor who researched the category, not as a tester.
  Cite manufacturer specs ("Manufacturer's published spec…") and
  aggregated owner feedback ("Owner reviews on Amazon consistently
  report…"). Never claim first-person measurements. See
  EDITORIAL_VOICE.md before writing.
keyFeatures:
  - Replace with a manufacturer-stated feature
pros: []   # 3–5 things owners praise most consistently
cons: []   # 2–3 things owners complain about most consistently
bestFor: []
specs:
  setupType: inflatable
  indoorOutdoor: both
priceRange: ${priceRange}
priceUpdatedAt: ${today}
editorScore:
  overall: ${editorOverall}
  quality: 8
  value: 8
  setup: 8
  durability: 8
editorPick: false
editorBadges: []
primaryImage: ../../assets/placeholder-product.svg
imageAlt: ${JSON.stringify(imageAlt)}
amazonUrl: https://www.amazon.com/dp/${asin}
status: active
publishedAt: ${today}
updatedAt: ${today}
---

Open with a 1-sentence positioning statement: who this is for and why we
selected it for that buyer profile. Follow with a paragraph summarizing
the manufacturer's headline specs, then a paragraph distilling what owner
reviews on Amazon and r/hottubs consistently say (both praise and
complaints). Close with a curator's take: who should buy this vs. who
should look at an alternative in the related-products list.

DO NOT write "we tested", "we measured", "we ran it for X days", or any
first-person measurement claim. See EDITORIAL_VOICE.md.
`;

const path = join(target, `${slug}.md`);
if (existsSync(path)) { console.error(`File already exists: ${path}`); rl.close(); process.exit(1); }
writeFileSync(path, out);
console.log(`✓ Created ${path}`);
rl.close();
