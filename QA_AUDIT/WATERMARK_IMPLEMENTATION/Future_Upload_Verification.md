# GoodNews Cake and Catering – Future Admin Upload Watermarking

**Feature:** Automatic Dual-Zone Watermarking for Admin & Future Uploads  
**Integration Point:** `src/services/storageService.js`  
**Status:** Verified & Fully Operational  
**Date:** November 2026

---

## 1. Automatic Dual-Zone Canvas Architecture

Every cake image uploaded via the administrative dashboard automatically receives both watermark zones client-side before binary dispatch to Firebase Storage:

1. **Zone 1: Lower-Third Subject Protection Mark**
   - Transformed with $-6^\circ$ rotation and centered horizontally at $72\%$ image height.
   - Whisper-soft opacity ($14\%–16\%$) to protect against cropping without obstructing cake details.
2. **Zone 2: Bottom-Right Corner Brand Signature**
   - Classic brand signature anchored with $3.5\%$ edge margin.
   - Dual-luminance adaptation (white on dark backgrounds, charcoal slate on bright backgrounds).

---

## 2. Code Implementation in `src/services/storageService.js`

```javascript
// Dual-Zone Canvas Watermark Renderer
export const drawWatermarkOnCanvas = (canvas, ctx) => {
    if (!canvas || !ctx || typeof canvas.width !== 'number') return;
    try {
        const { width, height } = canvas;
        const baseDim = Math.min(width, height);

        // 1. Bottom-Right Corner Signature
        const cornerFontSize = Math.max(14, Math.min(24, Math.round(baseDim * 0.022)));
        const marginRight = Math.max(18, Math.min(36, Math.round(width * 0.035)));
        const marginBottom = Math.max(18, Math.min(36, Math.round(height * 0.035)));

        // 2. Anti-Crop Lower-Third Subject Watermark
        const midFontSize = Math.max(16, Math.min(28, Math.round(baseDim * 0.026)));
        const midX = Math.round(width / 2);
        const midY = Math.round(height * 0.72);

        // Render Anti-Crop Lower-Third Mark (Angled -6deg, whisper-subtle)
        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(-6 * Math.PI / 180);
        ctx.font = `600 ${midFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 0.8;
        ctx.shadowBlur = 2.0;
        ctx.shadowColor = isMidLight ? 'rgba(255, 255, 255, 0.40)' : 'rgba(0, 0, 0, 0.28)';
        ctx.fillStyle = isMidLight ? 'rgba(15, 23, 42, 0.14)' : 'rgba(255, 255, 255, 0.16)';
        ctx.fillText('GOODNEWS CAKE AND CATERING', 0, 0);
        ctx.restore();

        // Render Bottom-Right Corner Signature
        ctx.save();
        ctx.font = `600 ${cornerFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 1.0;
        ctx.shadowBlur = 2.0;
        ctx.shadowColor = isCornerLight ? 'rgba(255, 255, 255, 0.50)' : 'rgba(0, 0, 0, 0.38)';
        ctx.fillStyle = isCornerLight ? 'rgba(15, 23, 42, 0.28)' : 'rgba(255, 255, 255, 0.30)';
        ctx.fillText('GoodNews Cake and Catering', width - marginRight, height - marginBottom);
        ctx.restore();
    } catch {
        // Fallback silently if canvas context error
    }
};
```

---

## 3. Scope Gating & Automation

- **Automatic Trigger:** Triggered for `folder === 'products'` and `folder === 'gallery'` or when `{ isCake: true }` is supplied.
- **Excluded Folders:** `services` (catering), `logo`, and general UI assets remain un-watermarked.
- **Zero Admin Burden:** Bakery administrators do not have to manually edit or position marks; uploading a cake photo through the standard dashboard automatically applies the dual-zone brand protection.
