/**
 * ui.ts — backward-compatible re-export of the i18n layer.
 *
 * UI strings now live in `src/i18n/` (one file per locale). Existing imports
 * `import { getUiText } from '../ui'` keep working through this shim.
 */
export { getUiText } from './i18n';
export type { UiText } from './i18n';
