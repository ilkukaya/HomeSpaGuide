#!/usr/bin/env node
/**
 * Editorial voice linter for HomeSpaGuide.
 *
 * Scans src/content/**\/*.md for banned first-person testing/measurement
 * claims that would violate FTC 16 CFR Part 255 and our editorial voice
 * rules. See EDITORIAL_VOICE.md.
 *
 * Exits non-zero if any banned phrase is found; prints file path, line and
 * column for each match, plus a suggested replacement framing.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'src/content');

const RULES = [
  { pattern: /we tested/i,           replacement: '"we selected" / "we compared" / "owner reviews consistently report"' },
  { pattern: /in our testing/i,      replacement: '"based on the spec sheets" / "owner reviews on Amazon consistently report"' },
  { pattern: /our tests show/i,      replacement: '"manufacturer\'s published spec" / "owner reports broadly support this"' },
  { pattern: /we measured/i,         replacement: '"manufacturer\'s published spec is X" / "owner reviews describe X"' },
  { pattern: /we ran it for/i,       replacement: '"customer reports across multiple seasons describe"' },
  { pattern: /our lab/i,             replacement: 'we have no lab — reframe as curator: "based on category-wide comparison"' },
  { pattern: /lab-tested by us/i,    replacement: '"manufacturer-tested to [standard]" / "owner reports broadly support the claim"' },
  { pattern: /in our long-term/i,    replacement: '"in long-term owner reviews" / "across multiple Reddit threads in r/hottubs"' },
  { pattern: /we held a meter/i,     replacement: 'remove — we have no measurement equipment' },
  { pattern: /expert technicians/i,  replacement: '"editorial team" — we have no technicians' },
  { pattern: /we recorded/i,         replacement: '"manufacturer\'s published figure" / "owner reports describe"' },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.md')) out.push(full);
  }
  return out;
}

function scanFile(absPath) {
  const src = readFileSync(absPath, 'utf8');
  const lines = src.split('\n');
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { pattern, replacement } of RULES) {
      const m = line.match(pattern);
      if (m) {
        hits.push({
          line: i + 1,
          column: (m.index ?? 0) + 1,
          match: m[0],
          replacement,
          snippet: line.trim(),
        });
      }
    }
  }
  return hits;
}

const files = walk(contentDir);
let total = 0;
const failures = [];

for (const f of files) {
  const hits = scanFile(f);
  if (hits.length) {
    failures.push({ file: f, hits });
    total += hits.length;
  }
}

if (total === 0) {
  console.log(`✓ Editorial voice OK — scanned ${files.length} file(s), zero banned phrases.`);
  process.exit(0);
}

console.error(`✗ Editorial voice linter found ${total} banned phrase(s) in ${failures.length} file(s).\n`);
console.error('See EDITORIAL_VOICE.md for the full ruleset.\n');

for (const { file, hits } of failures) {
  const rel = relative(root, file);
  for (const h of hits) {
    console.error(`${rel}:${h.line}:${h.column}  banned phrase "${h.match}"`);
    console.error(`    ${h.snippet}`);
    console.error(`    → suggested: ${h.replacement}\n`);
  }
}

process.exit(1);
