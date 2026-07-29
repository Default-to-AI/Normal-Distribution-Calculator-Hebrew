#!/usr/bin/env node
/**
 * build-og-image.mjs — Renders SVG sources to PNG using Playwright headless
 * Chromium and Google-Fonts-loaded HTML wrappers.
 *
 * Current render targets:
 *   - web/public/og-image.svg        → web/public/og-image.png        (1200×630, OG card)
 *   - web/public/favicon.svg         → web/public/apple-touch-icon.png (180×180, iOS icon)
 *   - assets/readme/hero.svg         → assets/readme/hero.png         (2400×720 @ 2x, README hero)
 *   - assets/readme/normal-distribution.svg → assets/readme/normal-distribution.png
 *                                                             (2400×640 @ 2x, README diagram)
 *
 * Why an HTML wrapper instead of opening the .svg directly?
 *   - Document loaded as an SVG has no `document.body`, so any styling that
 *     touches `<body>` throws.
 *   - The wrapper pulls in Google Fonts via `<link>`, so we screenshot the
 *     same fonts that the live page renders with — no font-substitution drift
 *     between the OG card and what the user sees on the site.
 *
 * Why a per-render `srcDir`?
 *   - The OG card and favicon live in `web/public/` (served by Vercel as-is).
 *   - The README rasters live in `assets/readme/` (project-root, served only
 *     from GitHub's markdown renderer). Each render reads from its own source
 *     directory and writes back to the same directory.
 *
 * Usage:
 *   node scripts/build-og-image.mjs           # one-shot
 *   npm run build:og                          # via package.json script
 *
 * Wired into `npm run build` so production deploys always ship a fresh card.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const ASSETS_README_DIR = resolve(__dirname, '..', '..', 'assets', 'readme');

const RENDERS = [
  {
    src: 'og-image.svg',
    out: 'og-image.png',
    srcDir: PUBLIC_DIR,
    width: 1200,
    height: 630,
    background: null,
    deviceScaleFactor: 1,
  },
  {
    src: 'favicon.svg',
    out: 'apple-touch-icon.png',
    srcDir: PUBLIC_DIR,
    width: 180,
    height: 180,
    background: '#0E0F12',
    deviceScaleFactor: 1,
  },
  {
    src: 'hero.svg',
    out: 'hero.png',
    srcDir: ASSETS_README_DIR,
    // SVG declares width=1200 height=360. Render at exactly that viewport
    // size with deviceScaleFactor=2 → 2400×720 PNG. Matching the viewport to
    // the SVG's natural pixel size prevents non-uniform scaling (which
    // distorts the Assistant font fallback's glyph metrics on Windows and
    // was causing left-edge clipping when the canvas was wider than the SVG).
    //
    // `background: '#0E1117'` matches the SVG's own first <rect fill> color
    // so the body's background fills the rounded-corner gaps of the SVG's
    // background rect (rx="24") with the same color. Without this, the
    // rounded corners show through to whatever sits underneath — transparent
    // by default with `omitBackground: true`, which then looks like the
    // image is "cropped" at the corners under a transparent overlay.
    width: 1200,
    height: 360,
    background: '#0E1117',
    deviceScaleFactor: 2,
  },
  {
    src: 'normal-distribution.svg',
    out: 'normal-distribution.png',
    srcDir: ASSETS_README_DIR,
    // SVG declares width=1200 height=320. Render at exactly that viewport
    // size with deviceScaleFactor=2 → 2400×640 PNG. Same reasoning as
    // hero.svg above. The SVG's background rect uses fill="#0E1117"
    // (same dark navy as hero), so the body background matches for the
    // same rounded-corner-fill reason.
    width: 1200,
    height: 320,
    background: '#0E1117',
    deviceScaleFactor: 2,
  },
];

// Same Google-Fonts URL shape as web/index.html so the OG card and the live
// site render with the same fonts. Includes the Hebrew Assistant weights.
const FONT_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' +
  '<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Frank+Ruhl+Libre:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Geist+Mono&display=swap" rel="stylesheet" />';

function wrapSvg(svgContent, { width, height, background }) {
  const bg = background ?? 'transparent';
  // lang="he" so Chromium matches Hebrew-capable fonts; dir="ltr" so SVG
  // text elements without an explicit `direction="rtl"` attribute stay
  // left-aligned. (Setting dir="rtl" here makes `text-anchor="start"` resolve
  // to right, which pushes English/numeric text off the left edge of the
  // canvas. Hebrew-only <text> nodes inside the SVG carry their own
  // direction="rtl" unicode-bidi="isolate" attributes, so they isolate
  // correctly under an LTR parent.)
  return `<!doctype html>
<html lang="he" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    ${FONT_LINK}
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: ${width}px;
        height: ${height}px;
        background: ${bg};
        overflow: hidden;
      }
      svg { display: block; width: 100%; height: 100%; }
    </style>
  </head>
  <body>${svgContent}</body>
</html>`;
}

async function renderOne(browser, target) {
  // Skip gracefully if the source SVG is missing. README rasters in
  // assets/readme/ are project-root content (not part of the Vercel deploy
  // bundle), so a clean checkout may legitimately not have them — failing the
  // whole build for an optional asset would be the wrong trade.
  const srcPath = join(target.srcDir, target.src);
  if (!existsSync(srcPath)) {
    console.log(`  • ${target.src}  →  (skipped, source not found at ${srcPath})`);
    return;
  }

  const page = await browser.newPage({
    viewport: { width: target.width, height: target.height },
    deviceScaleFactor: target.deviceScaleFactor ?? 1,
  });

  const svgContent = readFileSync(srcPath, 'utf8');
  const html = wrapSvg(svgContent, target);
  await page.setContent(html, { waitUntil: 'load' });

  // Wait for Google Fonts to actually arrive, capped so a flaky network
  // never blocks a build indefinitely. If fonts don't arrive in 8s we still
  // fall through to the screenshot (browser will substitute system fallback).
  await page
    .waitForFunction(
      () => typeof document.fonts !== 'undefined' && document.fonts.status === 'loaded',
      { timeout: 8000 },
    )
    .catch(() => undefined);

  const outPath = join(target.srcDir, target.out);
  await page.screenshot({
    path: outPath,
    fullPage: false,
    type: 'png',
    omitBackground: target.background === null,
  });
  await page.close();

  const scaleNote = target.deviceScaleFactor && target.deviceScaleFactor !== 1
    ? ` @${target.deviceScaleFactor}x → ${target.width * target.deviceScaleFactor}×${target.height * target.deviceScaleFactor}`
    : '';
  console.log(`  • ${target.src}  →  ${target.out}  (${target.width}×${target.height}${scaleNote})`);
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    // Don't fail the whole production build if the Chromium binary is missing
    // (e.g. on a clean Vercel build image). The OG assets are committed to the
    // repo, so deploys still ship a valid social card without regenerating it.
    console.warn(
      'build-og-image: skipped — Playwright Chromium not available.\n' +
        `  (${error instanceof Error ? error.message : String(error)})\n` +
        '  Using committed og-image.png / apple-touch-icon.png instead.',
    );
    return;
  }

  try {
    for (const target of RENDERS) {
      await renderOne(browser, target);
    }
  } finally {
    await browser.close();
  }

  console.log('build-og-image: done.');
}

main().catch((error) => {
  console.error('build-og-image: unexpected error:', error);
  process.exit(1);
});
