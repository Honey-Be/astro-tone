import type { UiText } from './types';

export const ko: UiText = {
  skipToContent: '본문으로 건너뛰기',
  primaryNav: '주 메뉴',
  footerNav: '하단 메뉴',
  themeToggle: '다크 모드 전환',
  themeToLight: '라이트 모드로 전환',
  themeToDark: '다크 모드로 전환',

  heroTitle: '기록을 남기다.',
  heroTitleLine2: '',
  heroSelectedPosts: '선별한 글',
  viewAll: '전체 글 →',
  readLink: '읽기 →',

  postsEyebrow: '아카이브',
  postsTitle: '전체 글',
  backLink: '← 전체 글',
  relatedPosts: '관련 글',
  allPosts: '전체 글 →',
  updated: '수정',
  readingTime: (minutes) => `${minutes}분 읽기`,

  postFeed: {
    all: '전체',
    filterLabel: '카테고리로 글 필터',
    previousCategories: '카테고리 왼쪽으로 스크롤',
    nextCategories: '카테고리 오른쪽으로 스크롤',
    searchLabel: '글 검색',
    empty: '이 필터에 해당하는 글이 없습니다.',
    more: '더 보기',
    read: '읽기',
  },

  search: {
    title: '검색',
    loading: '검색을 불러오는 중...',
    noscriptText: '검색에는 자바스크립트가 필요합니다.',
    archiveLinkLabel: '글 아카이브 둘러보기',
    placeholder: '글 검색',
    inputLabel: '글 검색',
    close: '검색 닫기',
    empty: '일치하는 글이 없습니다.',
    defaultCategory: '글',
  },

  terms: {
    category: '분류',
    tag: '태그',
    project: '프로젝트',
    author: '저자',
    breadcrumb: '탐색 경로',
    categoryTitle: (name) => name,
    categoryDescription: (name) => `${name} 분류의 글`,
    tagTitle: (name) => `#${name}`,
    tagDescription: (name) => `${name} 태그가 달린 글`,
    articleCount: (n) => `${n}개 글`,
    categoriesIndexTitle: '전체 분류',
    categoriesIndexDescription: '모든 분류를 한눈에 둘러봅니다.',
    tagsIndexTitle: '전체 태그',
    tagsIndexDescription: '모든 태그를 한눈에 둘러봅니다.',
    projectsIndexTitle: '전체 프로젝트',
    projectsIndexDescription: '진행 중이거나 마무리된 모든 프로젝트입니다.',
    authorsIndexTitle: '전체 저자',
    authorsIndexDescription: '글을 쓴 모든 저자입니다.',
  },

  series: {
    label: '시리즈',
    prev: '← 이전 글',
    next: '다음 글 →',
  },

  articleType: {
    news: '뉴스',
    COD: '주문형',
    notice: '공지',
    research: '연구',
  },

  comments: '댓글',
  commentsNoscript: '댓글을 보려면 자바스크립트를 사용하세요.',
  commentsPoweredBy: (providerLinkHtml) => `댓글은 ${providerLinkHtml}가 지원합니다.`,

  toc: '목차',

  notFound: {
    metaTitle: '페이지를 찾을 수 없음',
    metaDescription: '요청하신 페이지가 존재하지 않습니다.',
    title: '페이지를 찾을 수 없습니다',
    description: '주소가 잘못되었거나 페이지가 삭제되었을 수 있습니다.',
    home: '홈',
    allPosts: '전체 글',
    recent: '최근 글',
  },

  callout: {
    note: '노트',
    tip: '팁',
    warning: '주의',
  },
};
