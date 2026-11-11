const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Builds a valid multi-resolution Windows/Browser ICO binary file from an array of PNG buffers.
 * @param {Array<{ buffer: Buffer, width: number, height: number }>} pngBuffers
 * @returns {Buffer} Valid ICO buffer
 */
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  for (const { buffer, width, height } of pngBuffers) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette count (0 = >8bpp)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image data size in bytes
    entry.writeUInt32LE(offset, 12); // Offset of image data in file
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

/**
 * Creates a circular white badge containing the official GoodNews logo
 */
async function createCircularBadgeFavicon(trimmedBuffer, size, paddingPercent = 0.10) {
  const padding = Math.round(size * paddingPercent);
  const targetWidth = size - (padding * 2);
  
  // Resize trimmed logo to fit inside targetWidth
  const resizedLogo = await sharp(trimmedBuffer)
    .resize(targetWidth, null, { fit: 'inside' })
    .toBuffer();
  
  const logoMeta = await sharp(resizedLogo).metadata();
  const left = Math.round((size - logoMeta.width) / 2);
  const top = Math.round((size - logoMeta.height) / 2);

  // High contrast white badge with subtle outline for light browser tabs
  const strokeWidth = size >= 32 ? 1 : 0.5;
  const badgeSvg = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - strokeWidth}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="${strokeWidth}"/>
    </svg>
  `);

  return sharp(badgeSvg)
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

/**
 * Creates a square opaque white icon for mobile home screens and PWA
 */
async function createSquareWhiteAppIcon(trimmedBuffer, size, horizontalPaddingPercent = 0.12) {
  const padding = Math.round(size * horizontalPaddingPercent);
  const targetWidth = size - (padding * 2);

  const resizedLogo = await sharp(trimmedBuffer)
    .resize(targetWidth, null, { fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();
  const left = Math.round((size - logoMeta.width) / 2);
  const top = Math.round((size - logoMeta.height) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  const logoSourcePath = path.join(__dirname, '../public/images/logo/logo3.png');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(logoSourcePath)) {
    throw new Error(`Official logo not found at: ${logoSourcePath}`);
  }

  console.log(`Processing official brand logo from: ${logoSourcePath}`);
  
  // Convert source to clean un-indexed PNG buffer then trim transparent borders
  const cleanPngBuffer = await sharp(logoSourcePath).png().toBuffer();
  const trimmedBuffer = await sharp(cleanPngBuffer).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log(`Trimmed logo dimensions: ${trimmedMeta.width}x${trimmedMeta.height} (Aspect ratio: ${(trimmedMeta.width / trimmedMeta.height).toFixed(2)})`);

  // 1. Generate Favicon PNGs (16x16, 32x32, 48x48)
  console.log('Generating favicon PNGs (16x16, 32x32, 48x48)...');
  const fav16 = await createCircularBadgeFavicon(trimmedBuffer, 16, 0.08);
  const fav32 = await createCircularBadgeFavicon(trimmedBuffer, 32, 0.10);
  const fav48 = await createCircularBadgeFavicon(trimmedBuffer, 48, 0.10);

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), fav48);

  // 2. Generate multi-resolution favicon.ico (16, 32, 48)
  console.log('Generating multi-resolution favicon.ico...');
  const icoBuffer = buildIco([
    { buffer: fav16, width: 16, height: 16 },
    { buffer: fav32, width: 32, height: 32 },
    { buffer: fav48, width: 48, height: 48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // 3. Generate scalable favicon.svg
  console.log('Generating vector favicon.svg...');
  // Use high-resolution 128px version embedded as base64 in SVG for infinite crisp scaling
  const fav128 = await createCircularBadgeFavicon(trimmedBuffer, 128, 0.10);
  const fav128Base64 = fav128.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <image href="data:image/png;base64,${fav128Base64}" width="128" height="128"/>
</svg>
`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');

  // 4. Generate Apple Touch Icon (180x180, opaque white background)
  console.log('Generating Apple Touch Icon (180x180)...');
  const appleTouchIcon = await createSquareWhiteAppIcon(trimmedBuffer, 180, 0.12);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

  // 5. Generate Android / PWA Icons (192x192 and 512x512)
  console.log('Generating Android & PWA icons (logo192.png, logo512.png)...');
  const logo192 = await createSquareWhiteAppIcon(trimmedBuffer, 192, 0.12);
  const logo512 = await createSquareWhiteAppIcon(trimmedBuffer, 512, 0.12);
  fs.writeFileSync(path.join(publicDir, 'logo192.png'), logo192);
  fs.writeFileSync(path.join(publicDir, 'logo512.png'), logo512);

  console.log('All official branding assets generated successfully:');
  console.log('  - public/favicon.ico');
  console.log('  - public/favicon.svg');
  console.log('  - public/favicon-16x16.png');
  console.log('  - public/favicon-32x32.png');
  console.log('  - public/favicon-48x48.png');
  console.log('  - public/apple-touch-icon.png');
  console.log('  - public/logo192.png');
  console.log('  - public/logo512.png');
}

main().catch(err => {
  console.error('Fatal error generating branding assets:', err);
  process.exit(1);
});
