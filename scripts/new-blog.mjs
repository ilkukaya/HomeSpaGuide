#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'src/content/blog');
if (!existsSync(target)) mkdirSync(target, { recursive: true });

const rl = readline.createInterface({ input: stdin, output: stdout });
const ask = (q, fallback = '') => rl.question(`${q}${fallback ? ` [${fallback}]` : ''}: `).then((v) => v || fallback);
const slugify = (s) => s.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const today = new Date().toISOString().slice(0, 10);

const title = await ask('Post title');
const slug = await ask('Slug', slugify(title));
const excerpt = await ask('Excerpt');
const category = await ask('Category', 'how-to');
const imageAlt = await ask('Hero image alt', title);

const out = `---
slug: ${slug}
title: ${title}
excerpt: ${JSON.stringify(excerpt)}
author: HomeSpaGuide Editors
publishedAt: ${today}
category: ${category}
tags: []
heroImage: ../../assets/placeholder-hero.svg
heroImageAlt: ${JSON.stringify(imageAlt)}
toc: true
---

Write the post here.
`;

const path = join(target, `${slug}.md`);
if (existsSync(path)) { console.error(`File already exists: ${path}`); rl.close(); process.exit(1); }
writeFileSync(path, out);
console.log(`✓ Created ${path}`);
rl.close();
