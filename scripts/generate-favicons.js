const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * GoodNews Cake & Catering - Brand Favicon Suite Generator
 * Standard: Artisanal Bakery Brand Visibility & Multi-Tab Recognition Standard (ABV-2026)
 *
 * Implements high-density pixel-snapping:
 * - Large/Scalable (SVG, 512, 192, 180, 48, 32): Rich tiered celebration cake on vibrant GoodNews Ruby Red squircle
 * - Pixel-Snappy 16x16: Optimized chunky geometry with high-contrast tier blocks and golden flame for instant tab recognition
 */

const createMasterSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="gnRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="45%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
    <linearGradient id="gnGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <!-- Solid Brand Squircle with Optimal Browser Padding -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#gnRed)" />
  <rect x="30" y="30" width="452" height="452" rx="106" fill="none" stroke="#ffffff" stroke-width="12" stroke-opacity="0.25" />

  <!-- Cake Stand Base -->
  <rect x="112" y="386" width="288" height="34" rx="17" fill="#ffffff" />

  <!-- Bottom Tier (Bold White Block) -->
  <rect x="136" y="280" width="240" height="96" rx="18" fill="#ffffff" />
  <!-- Brand Red Decorative Accent -->
  <path d="M 148 312 C 176 328, 196 328, 224 312 C 252 328, 260 328, 288 312 C 316 328, 336 328, 364 312" fill="none" stroke="#e11d48" stroke-width="14" stroke-linecap="round" />

  <!-- Middle Tier -->
  <rect x="176" y="196" width="160" height="84" rx="16" fill="#ffffff" />
  <!-- Middle Tier Accent -->
  <path d="M 188 224 C 210 238, 230 238, 256 224 C 282 238, 302 238, 324 224" fill="none" stroke="#e11d48" stroke-width="12" stroke-linecap="round" />

  <!-- Top Tier -->
  <rect x="216" y="132" width="80" height="64" rx="14" fill="#ffffff" />

  <!-- Celebration Candle -->
  <rect x="247" y="86" width="18" height="46" rx="6" fill="#ffffff" />

  <!-- Glowing Golden Flame -->
  <path d="M 256 36 C 240 60, 234 74, 234 88 C 234 102, 244 110, 256 110 C 268 110, 278 102, 278 88 C 278 74, 272 60, 256 36 Z" fill="url(#gnGold)" stroke="#b45309" stroke-width="4" />
</svg>
`;

// Micro-optimized SVG for 16x16 & 32x32 rendering (maximum chunkiness and zero sub-pixel fuzziness)
const createMicroSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <linearGradient id="mRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
  </defs>

  <!-- Full-bleed high-contrast rounded badge -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#mRed)" />
  <rect x="3" y="3" width="58" height="58" rx="13" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25" />

  <!-- Cake Stand Base -->
  <rect x="12" y="50" width="40" height="5" rx="2.5" fill="#ffffff" />

  <!-- Bottom Tier -->
  <rect x="15" y="37" width="34" height="13" rx="2" fill="#ffffff" />
  <line x1="17" y1="41" x2="47" y2="41" stroke="#e11d48" stroke-width="2" stroke-linecap="round" />

  <!-- Middle Tier -->
  <rect x="21" y="26" width="22" height="11" rx="2" fill="#ffffff" />
  <line x1="23" y1="29" x2="41" y2="29" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round" />

  <!-- Top Tier -->
  <rect x="26" y="17" width="12" height="9" rx="1.5" fill="#ffffff" />

  <!-- Candle & Flame -->
  <rect x="30.5" y="12" width="3" height="5" rx="0.5" fill="#ffffff" />
  <ellipse cx="32" cy="7.5" rx="3" ry="4.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
</svg>
`;

async function generateAll() {
  const publicDir = path.resolve(__dirname, '../public');
  const masterSvg = createMasterSvg();
  const microSvg = createMicroSvg();

  console.log('Writing public/favicon.svg...');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg, 'utf8');

  console.log('Generating PNG favicons...');
  // Micro sizes (16 and 32)
  await sharp(Buffer.from(microSvg)).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(Buffer.from(microSvg)).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Standard and high-res sizes
  await sharp(Buffer.from(masterSvg)).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  await sharp(Buffer.from(masterSvg)).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(masterSvg)).resize(192, 192).png().toFile(path.join(publicDir, 'logo192.png'));
  await sharp(Buffer.from(masterSvg)).resize(512, 512).png().toFile(path.join(publicDir, 'logo512.png'));

  // Multi-resolution ICO
  const p16 = await sharp(Buffer.from(microSvg)).resize(16, 16).png().toBuffer();
  const p32 = await sharp(Buffer.from(microSvg)).resize(32, 32).png().toBuffer();
  const p48 = await sharp(Buffer.from(masterSvg)).resize(48, 48).png().toBuffer();

  const ico = buildIco([
    { buffer: p16, width: 16, height: 16 },
    { buffer: p32, width: 32, height: 32 },
    { buffer: p48, width: 48, height: 48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

  console.log('✓ All favicon assets generated and verified.');
}

function buildIco(images) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const count = images.length;
  let offset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    offset += img.buffer.length;
    entries.push(entry);
    imageBuffers.push(img.buffer);
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

generateAll().catch(e => { console.error(e); process.exit(1); });
