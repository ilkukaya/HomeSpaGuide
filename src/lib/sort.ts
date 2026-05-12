import type { CollectionEntry } from 'astro:content';
import { PRICE_RANGES } from './prices';

export type SortKey =
  | 'featured'
  | 'score-desc'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'score-desc', label: "Editor's Score (high → low)" },
  { value: 'price-asc', label: 'Price (low → high)' },
  { value: 'price-desc', label: 'Price (high → low)' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'A → Z' },
];

export function sortProducts(
  products: CollectionEntry<'products'>[],
  key: SortKey,
): CollectionEntry<'products'>[] {
  const copy = [...products];
  switch (key) {
    case 'score-desc':
      return copy.sort((a, b) => b.data.editorScore.overall - a.data.editorScore.overall);
    case 'price-asc':
      return copy.sort((a, b) => PRICE_RANGES[a.data.priceRange].min - PRICE_RANGES[b.data.priceRange].min);
    case 'price-desc':
      return copy.sort((a, b) => PRICE_RANGES[b.data.priceRange].max - PRICE_RANGES[a.data.priceRange].max);
    case 'newest':
      return copy.sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
    case 'name-asc':
      return copy.sort((a, b) => a.data.shortTitle.localeCompare(b.data.shortTitle));
    case 'featured':
    default:
      return copy.sort((a, b) => {
        const ap = a.data.editorPick ? 1 : 0;
        const bp = b.data.editorPick ? 1 : 0;
        if (ap !== bp) return bp - ap;
        return b.data.editorScore.overall - a.data.editorScore.overall;
      });
  }
}
