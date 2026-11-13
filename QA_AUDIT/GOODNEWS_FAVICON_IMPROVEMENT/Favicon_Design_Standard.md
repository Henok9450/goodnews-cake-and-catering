# GoodNews Cake & Catering – Favicon Design Standard & Specification

**Document Version:** 1.0  
**Effective Date:** November 13, 2026  
**Audience:** Brand Designers, Frontend Developers, Design System Maintainers  

---

## 1. Brand Essence & Favicon Philosophy

A favicon is the smallest, most frequently viewed ambassador of the GoodNews brand. In modern browsers, operating systems, and mobile devices, it appears at sizes ranging from 16×16 pixels up to 512×512 pixels.

The primary design principle is **instant semantic recognition**:
> When a user glances at a row of open browser tabs, the GoodNews icon must immediately communicate **"Celebration Bakery"** through signature color, silhouette, and high-contrast geometry.

The full GoodNews wordmark is retained for page headers, packaging, and marketing collateral. The favicon icon serves as the **distilled micro-mark** of the brand.

---

## 2. Visual Anatomy & Color Palette

The GoodNews favicon architecture consists of three core components:

```
+-------------------------------------------------------+
|  [GoodNews Ruby Red Badged Squircle]                 |
|  (Smooth squircle with subtle vertical gradient &     |
|   crisp inner highlight border)                       |
|                                                       |
|             /\   <-- Golden Flame (#fbbf24)          |
|            (  )                                      |
|             ||   <-- Candle Wick & Body              |
|         +--------+                                    |
|         |~~~~~~~~| <-- Top Tier Frosting (White)      |
|       +------------+                                  |
|       |~~~~~~~~~~~~| <-- Base Tier Frosting (White)   |
|     +----------------+                                |
|    ==================== <-- Scalloped Cake Platter    |
+-------------------------------------------------------+
```

### Color Specification:

| Component | Color Hex Code | Role & Contrast Rationale |
|---|---|---|
| **Badge Primary (Ruby Red)** | `#e11d48` | GoodNews signature vibrant red. High chroma, emotionally celebratory. |
| **Badge Gradient Top (Rose)** | `#f43f5e` | Adds subtle top-light dimension, preventing flatness on retina screens. |
| **Badge Gradient Bottom (Crimson)** | `#be123c` | Anchors the base of the badge with deep contrast. |
| **Inner Boundary Highlight** | `rgba(255,255,255, 0.22)` | Guarantees crisp silhouette separation against dark browser tab bars. |
| **Tiered Cake & Frosting** | `#ffffff` | Pure white. Delivers >12:1 WCAG AAA contrast against ruby red background. |
| **Accent Gold (Flame)** | `#fbbf24` | Warm celebration candlelight. High luminosity, easily spotted in micro-resolutions. |
| **Accent Amber (Flame Core)** | `#d97706` | Inner flame core detail for high-resolution displays. |

---

## 3. Pixel-Snapping & Micro-Scale Optimization

At micro resolutions (16×16 and 32×32), subpixel anti-aliasing can cause thin vectors to blur into muddy gray transitions. To ensure razor-sharp edges:

1. **Subpixel Grid Alignment:**
   - Cake tiers are snapped strictly to integer pixel coordinates.
   - Tier 1 (top): width of 8px, height of 3.5px, centered horizontally.
   - Tier 2 (bottom): width of 11.5px, height of 4.5px, centered horizontally.
   - Base Platter: width of 13.5px, height of 1px, anchoring the structure.
2. **Exclusion of Low-Resolution Text:**
   - Letters below 7px cap height cannot be rendered legibly in raster formats. All textual typography is deliberately omitted from the favicon badge to maximize icon clarity.
3. **Squircle Corner Radius Scaling:**
   - Large canvas (512px): `rx="108"` (21% radius).
   - Micro canvas (16px / 32px): `rx="3.5"` / `rx="7"` (maintains balanced curvature without clipping outer edge pixels).

---

## 4. Asset Family & Target Specifications

| File Name | Exact Resolution | Target Context & Platform | Format |
|---|---|---|---|
| `favicon.svg` | Scalable Vector | Modern desktop browsers (Chrome, Edge, Firefox, Safari) | Pure SVG |
| `favicon.ico` | Multi-layer 16, 32, 48 | Legacy browsers, bookmarks, Windows desktop shortcuts | Windows ICO |
| `favicon-16x16.png` | 16×16 px | Standard browser tab (100% DPI display) | 32-bit PNG |
| `favicon-32x32.png` | 32×32 px | High-DPI / Retina browser tab, taskbars | 32-bit PNG |
| `favicon-48x48.png` | 48×48 px | Windows desktop icons, browser site shortcuts | 32-bit PNG |
| `apple-touch-icon.png` | 180×180 px | iOS Safari Home Screen bookmarks, iPadOS | 32-bit PNG |
| `logo192.png` | 192×192 px | Android Chrome Home Screen shortcut, PWA Manifest | 32-bit PNG |
| `logo512.png` | 512×512 px | PWA splash screens, App Store listings | 32-bit PNG |

---

## 5. Metadata Integration Standard

The following snippet is the official production standard for HTML `<head>` declarations:

```html
<!-- Favicon & Branding Icons (with Cache Busting) -->
<link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/favicon.ico?v=3" />
<link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg?v=3" />
<link rel="icon" type="image/png" sizes="48x48" href="%PUBLIC_URL%/favicon-48x48.png?v=3" />
<link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png?v=3" />
<link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png?v=3" />
<meta name="theme-color" content="#e11d48" />

<!-- Apple Touch Icon & PWA Manifest -->
<link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png?v=3" />
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```
