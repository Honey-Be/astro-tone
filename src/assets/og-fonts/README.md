Static Pretendard weights used only for build-time OG image generation
(`src/utils/og-image.ts`, via satori — which does not support WOFF2 or
variable fonts, unlike the `pretendard-variable.woff2` the site serves to
browsers in `src/assets/fonts/`). Never shipped to the client.

- Source: https://github.com/orioncactus/pretendard (npm `pretendard@1.3.9`,
  `dist/web/static/woff/Pretendard-{Bold,Medium}.woff`)
- License: OFL-1.1 (SIL Open Font License) — see
  https://github.com/orioncactus/pretendard/blob/main/LICENSE
