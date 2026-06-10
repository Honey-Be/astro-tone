import type { UiText } from './types';

export const en: UiText = {
  skipToContent: 'Skip to content',
  primaryNav: 'Primary navigation',
  footerNav: 'Footer navigation',
  themeToggle: 'Toggle dark mode',
  themeToLight: 'Switch to light mode',
  themeToDark: 'Switch to dark mode',

  heroTitle: 'Keep notes.',
  heroTitleLine2: '',
  heroSelectedPosts: 'Selected posts',
  viewAll: 'All Posts →',
  readLink: 'Read →',

  postsEyebrow: 'Archive',
  postsTitle: 'All Posts',
  backLink: '← All Posts',
  relatedPosts: 'Related',
  allPosts: 'All Posts →',
  updated: 'Updated',
  readingTime: (minutes) => `${minutes} min read`,

  postFeed: {
    all: 'All',
    filterLabel: 'Filter posts by category',
    previousCategories: 'Scroll categories left',
    nextCategories: 'Scroll categories right',
    searchLabel: 'Search posts',
    empty: 'No posts match this filter.',
    more: 'Load more',
    read: 'Read',
  },

  search: {
    title: 'Search',
    loading: 'Loading search...',
    noscriptText: 'Search needs JavaScript.',
    archiveLinkLabel: 'Browse the posts archive',
    placeholder: 'Search posts',
    inputLabel: 'Search posts',
    close: 'Close search',
    empty: 'No matching posts.',
    defaultCategory: 'Post',
  },

  comments: 'Comments',

  notFound: {
    metaTitle: 'Page not found',
    metaDescription: 'The page you requested does not exist.',
    title: 'Page not found',
    description: 'The URL may be wrong, or the page may have been removed.',
    home: 'Home',
    allPosts: 'All posts',
  },

  callout: {
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
  },
};
