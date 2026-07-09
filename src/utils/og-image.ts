import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Build-time OG image generation (satori → SVG → resvg → PNG). Runs only in
 * `astro build` / the `og/[id].png` static endpoint — never shipped to the browser.
 *
 * Font note: satori supports TTF/OTF/WOFF but not WOFF2 or variable fonts
 * (https://github.com/vercel/satori#fonts), so this uses static Pretendard
 * Bold/Medium WOFF weights (OFL-1.1, see src/assets/og-fonts/README.md)
 * instead of the variable woff2 the site itself serves to browsers.
 */

// `process.cwd()`-relative rather than `import.meta.url`-relative: Vite bundles this
// module during build, which moves it to a chunk far from `src/`, breaking any path
// resolved against the module's own (post-bundle) location. The build always runs
// from the project root, so this stays correct.
const fontDir = path.join(process.cwd(), 'src/assets/og-fonts');
const pretendardBold = readFileSync(path.join(fontDir, 'Pretendard-Bold.woff'));
const pretendardMedium = readFileSync(path.join(fontDir, 'Pretendard-Medium.woff'));

const WIDTH = 1200;
const HEIGHT = 630;
const COLOR_BG = '#f7fbfd';
const COLOR_FG = '#18181b';
const COLOR_MUTED = '#5a6570';
const COLOR_ACCENT = '#197ca8';

export type OgImageInput = {
  /** Small label above the title — category, article type, or the site name. */
  kicker: string;
  title: string;
  /** Small label below the title — site name + date, author, etc. */
  meta: string;
};

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function renderOgImagePng(input: OgImageInput): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: COLOR_BG,
          fontFamily: 'Pretendard',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '14px',
                      height: '14px',
                      borderRadius: '4px',
                      backgroundColor: COLOR_ACCENT,
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: COLOR_ACCENT,
                      letterSpacing: '0.01em',
                    },
                    children: truncate(input.kicker, 40),
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '980px',
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 1.2,
                color: COLOR_FG,
                letterSpacing: '-0.02em',
              },
              children: truncate(input.title, 90),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '26px',
                fontWeight: 500,
                color: COLOR_MUTED,
              },
              children: truncate(input.meta, 80),
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Pretendard', data: pretendardBold, weight: 700, style: 'normal' },
        { name: 'Pretendard', data: pretendardMedium, weight: 500, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}
