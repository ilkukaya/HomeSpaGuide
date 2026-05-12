import type { PriceRange } from '../content/config';

interface PriceRangeMeta {
  label: string;
  short: string;
  min: number;
  max: number;
  bucket: number;
}

export const PRICE_RANGES: Record<PriceRange, PriceRangeMeta> = {
  'under-100': { label: 'Under $100', short: '$', min: 0, max: 100, bucket: 1 },
  '100-250': { label: '$100 – $250', short: '$', min: 100, max: 250, bucket: 1 },
  '250-500': { label: '$250 – $500', short: '$$', min: 250, max: 500, bucket: 2 },
  '500-1000': { label: '$500 – $1,000', short: '$$', min: 500, max: 1000, bucket: 2 },
  '1000-2500': { label: '$1,000 – $2,500', short: '$$$', min: 1000, max: 2500, bucket: 3 },
  '2500-5000': { label: '$2,500 – $5,000', short: '$$$$', min: 2500, max: 5000, bucket: 4 },
  '5000+': { label: '$5,000+', short: '$$$$', min: 5000, max: 99999, bucket: 4 },
};

export function priceRangeLabel(range: PriceRange): string {
  return PRICE_RANGES[range].label;
}

export function priceRangeShort(range: PriceRange): string {
  return PRICE_RANGES[range].short;
}

export function priceRangeBucket(range: PriceRange): number {
  return PRICE_RANGES[range].bucket;
}

export function sumPriceRanges(ranges: PriceRange[]): { min: number; max: number } {
  return ranges.reduce(
    (acc, r) => ({ min: acc.min + PRICE_RANGES[r].min, max: acc.max + PRICE_RANGES[r].max }),
    { min: 0, max: 0 },
  );
}

export function formatRange({ min, max }: { min: number; max: number }): string {
  if (min === 0 && max === 0) return '—';
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}
