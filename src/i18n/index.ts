import config from '../../astro-theme-config';
import { en } from './en';
import { ko } from './ko';
import type { UiText } from './types';

/** Registered locales. Add a new locale file and register it here. */
const locales: Record<string, UiText> = { en, ko };

/** Active UI strings, chosen by `config.site.lang` (falls back to English). */
export function getUiText(): UiText {
  return locales[config.site.lang] ?? en;
}

export type { UiText };
