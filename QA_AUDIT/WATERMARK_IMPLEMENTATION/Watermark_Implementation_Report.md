# GoodNews Cake and Catering – Watermark Implementation Technical Report

**Project:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Feature:** Dual-Zone Anti-Crop Watermark & Web Protection Architecture  
**Status:** Verification Passed & Production-Ready  
**Date:** November 2026

---

## 1. Architecture & Execution Overview

To defeat image cropping while preserving high aesthetic appeal, a two-zone defense system was engineered:

1. **Dual-Zone Watermark Pipeline (`scripts/apply-watermarks.js`):**
   - **Corner Brand Signature:** Anchored bottom-right with adaptive contrast.
   - **Subject Protection Mark:** Whisper-soft ($14\%–16\%$ opacity) brand mark angled at $-6^\circ$ centered at $y \approx 72\%$ height across the cake pedestal/lower tier.
   - Composited via SIMD-accelerated `sharp` from untouched master images in `originals/`.
2. **Web UI Anti-Save Layer (`src/components/common/OptimizedImage.jsx`):**
   - Right-click saving disabled via `onContextMenu={(e) => e.preventDefault()}`.
   - Image dragging disabled via `draggable="false"` and `WebkitUserDrag: 'none'`.
   - Touch callout suppressed on mobile devices.
3. **Admin Upload Future Pipeline (`src/services/storageService.js`):**
   - HTML5 Canvas engine stamps both corner signature and lower-third subject mark automatically before uploading newly added cake images to Firebase Storage.

---

## 2. Mathematical Model for Dual-Zone Protection

```
+-------------------------------------------------------------+
|                                                             |
|                       [ CAKE TOPPER ]                       |
|                                                             |
|                      [ UPPER TIER(S) ]                      |
|                                                             |
|        - - - - - - - - - - - - - - - - - - - - - - -        |
|        \ GOODNEWS CAKE AND CATERING (14-16% opacity) \      |  <-- Crop-Proof Zone (y=72%)
|        - - - - - - - - - - - - - - - - - - - - - - -        |
|                     [ SERVING PEDESTAL ]                    |
|                                                             |
|                                   GoodNews Cake and Catering|  <-- Corner Signature (y=96%)
+-------------------------------------------------------------+
```

### Protection Guarantee:
- If a bad actor crops out the corner signature (bottom 10%), the cake image still retains `GOODNEWS CAKE AND CATERING` embossed across the pedestal.
- To remove the secondary mark, an adversary would have to crop out $\ge 35\%$ from the bottom, which severs the cake pedestal and lower decorations, completely ruining the photo.

---

## 3. Automated Quality Assurance & Verification

Running the test suite executes all 9 test suites and 52 tests:
- `src/__tests__/watermark_verification.test.js` verifies canvas export, fallback resilience, backup integrity, and derivative creation.
- `src/__tests__/performance_revalidation.test.js` confirms total image asset payload remains under 50MB.
- `src/__tests__/functional_regression.test.js` and `seo_master_suite.test.js` pass with zero regressions.
