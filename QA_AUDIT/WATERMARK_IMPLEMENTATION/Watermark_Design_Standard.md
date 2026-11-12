# GoodNews Cake and Catering – Watermark Design Standard

**Version:** 2.0.0 (Dual-Zone Anti-Crop & Web Protection Specification)  
**Effective Date:** November 2026  
**Applicability:** All Cake Photographs (Homepage, Catalog, Detail Modals, Seasonal/Holiday Gallery, and Future Admin Uploads)  
**Status:** Approved & Implemented

---

## 1. Executive Summary & Problem Solved

Standard corner-only watermarks suffer from a severe digital asset vulnerability: malicious actors and competing bakeries can crop off the bottom 5%–10% of an image in seconds using mobile photo apps, removing the signature entirely and claiming the cake as their own.

Version 2.0.0 implements **Dual-Zone Anti-Crop Protection**:
1. **Primary Brand Signature:** Bottom-right corner signature (`GoodNews Cake and Catering`).
2. **Subject Protection Anchor:** Whisper-subtle ($14\%–16\%$ opacity) brand mark across the lower-third ($y \approx 72\%$ height) angled at $-6^\circ$ directly over the lower tier/cake pedestal. Any attempt to crop it off requires cutting off $>35\%$ of the image, destroying the cake presentation entirely.
3. **Web UI Anti-Save Layer:** Context-menu blocking, drag prevention, and protective overlay within `<OptimizedImage>`.

---

## 2. Dual-Zone Typography & Position Standards

### 2.1 Zone 1: Bottom-Right Brand Signature
- **Exact Text:** `GoodNews Cake and Catering`
- **Typography:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Font Weight:** 600 (Semi-Bold)
- **Tracking:** `0.08em`
- **Font Scaling:** $\text{clamp}(14\text{px}, \text{baseDim} \times 0.022, 24\text{px})$
- **Coordinates:** $x = \text{width} - \text{marginRight}$, $y = \text{height} - \text{marginBottom}$ ($3.5\%$ margin)
- **Luminance Adaptivity:**
  - Dark/Mid Background ($\le 195$): Fill `#FFFFFF` @ $30\%$ opacity, `#000000` drop-shadow @ $35\%$.
  - Bright Background ($> 195$): Fill `#0F172A` (Slate) @ $28\%$ opacity, `#FFFFFF` halo @ $40\%$.

### 2.2 Zone 2: Anti-Crop Subject Anchor (Lower-Third Pedestal Overlay)
- **Exact Text:** `GOODNEWS CAKE AND CATERING`
- **Typography:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Font Weight:** 600 (Semi-Bold), Uppercase
- **Tracking:** `0.16em` (Generous, luxury spaced lettering)
- **Font Scaling:** $\text{clamp}(16\text{px}, \text{baseDim} \times 0.026, 28\text{px})$
- **Angle / Rotation:** $-6^\circ$ around center point $(x = \text{width}/2, y = \text{height} \times 0.72)$
- **Whisper-Soft Opacity:**
  - Dark/Mid Background ($\le 195$): Fill `#FFFFFF` @ $16\%$ opacity, `#000000` shadow @ $25\%$.
  - Bright Background ($> 195$): Fill `#0F172A` @ $14\%$ opacity, `#FFFFFF` halo @ $30\%$.
- **Visual Impact:** Completely imperceptible at casual glance; does not obscure frosting swirls or decorations, but permanently binds the photograph to GoodNews.

---

## 3. Web UI Anti-Theft Defense Layer

Integrated into `src/components/common/OptimizedImage.jsx`:
- **Context Menu Interception:** `onContextMenu={(e) => e.preventDefault()}` on all cake card and modal images.
- **Drag & Drop Disablement:** `draggable="false"` and `style={{ WebkitUserDrag: 'none', userSelect: 'none' }}`.
- **Touch-Callout Suppression:** Prevents mobile long-press "Save Image" popups on iOS Safari and Android Chrome.

---

## 4. Scope & Exclusions

- **Watermarked:** `public/images/cakes/` (19 items) and `public/images/seasonal/` (29 items).
- **Excluded:** `catering/`, `cookies/`, `cupcakes/`, and `logo/`.
- **Master Archives:** Pristine un-watermarked high-res originals stored permanently in `originals/cakes/` and `originals/seasonal/`.
