type NavItem = {
  label: string;
  href: string;
};

/**
 * A category in the (nestable) category tree. `parent` references another
 * category `id`; omit it for a top-level category. Articles reference a leaf
 * category by `id`; the URL path is the chain of ancestor ids.
 */
type CategoryNode = {
  id: string;
  label: string;
  parent?: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://example.com',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'ko',
    locale: 'ko_KR',
    dateLocale: 'ko-KR',
    title: 'Tone',
    logoLabel: 'Tone',
    description: 'A minimal Astro theme for posts and notes.',
    author: 'Alex Morgan',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Articles', href: '/articles' }, { label: 'About', href: '/about' }]
  nav: [] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Articles', href: '/articles' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    /**
     * Nestable category tree. Order here is the display order among siblings.
     * Articles reference a leaf category by `id`; ancestors form the URL path
     * and breadcrumb (e.g. reference → markdown ⇒ /categories/reference/markdown).
     */
    categories: [
      { id: 'guides', label: 'Guides' },
      { id: 'getting-started', label: 'Getting Started', parent: 'guides' },
      { id: 'design', label: 'Design' },
      { id: 'reference', label: 'Reference' },
      { id: 'markdown', label: 'Markdown', parent: 'reference' },
      { id: 'mdx', label: 'MDX', parent: 'reference' },
    ] as CategoryNode[],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: 'https://hanityx.github.io/astro-tone/', // e.g. 'https://your-site.com'
    email: '', // e.g. 'hello@your-site.com'
    linkedin: '', // e.g. 'https://www.linkedin.com/in/yourhandle'
    github: 'https://github.com/hanityx/astro-tone', // e.g. 'https://github.com/yourhandle'
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'Alex Morgan',
    role: 'Writes about useful small tools and the notes behind them.',
    location: 'Anywhere',
    focus: 'Writing, small tools, and notes worth returning to.',
    lead: 'Alex writes about small product decisions, interface craft, and the notes that make work easier to return to.',
    headline: ['Made to', 'last.'],
    statementLabel: 'Work',
    statementTitle: 'Notes on making useful things.',
    statement:
      'This page is intentionally spare: a short bio, a few links, and enough context for readers who want to know who is writing.',
    careerLabel: 'Career',
    career: [
      {
        period: 'Current',
        title: 'Independent practice',
        description:
          'Designing calm interfaces, writing field notes, and helping teams clarify product surfaces.',
      },
      {
        period: 'Selected',
        title: 'Product systems',
        description:
          'Worked across design systems, editorial tooling, and early-stage product foundations.',
      },
      {
        period: 'Elsewhere',
        title: 'Writing and reference',
        description:
          'Keeping a public archive of notes, examples, and references worth returning to.',
      },
    ],
    interests: [
      'Interface systems that stay quiet until needed',
      'Writing as a way to keep product judgment visible',
      'Tools and habits that make long work easier to resume',
    ],
    interestsLabel: 'Interests',
    interestsHeading: 'What the work keeps returning to',
  },
};

export default config;
