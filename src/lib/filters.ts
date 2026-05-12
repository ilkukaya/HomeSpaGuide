import type { CollectionEntry } from 'astro:content';
import type { PriceRange } from '../content/config';

export interface FilterState {
  brands: string[];
  priceRanges: PriceRange[];
  setupTypes: string[];
  indoorOutdoor: string[];
  minScore: number;
  editorPick: boolean;
  badges: string[];
}

export const EMPTY_FILTERS: FilterState = {
  brands: [],
  priceRanges: [],
  setupTypes: [],
  indoorOutdoor: [],
  minScore: 0,
  editorPick: false,
  badges: [],
};

export function applyFilters(
  products: CollectionEntry<'products'>[],
  state: FilterState,
): CollectionEntry<'products'>[] {
  return products.filter((p) => {
    const d = p.data;
    if (state.brands.length && !state.brands.includes(d.brand.id)) return false;
    if (state.priceRanges.length && !state.priceRanges.includes(d.priceRange)) return false;
    if (state.setupTypes.length && (!d.specs.setupType || !state.setupTypes.includes(d.specs.setupType))) return false;
    if (state.indoorOutdoor.length && (!d.specs.indoorOutdoor || !state.indoorOutdoor.includes(d.specs.indoorOutdoor))) return false;
    if (state.minScore > 0 && d.editorScore.overall < state.minScore) return false;
    if (state.editorPick && !d.editorPick) return false;
    if (state.badges.length && !state.badges.some((b) => d.editorBadges.includes(b as any))) return false;
    return true;
  });
}

export function parseFiltersFromURL(params: URLSearchParams): FilterState {
  const split = (key: string): string[] => {
    const v = params.get(key);
    return v ? v.split(',').filter(Boolean) : [];
  };
  return {
    brands: split('brand'),
    priceRanges: split('price') as PriceRange[],
    setupTypes: split('setup'),
    indoorOutdoor: split('placement'),
    minScore: Number(params.get('score') || 0),
    editorPick: params.get('pick') === '1',
    badges: split('badge'),
  };
}
