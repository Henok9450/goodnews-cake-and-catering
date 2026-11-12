# GoodNews Cake and Catering – Watermark Design Standard

**Version:** 3.0.0 (360-Degree Crop-Proof, Screenshot Capture, & Direct Download Standard)  
**Effective Date:** November 2026  
**Applicability:** All Cake Photographs (Homepage, Catalog, Detail Modals, Seasonal/Holiday Gallery, and Future Admin Uploads)  
**Status:** Approved & Implemented

---

## 1. Executive Summary & Design Rationale

To address both image theft by edge-cropping (from top, bottom, or sides) and unauthorized screenshot sharing, Version 3.0.0 implements a **Four-Pillar Asset Protection System**:

1. **Center Core Diagonal Ribbon:** Angled across the absolute center $(50\%, 50\%)$ of every cake photo. It is mathematically impossible to crop out from any side (top, bottom, left, or right) without deleting the entire cake.
2. **Secondary Upper & Lower Ribbons:** Angled at $-22^\circ$ across $y = 28\%$ and $y = 72\%$ to protect against aggressive asymmetrical cropping.
3. **On-Screen UI Screenshot Watermarking:** Rendered dynamically inside `<OptimizedImage>` across live web views. Any screenshot taken via mobile, tablet, or desktop Snipping Tool inherently captures the official "GoodNews Cake and Catering" branding.
4. **Authorized Watermarked Download:** Users, customers, and staff can freely right-click and save images or click the **"Save Photo" / "Download Watermarked Photo"** button inside the product modals, receiving the high-resolution crop-proof watermarked image directly.

---

## 2. Photographic Watermark Specifications

### 2.1 Center Core Diagonal Ribbon
- **Position:** Centered at $(width/2, height/2)$, rotated $-22^\circ$.
- **Text:** `GOODNEWS CAKE AND CATERING`
- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Weight:** 600 (Semi-Bold), Uppercase
- **Tracking:** `0.18em` (Luxury spaced typography)
- **Scaling:** $\text{clamp}(18\text{px}, \text{baseDim} \times 0.028, 32\text{px})$
- **Luminance Adaptivity:**
  - Dark/Mid Backgrounds ($\le 195$): Ivory `#FFFFFF` @ $22\%$ opacity, soft dark shadow `#000000` @ $30\%$.
  - Bright Backgrounds ($> 195$): Charcoal `#0F172A` @ $20\%$ opacity, soft halo `#FFFFFF` @ $35\%$.

### 2.2 Secondary Diagonal Ribbons
- **Positions:** Upper ($y = 28\%$ height) and Lower ($y = 72\%$ height), rotated $-22^\circ$.
- **Text:** `GOODNEWS CAKE AND CATERING`
- **Opacity:** $14\%–16\%$ (whisper-subtle secondary tier).

### 2.3 Corner Brand Signature
- **Position:** Bottom-right corner ($3.5\%$ edge margin).
- **Text:** `GoodNews Cake and Catering`
- **Opacity:** $28\%–30\%$.

---

## 3. Web UI Screenshot Protection Overlay

Integrated within `src/components/common/OptimizedImage.jsx`:
- For all cake imagery, a non-intrusive semi-transparent overlay displays:
  - Upper ribbon (`text-white/20`)
  - Center core ribbon (`text-white/30` with `drop-shadow`)
  - Lower ribbon (`text-white/20`)
  - Bottom-right signature (`text-white/45`)
- When any user captures a screenshot (mobile screen grab, PrintScreen, Snipping Tool), the watermark is physically embedded into their screenshot directly from the screen!

---

## 4. Direct Watermarked Photo Download

- Available in `CakeModal` (`src/pages/Gallery.jsx`) and `SeasonalModal` (`src/pages/Seasonal.jsx`).
- Features dedicated **"Save Photo"** and **"Download Watermarked Photo"** buttons.
- Right-click "Save Image As..." is completely enabled.
- All downloaded files contain the full-resolution 360-degree crop-proof watermark.
