# Home page — Test Yourself feature

- [x] Verify real Test Yourself features and landing-page conventions.
- [x] Add animated section directly below hero.
- [x] Link section CTA to `test-yourself`.
- [x] Verify responsive layout, reduced-motion behavior, and semantic tokens.
- [x] Commit `assets/readme/hero.png` and `assets/readme/normal-distribution.png` (2480x840 PNG siblings; SVG remains canonical).
- [ ] Wire PNG rasterization into `web/scripts/build-og-image.mjs` so future deploys regenerate them alongside `og-image.png` (currently the PNGs are hand-rasterized, not on the deploy path).
- [ ] Run `lint:tsc`, `lint:colors`, and `build` to confirm the closeout didn't regress anything.
- [ ] Review final diff and visual result.
