const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * GoodNews Cake & Catering - Brand Favicon Suite Generator
 * Design Standard: Authentic GoodNews 'G' Brand Monogram (ABV-2026-v2)
 *
 * Directly extracts and renders the signature 'G' letterform from the official
 * GoodNews logo (public/images/logo/logo3.png), enclosed within the signature
 * GoodNews Ruby Red squircle badge with subtle contrast boundary.
 */

// Exact vector outline of the authentic 'G' from GoodNews logo (normalized to 512x512 canvas)
const G_PATH_DATA = "M 275.64 96.00 L 314.19 96.00 L 316.12 97.93 L 325.76 97.93 L 346.96 105.64 L 366.24 119.13 L 373.95 128.77 L 379.73 142.27 L 379.73 157.69 L 375.88 165.40 L 368.17 173.11 L 348.89 180.82 L 345.04 176.96 L 343.11 167.33 L 335.40 153.83 L 325.76 144.19 L 312.27 136.48 L 306.48 136.48 L 304.55 134.55 L 277.57 134.55 L 254.43 146.12 L 242.87 157.69 L 227.45 180.82 L 219.73 196.24 L 212.02 219.37 L 212.02 225.16 L 208.17 234.80 L 208.17 244.43 L 206.24 246.36 L 206.24 261.78 L 204.31 263.71 L 204.31 300.34 L 206.24 302.27 L 208.17 323.47 L 217.81 346.60 L 223.59 354.31 L 237.08 365.88 L 250.58 371.66 L 260.22 371.66 L 262.14 373.59 L 264.07 371.66 L 285.28 369.73 L 296.84 363.95 L 312.27 348.53 L 321.90 325.40 L 323.83 309.98 L 325.76 308.05 L 325.76 292.63 L 327.69 290.70 L 325.76 286.84 L 283.35 286.84 L 289.13 252.14 L 385.52 252.14 L 385.52 284.92 L 383.59 286.84 L 379.73 325.40 L 373.95 344.67 L 360.46 369.73 L 341.18 389.01 L 314.19 404.43 L 294.92 410.22 L 287.20 410.22 L 285.28 412.14 L 264.07 412.14 L 262.14 414.07 L 256.36 412.14 L 237.08 412.14 L 210.10 404.43 L 194.67 396.72 L 175.40 381.30 L 161.90 363.95 L 146.48 327.33 L 144.55 308.05 L 142.63 306.12 L 142.63 257.93 L 144.55 256.00 L 144.55 244.43 L 146.48 242.51 L 150.34 219.37 L 167.69 175.04 L 192.75 140.34 L 213.95 121.06 L 244.80 103.71 L 264.07 97.93 L 273.71 97.93 Z";

const createSvg = (withDropShadow = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gnRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
    ${withDropShadow ? `
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.25" />
    </filter>` : ''}
  </defs>

  <!-- Signature GoodNews Ruby Red Squircle Badge -->
  <rect x="20" y="20" width="472" height="472" rx="108" fill="url(#gnRed)" />
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#ffffff" stroke-width="10" stroke-opacity="0.22" />

  <!-- Authentic GoodNews 'G' Monogram from Official Logo -->
  <path d="${G_PATH_DATA}" fill="#ffffff" ${withDropShadow ? 'filter="url(#shadow)"' : ''} />
</svg>
`.trim();

async function generateAll() {
  const publicDir = path.resolve(__dirname, '../public');

  console.log('Generating Authentic GoodNews "G" Brand Favicon Suite...');

  // 1. Vector SVG (with subtle shadow)
  const masterSvg = createSvg(true);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg, 'utf8');
  console.log('✓ Created public/favicon.svg (Scalable Vector)');

  // Clean SVG for small raster renders (no shadow to prevent subpixel blur)
  const cleanSvg = createSvg(false);

  // 2. High-Density App Icons
  const sizes = [
    { name: 'logo512.png', size: 512, svg: masterSvg },
    { name: 'logo192.png', size: 192, svg: masterSvg },
    { name: 'apple-touch-icon.png', size: 180, svg: masterSvg },
    { name: 'favicon-48x48.png', size: 48, svg: cleanSvg },
    { name: 'favicon-32x32.png', size: 32, svg: cleanSvg },
    { name: 'favicon-16x16.png', size: 16, svg: cleanSvg }
  ];

  for (const item of sizes) {
    const outPath = path.join(publicDir, item.name);
    await sharp(Buffer.from(item.svg))
      .resize(item.size, item.size, {
        kernel: sharp.kernel.lanczos3
      })
      .png()
      .toFile(outPath);
    console.log(`✓ Created public/${item.name} (${item.size}x${item.size})`);
  }

  // 3. Multi-layer Windows ICO (16, 32, 48)
  const png16 = await sharp(Buffer.from(cleanSvg)).resize(16, 16).png().toBuffer();
  const png32 = await sharp(Buffer.from(cleanSvg)).resize(32, 32).png().toBuffer();
  const png48 = await sharp(Buffer.from(cleanSvg)).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico (Multi-layer 16/32/48)');

  // Clean up any temporary json
  const gPathJson = path.resolve(__dirname, 'g-path.json');
  if (fs.existsSync(gPathJson)) fs.unlinkSync(gPathJson);

  console.log('All Authentic Brand Favicon assets generated successfully!');
}

/**
 * Creates standard Windows ICO binary format wrapping multiple PNG images
 */
function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // Width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset to image data

    entries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

generateAll().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
