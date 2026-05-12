/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly AMAZON_ASSOCIATE_TAG: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_PLAUSIBLE_SCRIPT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
