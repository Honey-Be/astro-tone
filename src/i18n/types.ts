/**
 * UiText — the full set of user-facing UI strings for the theme chrome.
 *
 * Every locale file (en.ts, ko.ts, …) must implement this exact shape, so a
 * missing or renamed key is a type error rather than a silent English fallback.
 */
export type UiText = {
  // Navigation / chrome
  skipToContent: string;
  primaryNav: string;
  footerNav: string;
  themeToggle: string;
  themeToLight: string;
  themeToDark: string;

  // Home
  heroTitle: string;
  heroTitleLine2: string;
  heroSelectedPosts: string;
  viewAll: string;
  readLink: string;

  // Posts / archive
  postsEyebrow: string;
  postsTitle: string;
  backLink: string;
  relatedPosts: string;
  allPosts: string;
  updated: string;
  readingTime: (minutes: number) => string;

  // Inline post feed (filter + search)
  postFeed: {
    all: string;
    filterLabel: string;
    previousCategories: string;
    nextCategories: string;
    searchLabel: string;
    empty: string;
    more: string;
    read: string;
  };

  // Search (page + command palette)
  search: {
    title: string;
    loading: string;
    noscriptText: string;
    archiveLinkLabel: string;
    placeholder: string;
    inputLabel: string;
    close: string;
    empty: string;
    defaultCategory: string;
  };

  // Taxonomy (category / tag / project / author archive pages)
  terms: {
    category: string;
    tag: string;
    project: string;
    author: string;
    breadcrumb: string;
    categoryTitle: (name: string) => string;
    categoryDescription: (name: string) => string;
    tagTitle: (name: string) => string;
    tagDescription: (name: string) => string;
    articleCount: (n: number) => string;
    categoriesIndexTitle: string;
    categoriesIndexDescription: string;
    tagsIndexTitle: string;
    tagsIndexDescription: string;
    projectsIndexTitle: string;
    projectsIndexDescription: string;
    authorsIndexTitle: string;
    authorsIndexDescription: string;
  };

  // Series navigation (prev/next within a series)
  series: {
    label: string;
    prev: string;
    next: string;
  };

  // Article type badges (news / COD / notice / research)
  articleType: {
    news: string;
    COD: string;
    notice: string;
    research: string;
  };

  // Comments
  comments: string;

  // 404
  notFound: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    home: string;
    allPosts: string;
    recent: string;
  };

  // Prose callout labels (rendered via CSS ::before content)
  callout: {
    note: string;
    tip: string;
    warning: string;
  };
};
