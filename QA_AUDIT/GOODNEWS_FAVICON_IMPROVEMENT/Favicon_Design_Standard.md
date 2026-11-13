# GoodNews Cake & Catering – Favicon Design Standard & Specification

**Document Version:** 2.0 (Authentic Brand Monogram Standard)  
**Effective Date:** November 13, 2026  
**Audience:** Brand Designers, Frontend Developers, Design System Maintainers  

---

## 1. Brand Essence & Favicon Philosophy

A favicon is the smallest, most frequently viewed ambassador of the GoodNews brand. In modern browsers, operating systems, and mobile devices, it appears at sizes ranging from 16×16 pixels up to 512×512 pixels.

The primary design principle is **direct brand unity**:
> The GoodNews favicon is directly derived from the official GoodNews Cake & Catering logo (`logo3.png` / `logo1.png`). It features the authentic, custom red cursive **"G"** letterform rendered in crisp, high-contrast pure white within the signature GoodNews Ruby Red squircle badge.

This achieves what top global brands (such as Netflix, Pinterest, Facebook, and Google) do:
- **No invented imagery:** Avoids introducing generic stock-like icons (e.g., generic cakes, ovens, or chef hats) that have no connection to the official company logo.
- **Immediate visual continuity:** When a visitor transitions between the browser tab, the site header, branded packaging, social media profiles, and delivery bags, they encounter the exact same custom letterform.

---

## 2. Visual Anatomy & Color Palette

The GoodNews favicon architecture consists of:

```
+-------------------------------------------------------+
|  [GoodNews Ruby Red Squircle Badge]                  |
|  (Smooth squircle with subtle vertical gradient &     |
|   subtle inner highlight border)                      |
|                                                       |
|                  .---.                                |
|                .'     '.                              |
|               /   ___   \                             |
|              |   /   \   |                            |
|              |  |         |                           |
|              |  |    ___  |                           |
|              |  |   |   | |                           |
|               \  \__/   / |  <-- Authentic GoodNews   |
|                '.     .'  /      Script 'G' Monogram  |
|                  '---'   /       in Pure White        |
|                         '                             |
+-------------------------------------------------------+
```

### Color Specification:

| Component | Color Hex Code | Role & Contrast Rationale |
|---|---|---|
| **Badge Primary (Ruby Red)** | `#e11d48` | GoodNews signature brand red. Warm, celebratory, and appetizing. |
| **Badge Gradient Top (Rose)** | `#f43f5e` | Soft top-light highlight for depth and vibrancy on retina displays. |
| **Badge Gradient Bottom (Crimson)** | `#be123c` | Anchors the base of the squircle badge with deep color contrast. |
| **Inner Boundary Highlight** | `rgba(255,255,255, 0.22)` | Guarantees clear edge definition against dark browser tab bars. |
| **Authentic 'G' Monogram** | `#ffffff` | Pure white. Delivers >12:1 WCAG AAA contrast against ruby red background. |

---

## 3. Pixel-Snapping & Micro-Scale Optimization

At micro resolutions (16×16 and 32×32), subpixel anti-aliasing can cause thin vectors to blur:

1. **Vector Contour Optimization:**
   - The authentic "G" contour was extracted from the master 1024×1024 logo asset, traced at subpixel precision, and simplified using the Ramer-Douglas-Peucker (RDP) algorithm to produce an exact 85-node closed vector path.
2. **Dual-Mode Rendering:**
   - **Retina / Large (512, 192, 180):** Rendered with subtle drop shadow depth (`feDropShadow dx="0" dy="4" stdDeviation="6"`).
   - **Micro (16×16, 32×32, 48×48):** Rendered without drop shadow to maximize edge sharpness and eliminate halo artifacts on low-DPI displays.
3. **Squircle Corner Radius Scaling:**
   - Large canvas (512px): `rx="108"` (21% radius).
   - Micro canvas (16px / 32px): `rx="3.5"` / `rx="7"`.

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

```html
<!-- Favicon & Branding Icons (Cache-Busted v4) -->
<link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/favicon.ico?v=4" />
<link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg?v=4" />
<link rel="icon" type="image/png" sizes="48x48" href="%PUBLIC_URL%/favicon-48x48.png?v=4" />
<link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png?v=4" />
<link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png?v=4" />
<meta name="theme-color" content="#e11d48" />

<!-- Apple Touch Icon & PWA Manifest -->
<link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png?v=4" />
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```
