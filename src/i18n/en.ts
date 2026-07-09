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

  terms: {
    category: 'Category',
    tag: 'Tag',
    project: 'Project',
    author: 'Author',
    breadcrumb: 'Breadcrumb',
    categoryTitle: (name) => name,
    categoryDescription: (name) => `Articles in ${name}`,
    tagTitle: (name) => `#${name}`,
    tagDescription: (name) => `Articles tagged ${name}`,
    articleCount: (n) => `${n} article${n === 1 ? '' : 's'}`,
    categoriesIndexTitle: 'All categories',
    categoriesIndexDescription: 'Every category at a glance.',
    tagsIndexTitle: 'All tags',
    tagsIndexDescription: 'Every tag at a glance.',
    projectsIndexTitle: 'All projects',
    projectsIndexDescription: 'Every project, current and past.',
    authorsIndexTitle: 'All authors',
    authorsIndexDescription: 'Everyone who has written here.',
  },

  series: {
    label: 'Series',
    prev: '← Previous',
    next: 'Next →',
  },

  articleType: {
    news: 'News',
    COD: 'On-demand',
    notice: 'Notice',
    research: 'Research',
  },

  comments: 'Comments',
  commentsNoscript: 'Please enable JavaScript to view comments.',
  commentsPoweredBy: (providerLinkHtml) => `Comments powered by ${providerLinkHtml}.`,

  toc: 'Contents',

  notFound: {
    metaTitle: 'Page not found',
    metaDescription: 'The page you requested does not exist.',
    title: 'Page not found',
    description: 'The URL may be wrong, or the page may have been removed.',
    home: 'Home',
    allPosts: 'All posts',
    recent: 'Recent posts',
  },

  callout: {
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
  },
};
