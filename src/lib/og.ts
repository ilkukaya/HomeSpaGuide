import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Build-time Open Graph card renderer (1200×630 PNG). Used by
 * src/pages/og/[...slug].png.ts so every product, guide and article gets a
 * unique, legible social/Discover preview instead of one shared image.
 */

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));

let fonts: { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' }[] | null = null;
function loadFonts() {
  fonts ??= [
    { name: 'Newsreader', data: font('@fontsource/newsreader', 'newsreader-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-700-normal.woff'), weight: 700, style: 'normal' },
  ];
  return fonts;
}

export interface OgCard {
  eyebrow: string;
  title: string;
  meta?: string;
  score?: number;
}

const C = {
  paper: '#F8F6F1',
  ink: '#17191A',
  muted: '#57544F',
  primary: '#1B4D4B',
  terracotta: '#B5562E',
  border: '#E4DFD4',
};

// satori takes a React-element-like tree; build it without JSX.
type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

function mark(size: number): Node {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 64 64',
      children: [
        { type: 'rect', props: { width: 64, height: 64, rx: 14, fill: C.primary } },
        { type: 'ellipse', props: { cx: 32, cy: 40, rx: 20, ry: 9, fill: 'none', stroke: C.paper, 'stroke-width': 3.5 } },
        { type: 'path', props: { d: 'M25 28c-3-4 3-6 0-10', fill: 'none', stroke: '#E7A57F', 'stroke-width': 3.5, 'stroke-linecap': 'round' } },
        { type: 'path', props: { d: 'M34 28c-3-4 3-6 0-10', fill: 'none', stroke: '#E7A57F', 'stroke-width': 3.5, 'stroke-linecap': 'round' } },
      ],
    },
  };
}

export async function renderOgPng(card: OgCard): Promise<Buffer> {
  const titleSize = card.title.length > 70 ? 58 : card.title.length > 45 ? 66 : 76;
  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: C.paper,
      padding: '64px 72px',
      borderTop: `14px solid ${C.primary}`,
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
        mark(52),
        h('div', { fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: -0.5 }, 'HomeSpaGuide'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 22 }, [
        h(
          'div',
          { fontSize: 24, fontWeight: 700, color: C.terracotta, textTransform: 'uppercase', letterSpacing: 2.5 },
          card.eyebrow,
        ),
        h(
          'div',
          { fontFamily: 'Newsreader', fontSize: titleSize, fontWeight: 500, color: C.ink, lineHeight: 1.08, letterSpacing: -1 },
          card.title,
        ),
      ]),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${C.border}`,
          paddingTop: 24,
          fontSize: 24,
          color: C.muted,
        },
        [
          h('div', { display: 'flex' }, card.meta ?? 'Independent buying guides · homespaguide.com'),
          card.score != null
            ? h(
                'div',
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: C.primary,
                  color: C.paper,
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontWeight: 700,
                },
                `Editor Score ${card.score.toFixed(1)}/10`,
              )
            : h('div', { display: 'flex' }, ''),
        ],
      ),
    ],
  );

  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
