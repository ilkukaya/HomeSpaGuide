#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsDir = join(root, 'src/content/products');

let errors = 0;
let warnings = 0;
let checked = 0;

for (const file of readdirSync(productsDir)) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const path = join(productsDir, file);
  const content = readFileSync(path, 'utf8');
  checked++;

  const asinMatch = content.match(/^asin:\s*(.+)$/m);
  const urlMatch = content.match(/^amazonUrl:\s*(.+)$/m);
  const slugMatch = content.match(/^slug:\s*(.+)$/m);
  const display = slugMatch ? slugMatch[1].trim() : file;

  if (!asinMatch) {
    console.error(`✗ ${display}: missing asin`);
    errors++;
    continue;
  }
  const asin = asinMatch[1].trim();
  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    console.error(`✗ ${display}: invalid ASIN format "${asin}"`);
    errors++;
  }

  if (!urlMatch) {
    console.warn(`⚠ ${display}: missing amazonUrl`);
    warnings++;
  } else {
    const url = urlMatch[1].trim();
    if (!url.startsWith('https://www.amazon.com/')) {
      console.error(`✗ ${display}: amazonUrl is not amazon.com (${url})`);
      errors++;
    }
    if (url.includes('tag=')) {
      console.warn(`⚠ ${display}: amazonUrl contains hardcoded tag — strip it; tag is injected at runtime`);
      warnings++;
    }
    if (!url.includes(asin) && asin.length === 10) {
      console.warn(`⚠ ${display}: amazonUrl does not contain its ASIN (${asin})`);
      warnings++;
    }
  }
}

console.log(`\n${checked} products checked, ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors > 0 ? 1 : 0);
