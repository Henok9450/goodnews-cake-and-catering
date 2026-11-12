# GoodNews Cake and Catering – Watermark Implementation Technical Report

**Project:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Scope:** Digital Watermarking for Cake Photography  
**Status:** Verification Passed & Production-Ready  
**Date:** November 2026

---

## 1. Architecture & Execution Overview

To satisfy the user requirement for an elegant, non-intrusive watermark reading **`GoodNews Cake and Catering`** across all cake photography, a two-tier digital watermarking architecture was implemented:

1. **High-Fidelity Batch Watermark Pipeline (`scripts/apply-watermarks.js`):**
   - Composites vector-rendered typography directly onto master assets and WebP derivatives using high-speed SIMD-accelerated `sharp`.
   - Generates both full-resolution WebP (`.webp`) and responsive card-optimized WebP (`-card.webp`) variants for `<OptimizedImage>` component hydration.
2. **Client-Side Future Upload Pipeline (`src/services/storageService.js`):**
   - Integrates HTML5 2D Canvas compositing into the administrative upload workflow.
   - Automatically brand-stamps newly uploaded cake catalog items before dispatching to Firebase Storage without requiring database schema modifications.

---

## 2. Non-Destructive Master Preservation

A primary security and brand stewardship constraint is that original high-resolution master photographs must never be irrevocably degraded:

- Prior to applying watermarks, all 48 master photographs were archived to:
  - `originals/cakes/` (19 items)
  - `originals/seasonal/` (29 items)
- These pristine masters remain bit-for-bit identical to original camera/studio uploads.
- By placing `originals/` in the project root (outside `public/`), the build bundle and web serving directory remain clean, fully satisfying the `< 50MB` image asset footprint constraint verified by automated performance regression suites.

---

## 3. Dynamic Contrast & Luminance Engine

To prevent the watermark from vanishing against pure white fondant or creating muddy glare on dark chocolate ganache, an automated corner luminance probe was implemented:

```javascript
// scripts/apply-watermarks.js snippet
const cornerRegion = {
  left: Math.max(0, width - 120),
  top: Math.max(0, height - 60),
  width: Math.min(120, width),
  height: Math.min(60, height)
};
const stats = await sharp(imageBuffer).extract(cornerRegion).stats();
const [r, g, b] = stats.channels.map(c => c.mean);
const cornerBrightness = 0.299 * r + 0.587 * g + 0.114 * b;
const isBright = cornerBrightness > 195;
```

### Contrast Profile Selection:
- **Profile A (Luminance $\le 195$):**
  - Text Fill: `rgba(255, 255, 255, 0.30)` (Soft Ivory White)
  - Shadow: `rgba(0, 0, 0, 0.35)` with $1\text{px}$ offset and $2.5\text{px}$ blur.
  - Selected for: 45 of 48 photos.
- **Profile B (Luminance $> 195$):**
  - Text Fill: `rgba(15, 23, 42, 0.28)` (Deep Slate)
  - Halo: `rgba(255, 255, 255, 0.40)` with $2.0\text{px}$ diffuse glow.
  - Selected for: Pure white background cakes (e.g., `cake1.png`, `cake9.png`, `Timket1.png`).

---

## 4. Preservation of Performance Optimization

The watermark implementation fully honors the existing responsive picture architecture:
- Every watermarked cake image maintains its tripartite set:
  1. Base asset (`.png` / `.jpg` / `.webp`)
  2. Full WebP asset (`.webp`)
  3. Responsive Card WebP asset (`-card.webp`)
- The `<OptimizedImage>` component automatically serves the watermarked WebP variant to modern browsers, achieving 40%–70% bandwidth savings while delivering the watermarked brand mark.

---

## 5. Scope Boundary Validation

Strict path filtering was enforced to prevent unintended watermarking of non-cake assets:
- `public/images/catering/` (27 items) -> **UNTOUCHED**
- `public/images/cookies/` (27 items) -> **UNTOUCHED**
- `public/images/cupcakes/` (27 items) -> **UNTOUCHED**
- `public/images/logo/` -> **UNTOUCHED**

---

## 6. Automated Quality Assurance & Verification

The watermark verification test suite (`src/__tests__/watermark_verification.test.js`) runs within the Jest test runner alongside existing regression suites:

```
PASS src/App.test.js
PASS src/__tests__/performance_revalidation.test.js
PASS src/__tests__/functional_regression.test.js
PASS src/__tests__/security_revalidation.test.js
PASS src/__tests__/accessibility_revalidation.test.js
PASS src/__tests__/seo_revalidation.test.js
PASS src/__tests__/seo_master_suite.test.js
PASS src/__tests__/phase4_mitigations.test.js
PASS src/__tests__/watermark_verification.test.js

Test Suites: 9 passed, 9 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        9.342 s
```

All 9 test suites and 52 individual unit and integration tests passed cleanly.
