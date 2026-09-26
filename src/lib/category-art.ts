import type { ImageMetadata } from 'astro';
import hotTub from '../assets/placeholder-hot-tub.svg';
import chemical from '../assets/placeholder-chemical.svg';
import filter from '../assets/placeholder-filter.svg';
import cover from '../assets/placeholder-cover.svg';
import product from '../assets/placeholder-product.svg';
import hardShell from '../assets/placeholder-hard-shell.svg';

/** Illustration used for a category when it has no hero image of its own. */
export function categoryArt(slug: string): ImageMetadata {
  if (/plug|hard-shell/.test(slug)) return hardShell;
  if (/tub|spa/.test(slug) && !/chem|filter|cover/.test(slug)) return hotTub;
  if (/chem|water/.test(slug)) return chemical;
  if (/filter/.test(slug)) return filter;
  if (/cover|accessor|step/.test(slug)) return cover;
  return product;
}
