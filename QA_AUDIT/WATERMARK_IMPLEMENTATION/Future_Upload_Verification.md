# GoodNews Cake and Catering – Future Admin Upload Watermarking

**Feature:** Automatic Client-Side Watermarking for Admin & Future Uploads  
**Integration Point:** `src/services/storageService.js`  
**Status:** Verified & Fully Operational  
**Date:** November 2026

---

## 1. Objective & Architecture

To ensure that newly added cake photographs uploaded through the administrative dashboard automatically receive the official **`GoodNews Cake and Catering`** watermark without burdening staff with manual editing:

```
[ Admin Dashboard: Product / Gallery Upload ]
                     |
                     v
   uploadImage(file, folder, onProgress, options)
                     |
    folder === 'products' || folder === 'gallery'?
          /                                \
        YES                                 NO (e.g., logo, banners)
         |                                   |
         v                                   v
compressImageForUpload(..., watermark=true)   compressImageForUpload(..., watermark=false)
         |                                   |
         v                                   v
drawWatermarkOnCanvas(canvas, ctx)           Standard Compression
         |                                   |
         +-----------------+-----------------+
                           |
                           v
          [ Direct Upload to Firebase Storage ]
```

---

## 2. Implementation Specifications in `storageService.js`

### 2.1 The HTML5 Canvas Watermark Renderer
The client-side canvas engine inspects the bottom-right corner of the resized image in memory, calculates luminance, and applies the adaptive watermark before binary serialization:

```javascript
export const drawWatermarkOnCanvas = (canvas, ctx) => {
  if (!canvas || !ctx || typeof canvas.width !== 'number') return;
  const width = canvas.width;
  const height = canvas.height;

  // 1. Proportional font sizing
  const baseDim = Math.min(width, height);
  const fontSize = Math.max(14, Math.min(26, Math.round(baseDim * 0.024)));
  const margin = Math.max(18, Math.min(36, Math.round(baseDim * 0.035)));

  // 2. Corner luminance detection
  const sampleW = Math.min(120, width);
  const sampleH = Math.min(60, height);
  let isBright = false;

  try {
    const imgData = ctx.getImageData(width - sampleW, height - sampleH, sampleW, sampleH);
    const data = imgData.data;
    let totalLuminance = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      totalLuminance += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const avgLuminance = totalLuminance / pixelCount;
    isBright = avgLuminance > 195;
  } catch (e) {
    isBright = false;
  }

  // 3. Render watermark
  ctx.save();
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const x = width - margin;
  const y = height - margin;
  const text = 'GoodNews Cake and Catering';

  if (isBright) {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.30)';
  }

  ctx.fillText(text, x, y);
  ctx.restore();
};
```

### 2.2 Automated Scope Gating in `uploadImage`
```javascript
export const uploadImage = async (file, folder = 'products', onProgress = null, options = {}) => {
  // Determine if image should be watermarked
  // Auto-watermark products and gallery photos unless explicitly disabled
  const isCakeAsset = (folder === 'products' || folder === 'gallery');
  const shouldWatermark = options.watermark !== undefined ? options.watermark : isCakeAsset;
  
  const compressed = await compressImageForUpload(file, 1600, 0.88, shouldWatermark);
  // ... upload compressed blob to Firebase Storage ...
};
```

---

## 3. Operational Guarantees

1. **Zero Database Changes:** No database fields, schema changes, or migration scripts were introduced. Watermarking happens in-flight prior to storage.
2. **Zero Admin Friction:** Bakery administrators do not need to check a box or select watermarking parameters; uploading any cake photograph to catalog products or gallery automatically stamps it.
3. **Safe Fallbacks:** If the browser or runtime environment lacks HTML5 canvas support, `compressImageForUpload` safely falls back to uploading the original file rather than failing the transaction.
4. **Explicit Override Capability:** Administrative tasks requiring raw logo uploads or non-watermarked assets can supply `{ watermark: false }` in `options`.
