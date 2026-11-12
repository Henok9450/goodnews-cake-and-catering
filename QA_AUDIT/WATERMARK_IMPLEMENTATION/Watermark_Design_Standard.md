# GoodNews Cake and Catering – Watermark Design Standard

**Version:** 4.0.0 (Complete Enterprise Portfolio Protection: Cakes, Seasonal, Cupcakes, Cookies, & Catering)  
**Effective Date:** November 2026  
**Applicability:** All Public Portfolio Photography (Cakes, Seasonal Holidays, Cupcakes, Cookies, Catering Banquets, and Future Admin Uploads)  
**Status:** Approved & Implemented

---

## 1. Executive Summary & Full Portfolio Scope

All 75 food and catering photographs displayed across the GoodNews Cake and Catering platform are protected with the **Four-Pillar 360-Degree Crop-Proof Asset Protection System**:

1. **Center Core Diagonal Ribbon:** Angled at $-22^\circ$ across $(50\%, 50\%)$. Cannot be cropped from top, bottom, left, or right without destroying the food presentation.
2. **Secondary Upper & Lower Ribbons:** Protects against aggressive asymmetrical crops.
3. **On-Screen UI Screenshot Watermarking:** Dynamic React overlay in `<OptimizedImage>` guarantees that any screenshot captured on mobile or desktop includes official GoodNews branding.
4. **Direct Authorized Download:** Users and staff can right-click to save or click the dedicated **"Save Photo" / "Download Watermarked Photo"** button across all modals (Gallery, Seasonal, Cupcakes, Cookies, Catering).

---

## 2. Protected Portfolio Scope

| Category | Directory Path | Asset Count | Protection Status | Master Backup |
| :--- | :--- | -: | :--- | :--- |
| **Standard Cakes** | `public/images/cakes/` | 19 | 360° Crop-Proof Watermarked | `originals/cakes/` |
| **Seasonal & Cultural** | `public/images/seasonal/` | 29 | 360° Crop-Proof Watermarked | `originals/seasonal/` |
| **Cupcakes** | `public/images/cupcakes/` | 9 | 360° Crop-Proof Watermarked | `originals/cupcakes/` |
| **Cookies** | `public/images/cookies/` | 9 | 360° Crop-Proof Watermarked | `originals/cookies/` |
| **Catering Services** | `public/images/catering/` | 9 | 360° Crop-Proof Watermarked | `originals/catering/` |
| **Official Logos** | `public/images/logo/` | — | Pristine Vectors (Excluded) | Excluded |
| **Total Assets** | | **75** | | |

---

## 3. Watermark Typography & Luminance Adaptation

- **Primary Text:** `GoodNews Cake and Catering`
- **Typography:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Center Ribbon Opacity:** $20\%–22\%$ with adaptive contrast.
  - Dark/Mid Background ($\le 195$): Ivory `#FFFFFF`, soft shadow `#000000` @ $30\%$.
  - Bright Background ($> 195$): Charcoal Slate `#0F172A`, soft halo `#FFFFFF` @ $35\%$.
- **Secondary Ribbons Opacity:** $14\%–16\%$.
- **Corner Signature Opacity:** $28\%–30\%$.
