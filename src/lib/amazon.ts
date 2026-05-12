const AFFILIATE_TAG =
  (import.meta.env.AMAZON_ASSOCIATE_TAG as string | undefined) || 'homespaguide-20';

export interface AmazonLinkOptions {
  /** Campaign / placement label for ascsubtag tracking (e.g. "pdp", "homepage-hero"). */
  campaign?: string;
}

/**
 * Build a compliant Amazon Associates link.
 * Always direct, never cloaked. Tag injected at runtime so we can rotate it.
 */
export function buildAmazonUrl(asin: string, options: AmazonLinkOptions = {}): string {
  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    throw new Error(`Invalid ASIN: "${asin}"`);
  }
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set('tag', AFFILIATE_TAG);
  if (options.campaign) {
    url.searchParams.set('ascsubtag', options.campaign);
  }
  return url.toString();
}

/**
 * Build a search-link fallback when no ASIN is available (used very rarely).
 */
export function buildAmazonSearchUrl(query: string): string {
  const url = new URL('https://www.amazon.com/s');
  url.searchParams.set('k', query);
  url.searchParams.set('tag', AFFILIATE_TAG);
  return url.toString();
}

export interface LivePriceData {
  price: number;
  rating: number;
  reviewCount: number;
  updatedAt: Date;
}

/**
 * Stub for future PA-API integration. Returns null until access is granted
 * (Amazon requires 3 qualifying sales within 180 days). Once enabled, swap the
 * implementation to hit PA-API; the call sites won't change.
 */
export async function getLivePriceAndRating(_asin: string): Promise<LivePriceData | null> {
  return null;
}

export function amazonRel(): string {
  return 'sponsored nofollow noopener';
}
