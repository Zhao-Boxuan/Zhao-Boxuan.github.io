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

- Windows local exports store some segment files in nested directories. This
  produced local-test 404s. The Linux GitHub Pages deployment serves the flat
  segment URLs with HTTP 200; the later online audit did not reproduce those
  route-data 404s. Do not use the local artifact layout to diagnose production.
- Focused lint reported the same 23 existing React compiler diagnostics in
  ScrubPortrait before and after, concerning GSAP contextSafe callbacks.
  TypeScript and production export passed.
- No video re-encoding, CDN migration, WebGL precision or layout changes.

## Follow-up: clipped covers and navigation

The custom 600px image observer was clipped by the CAT panel ancestors. A
cover could be exposed on screen before its URL was bound. The fix adds a
bounded lookahead driven by the existing ScrollTrigger project labels, as well
as preparation on category selection and explicit preparation on index return.

Responsive WebP covers are generated at 1600px and 2400px, with the original
file retained as the largest candidate. The 1600px set totals 4.46 MiB versus
37.36 MiB for originals; all generated variants add about 13.05 MiB. A smaller
960px experiment was discarded. Display-size SSIM for retained 1600px images
was 0.983–0.997, supplemented by visual comparisons. Video files are unchanged.

Navigation now starts after the white overlay reaches opacity one (0.25s),
overlapping the existing two-second minimum visual sequence. Readiness waits
for actual destination media and restored position rather than every font.
Navigation cancellation clears stale return state. A native-link query fallback
preserves the return target when clicking before hydration, then removes the
temporary query after restoration. Fresh-document pin spacing is recalculated
before revealing the restored cover.

Viewport-wide Link prefetch is replaced by a short pointer-intent/focus prefetch.
Detail video sources and posters are prepared only near the viewport. Gallery
cards are revealed independently of the first image; current visible resources
receive normal/high priority, and unchanged video metadata no longer restarts
the animation layout.

### Follow-up validation

- Production static export: all 16 routes pass. Changed-file ESLint has zero
  errors (two existing unoptimized-image advisories); TypeScript passes.
- Edge 156 against the export at 1440×900, simulated 1 MiB/s and 40ms latency:
  navigation requests started about 245–273ms after click. Three tested detail
  entries completed in about 2.0–2.13s. These are controlled local observations,
  not public-network timing guarantees.
- Three detail entries, detail reloads, native/client index returns, clean
  browser back/forward and cancellation during a delayed navigation pass.
  Target images were decoded and in view before reveal.
- Delaying the target cover by five seconds kept the reveal pending until its
  actual decode. Delaying unrelated fonts by eight seconds did not gate reveal.
- Gallery cards appeared while their deliberately delayed primary image was
  still pending; hover did not stop automatic scrolling. Four CAT preparation
  windows and mobile preparation passed. No uncaught JavaScript errors.
- Local Windows test serving maps nested segment files to the flat URLs used
  by the Linux deployment; this is test infrastructure, not a deployed rewrite.
