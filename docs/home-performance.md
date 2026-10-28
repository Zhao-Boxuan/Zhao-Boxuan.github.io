# Homepage loading changes and validation

## Changes

- Use Latin WOFF2 subsets of the existing Noto Sans SC faces. Original fonts
  remain available through complementary Unicode ranges. All 415 retained
  glyph outlines and horizontal metrics match the source at each weight.
- Preload the desktop ink texture, overlap transfer with shader setup, cache
  uniform locations, and replay pointer input received before texture upload.
- Preserve portrait input through metadata initialization, resume scrubbing
  after seek completion, and suspend offscreen drawing. The video, time mapping,
  smoothing coefficients and glitch styling are unchanged.
- Load gallery images near the viewport, prioritize the current image, and
  prepare video posters plus one approaching-video warm-up slot.
- Load project covers and generate ASCII near the viewport. Reuse glyph-width
  measurements during drawing and defer institutional logo requests.

## Generated resources

`scripts/subset-home-fonts.py` requires `fonttools[woff]`. Keep its Unicode
ranges synchronized with `app/globals.css`. Three subsets total 132,068 bytes.

Gallery posters were extracted from frame zero, proportionally resized to
720 pixels high, and encoded as WebP at quality 88. MP4 files were not changed.

## Validation — 2026-10-28

- Next.js 16.2.6 static export: compilation, TypeScript and all 16 generated
  pages passed. Final export ran outside OneDrive with identical sources and
  existing assets/dependencies after Windows directory-permission failures.
- Isolated Edge 156 against the exported files: cold cache, simulated 2 MiB/s
  throughput, 40 ms latency, and an extra 1.6-second ink-image delay in both
  comparisons. Old English startup requested three full Noto font files;
  the new startup requested only the three Latin subsets.
- Ink texture upload was approximately 20.64 seconds before and 3.28 seconds
  after in this controlled comparison. Early pointer input produced no draws
  after upload before the fix; the new build replayed that input. These are
  local observations, not public-site timing guarantees or LCP measurements.
- Portrait positions matched normalized targets 0.15 and 0.85 within 0.04.
  Gallery animation, posters and current-video playback passed; distant
  videos remained unbound.
- Chinese/English switching; digi-tao, truth-incubator and hejiang-museum entry,
  detail refresh and return-to-cover passed. Mobile and reduced-motion visits
  did not request the ink texture. No uncaught page JavaScript errors.

## Existing limitations

- Next.js segment-prefetch requests can return 404 for flattened URLs while
  export stores the segments in nested directories. The old export has the
  same layout. Tested navigation completed through the existing fallback.
  Routing and deployment configuration were not changed here.
- Focused lint reported the same 23 existing React compiler diagnostics in
  ScrubPortrait before and after, concerning GSAP contextSafe callbacks.
  TypeScript and production export passed.
- No video re-encoding, CDN migration, WebGL precision or layout changes.
