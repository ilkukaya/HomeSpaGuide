/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly AMAZON_ASSOCIATE_TAG: string;
  // Analytics (all optional — nothing loads unless set)
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_PLAUSIBLE_SCRIPT?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_CLOUDFLARE_BEACON_TOKEN?: string;
  // Search-engine ownership verification
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly PUBLIC_BING_SITE_VERIFICATION?: string;
  readonly PUBLIC_PINTEREST_VERIFICATION?: string;
  // Display ads (Google AdSense). Leave empty until the site is approved.
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_SLOT_INARTICLE?: string;
  readonly PUBLIC_ADSENSE_SLOT_SIDEBAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
