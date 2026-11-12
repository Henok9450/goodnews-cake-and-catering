# GoodNews Cake and Catering – Watermark Design Standard

**Version:** 1.0.0  
**Effective Date:** November 2026  
**Applicability:** All Cake Photographs (Homepage, Catalog, Detail Modals, Seasonal/Holiday Gallery, and Future Admin Uploads)  
**Status:** Approved & Implemented

---

## 1. Executive Summary

This standard defines the visual branding and digital asset protection specifications for cake photography within the **GoodNews Cake and Catering** e-commerce web platform. The watermark serves to verify brand authenticity, discourage unauthorized reuse, and enhance brand prestige without visually obstructing artisanal cake decorations, delicate piping, sugar flowers, or celebratory lettering.

---

## 2. Brand Identity & Typography Specifications

### 2.1 Exact Watermark String
```
GoodNews Cake and Catering
```
- No abbreviations (e.g., "GNCC" or "GoodNews" alone are prohibited).
- No extraneous symbols, copyright notices (`©`), or phone numbers to maintain an elegant artisanal studio aesthetic.

### 2.2 Typography Stack
- **Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Font Weight:** 600 (Semi-Bold) for optimal edge definition at semi-transparent opacities.
- **Letter Spacing:** `0.025em` tracking for enhanced legibility against photographic textures.

### 2.3 Proportional Scaling Matrix
The font size scales dynamically relative to the image canvas dimensions so that the watermark maintains a consistent visual weight regardless of resolution:

$$\text{Font Size} = \text{clamp}\left(14\text{px}, \min(\text{width}, \text{height}) \times 0.024, 26\text{px}\right)$$

| Image Resolution / Class | Typical Dimensions | Computed Font Size | Margin Offset |
| :--- | :--- | :--- | :--- |
| **Mobile / Compact Display** | $600 \times 800\text{ px}$ | $14\text{ px}$ | $18\text{ px}$ |
| **Standard Catalog Card** | $800 \times 1200\text{ px}$ | $18\text{ px}$ | $24\text{ px}$ |
| **Square High-Resolution** | $1024 \times 1024\text{ px}$ | $22\text{ px}$ | $28\text{ px}$ |
| **Studio Ultra-Res Master** | $1600 \times 2400\text{ px}$ | $26\text{ px}$ | $36\text{ px}$ |

---

## 3. Adaptive Luminance & Contrast Matrix

Because artisanal cakes feature diverse backdrops—from pure white fondant and minimalist studio lightboxes to rich dark chocolate ganache and ambient banquet lighting—a single static color creates legibility failures. The watermark pipeline utilizes an **Adaptive Corner Luminance Detection** algorithm:

$$\text{Corner Brightness} = 0.299 \cdot R + 0.587 \cdot G + 0.114 \cdot B$$

Evaluated across the $120 \times 60\text{ px}$ bounding rectangle of the bottom-right quadrant:

```
                                      [ Corner Luminance Check ]
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
             Corner Brightness <= 195                           Corner Brightness > 195
          (Dark / Mid-Tone Background)                         (Bright / White Background)
                         |                                                 |
                         v                                                 v
           Text Color: #FFFFFF (White)                       Text Color: #0F172A (Deep Slate)
                 Opacity: 0.30                                     Opacity: 0.28
           Shadow: #000000 @ 0.35 Opacity                    Halo: #FFFFFF @ 0.40 Opacity
              Blur: 2.5px, Offset: (1, 1)                       Blur: 2.0px, Offset: (0, 0)
```

### 3.1 Mode A: Dark / Mid-Tone Photography (Luminance $\le 195$)
- **Fill Color:** Solid White (`#FFFFFF`) at `30%` opacity (`rgba(255, 255, 255, 0.30)`).
- **Drop Shadow:** Soft Obsidian (`#000000`) at `35%` opacity, $1\text{px}$ offset, $2.5\text{px}$ Gaussian blur.
- **Application Examples:** Chocolate cakes, berry toppings, celebration cakes on dark stands, holiday festival themes.

### 3.2 Mode B: Bright / White Photography (Luminance $> 195$)
- **Fill Color:** Deep Charcoal Slate (`#0F172A`) at `28%` opacity (`rgba(15, 23, 42, 0.28)`).
- **Soft Halo:** Pristine White (`#FFFFFF`) at `40%` opacity, $2.0\text{px}$ diffuse blur.
- **Application Examples:** White pearl wedding tiers, ivory buttercream anniversary cakes, studio white seamless backdrops.

---

## 4. Placement & Clearance Standards

### 4.1 Preferred Coordinate Anchor
- **Anchor:** Bottom-Right Corner (`SE` gravity).
- **Edge Margin:** $3.5\%$ of base image dimension (clamped between $18\text{px}$ and $36\text{px}$).
- **Clearance:** Ensures minimum $15\text{px}$ breathing room from viewport clipping bounds and rounded card corners.

### 4.2 Prohibited Placements
- **Center Watermarking:** Strictly forbidden to prevent degradation of product visual evaluation.
- **Opaque Bounding Boxes:** No solid badges, semi-opaque ribbons, or background pill containers.
- **Diagonals & Repeated Tiled Patterns:** Prohibited to maintain premium luxury presentation.

---

## 5. Scope & Asset Exclusions

| Asset Category | Directory Path | Watermarking Required? | Reason |
| :--- | :--- | :--- | :--- |
| **Standard Cake Catalog** | `public/images/cakes/` | **YES** | Core commercial cake portfolio requiring copyright branding. |
| **Seasonal / Holiday Cakes** | `public/images/seasonal/` | **YES** | Artisanal holiday cakes requiring brand signature. |
| **Catering Services** | `public/images/catering/` | **NO** | Service staging & buffet photography excluded by scope policy. |
| **Cookies Portfolio** | `public/images/cookies/` | **NO** | Confectionery pastry photos excluded by scope policy. |
| **Cupcakes Portfolio** | `public/images/cupcakes/` | **NO** | Cupcake confections excluded by scope policy. |
| **Official Logos & Icons** | `public/images/logo/` | **NO** | Raw brand identity marks must remain pristine vectors/rasters. |

---

## 6. Preservation of Original Master Assets

Under no circumstances are master photographs permanently overwritten without backup:
1. All untouched high-resolution master photographs are preserved in root `originals/cakes/` and `originals/seasonal/`.
2. Public production images (`public/images/cakes/`, `public/images/seasonal/`) contain the watermarked composited assets, their full `.webp` counterparts, and responsive `-card.webp` derivatives.
3. Automated verification scripts ensure `originals/` remains safely excluded from web bundle limits while preserving bit-for-bit historical backups.
