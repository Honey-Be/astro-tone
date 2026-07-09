import { mountReadingRailForPosts } from './reading-rail';

// rem, not px — matchMedia's rem resolves against the browser's default font
// size, so this stays in lockstep with `.inline-toc`'s `(min-width: 76.25rem)`
// in styles/layouts/post.css even for users who've changed that default.
const railQuery = '(min-width: 76.25rem)';
let mounted = false;
let listening = false;
const railMediaQuery = window.matchMedia(railQuery);

function mountReadingRailWhenWide() {
  if (mounted || !railMediaQuery.matches) return;
  mounted = true;
  mountReadingRailForPosts();
}

export function mountReadingRailLoader() {
  mountReadingRailWhenWide();

  if (listening) return;
  listening = true;
  railMediaQuery.addEventListener('change', (event) => {
    if (event.matches) mountReadingRailWhenWide();
  });
}
