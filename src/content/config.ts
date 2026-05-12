import { defineCollection, reference, z } from 'astro:content';

const seoSchema = z
  .object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
  })
  .optional();

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const editorBadge = z.enum([
  'Best Seller',
  'Editor Pick',
  'Best Value',
  'New',
  'Top Rated',
  'Budget Pick',
  'Premium Pick',
]);

export const priceRangeEnum = z.enum([
  'under-100',
  '100-250',
  '250-500',
  '500-1000',
  '1000-2500',
  '2500-5000',
  '5000+',
]);
export type PriceRange = z.infer<typeof priceRangeEnum>;

const products = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      // Identity
      asin: z
        .string()
        .regex(/^[A-Z0-9]{10}$/, 'ASIN must be a 10-character uppercase alphanumeric string'),
      title: z.string(),
      shortTitle: z.string().max(60),
      brand: reference('brands'),

      // Categorization
      category: reference('categories'),
      subcategories: z.array(z.string()).default([]),
      collections: z.array(z.string()).optional(),

      // Content
      shortDescription: z.string().max(220),
      description: z.string(),
      keyFeatures: z.array(z.string()).min(1),
      pros: z.array(z.string()).default([]),
      cons: z.array(z.string()).default([]),
      bestFor: z.array(z.string()).default([]),

      // Specs
      specs: z.object({
        capacity: z.number().optional(),
        dimensions: z.string().optional(),
        weight: z.string().optional(),
        powerRequirement: z.string().optional(),
        waterCapacity: z.string().optional(),
        jetCount: z.number().optional(),
        heaterWattage: z.number().optional(),
        setupType: z
          .enum(['inflatable', 'hard-shell', 'plug-and-play', 'wired'])
          .optional(),
        indoorOutdoor: z.enum(['indoor', 'outdoor', 'both']).optional(),
        seasonality: z.enum(['summer', 'all-season', 'winter-rated']).optional(),
        materials: z.array(z.string()).optional(),
        warranty: z.string().optional(),
        customFields: z
          .array(z.object({ label: z.string(), value: z.string() }))
          .optional(),
      }),

      // Pricing
      priceRange: priceRangeEnum,
      priceUpdatedAt: z.coerce.date(),

      // Editor's score
      editorScore: z.object({
        overall: z.number().min(0).max(10),
        quality: z.number().min(0).max(10),
        value: z.number().min(0).max(10),
        setup: z.number().min(0).max(10),
        durability: z.number().min(0).max(10),
        energyEfficiency: z.number().min(0).max(10).optional(),
        notes: z.string().optional(),
      }),
      editorPick: z.boolean().default(false),
      editorBadges: z.array(editorBadge).default([]),

      // Media
      primaryImage: image(),
      gallery: z.array(image()).optional(),
      imageAlt: z.string(),

      // Affiliate
      amazonUrl: z.string().url(),

      // Relations
      relatedProducts: z.array(reference('products')).optional(),
      frequentlyBoughtWith: z.array(reference('products')).optional(),
      alternativeProducts: z.array(reference('products')).optional(),

      // SEO
      seo: seoSchema,

      // Status
      status: z.enum(['active', 'archived', 'out-of-stock']).default('active'),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
});

const categories = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      parent: reference('categories').optional(),
      description: z.string(),
      shortDescription: z.string(),
      heroImage: image().optional(),
      icon: z.string().optional(),
      order: z.number().default(0),
      featuredProducts: z.array(reference('products')).optional(),
      buyingGuideRef: reference('guides').optional(),
      seo: seoSchema,
      faqs: z.array(faqItem).optional(),
    }),
});

const brands = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image().optional(),
      description: z.string(),
      founded: z.number().optional(),
      country: z.string().optional(),
      website: z.string().url().optional(),
      seo: seoSchema,
    }),
});

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      author: z.string().default('HomeSpaGuide Editors'),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      category: z.enum([
        'buying-guide',
        'reviews',
        'comparison',
        'how-to',
        'maintenance',
        'news',
        'seasonal',
      ]),
      tags: z.array(z.string()).default([]),
      heroImage: image(),
      heroImageAlt: z.string().default(''),
      featuredProducts: z.array(reference('products')).optional(),
      toc: z.boolean().default(true),
      seo: seoSchema,
    }),
});

const guides = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      intro: z.string(),
      topic: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      recommendedProducts: z.array(reference('products')).default([]),
      sections: z
        .array(z.object({ heading: z.string(), body: z.string() }))
        .default([]),
      faqs: z.array(faqItem).default([]),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      seo: seoSchema,
    }),
});

const collectionsList = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      intent: z.enum(['budget', 'use-case', 'seasonal', 'occasion', 'brand-spotlight']),
      productSlugs: z.array(z.string()).min(1),
      heroImage: image().optional(),
      updatedAt: z.coerce.date(),
      seo: seoSchema,
    }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
    seo: seoSchema,
  }),
});

export const collections = {
  products,
  categories,
  brands,
  blog,
  guides,
  collections: collectionsList,
  pages,
};
