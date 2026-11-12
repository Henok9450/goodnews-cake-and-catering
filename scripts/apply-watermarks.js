const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WATERMARK_TEXT = 'GoodNews Cake and Catering';

/**
 * Creates an SVG watermark buffer tailored for the given dimensions and luminance.
 * Implements DUAL-ZONE protection:
 * 1. Bottom-Right Corner Brand Signature
 * 2. Anti-Crop Lower-Third Subject Overlay (slight -6deg tilt, whisper-subtle ~15% opacity)
 */
function createWatermarkSvg(width, height, cornerBrightness = 150, midBrightness = 150) {
  const baseDim = Math.min(width, height);
  
  // 1. Corner Signature Parameters
  const cornerFontSize = Math.max(14, Math.min(24, Math.round(baseDim * 0.022)));
  const marginRight = Math.max(18, Math.min(36, Math.round(width * 0.035)));
  const marginBottom = Math.max(18, Math.min(36, Math.round(height * 0.035)));
  
  const isCornerLight = cornerBrightness > 195;
  const cornerTextColor = isCornerLight ? '#0F172A' : '#FFFFFF';
  const cornerTextOpacity = isCornerLight ? 0.28 : 0.30;
  const cornerShadowColor = isCornerLight ? '#FFFFFF' : '#000000';
  const cornerShadowOpacity = isCornerLight ? 0.40 : 0.35;

  const cornerX = width - marginRight;
  const cornerY = height - marginBottom;

  // 2. Anti-Crop Lower-Third Subject Overlay
  const midFontSize = Math.max(16, Math.min(28, Math.round(baseDim * 0.026)));
  const midX = Math.round(width / 2);
  const midY = Math.round(height * 0.72);
  
  const isMidLight = midBrightness > 195;
  const midTextColor = isMidLight ? '#0F172A' : '#FFFFFF';
  const midTextOpacity = isMidLight ? 0.14 : 0.16; // Whisper-subtle so cake decorations stay 100% visible
  const midShadowColor = isMidLight ? '#FFFFFF' : '#000000';
  const midShadowOpacity = isMidLight ? 0.30 : 0.25;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="corner-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0.5" dy="1.0" stdDeviation="1.0" flood-color="${cornerShadowColor}" flood-opacity="${cornerShadowOpacity}"/>
      </filter>
      <filter id="mid-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0.5" dy="0.8" stdDeviation="1.2" flood-color="${midShadowColor}" flood-opacity="${midShadowOpacity}"/>
      </filter>
    </defs>
    <style>
      .wm-corner {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${cornerFontSize}px;
        font-weight: 600;
        letter-spacing: 0.08em;
        fill: ${cornerTextColor};
        fill-opacity: ${cornerTextOpacity};
        filter: url(#corner-shadow);
      }
      .wm-subject {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${midFontSize}px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        fill: ${midTextColor};
        fill-opacity: ${midTextOpacity};
        filter: url(#mid-shadow);
      }
    </style>
    <!-- Anti-Crop Subject Protection: Lower-Third Tier / Pedestal Anchor -->
    <g transform="rotate(-6, ${midX}, ${midY})">
      <text x="${midX}" y="${midY}" text-anchor="middle" class="wm-subject">
        ${WATERMARK_TEXT}
      </text>
    </g>
    <!-- Bottom-Right Brand Signature -->
    <text x="${cornerX}" y="${cornerY}" text-anchor="end" class="wm-corner">
      ${WATERMARK_TEXT}
    </text>
  </svg>
  `;

  return Buffer.from(svg.trim());
}

async function analyzeLuminance(imagePath, width, height) {
  try {
    const cornerW = Math.min(300, Math.round(width * 0.35));
    const cornerH = Math.min(100, Math.round(height * 0.12));
    const corner = await sharp(imagePath)
      .extract({
        left: width - cornerW,
        top: height - cornerH,
        width: cornerW,
        height: cornerH
      })
      .stats();
    const cornerBrightness = Math.round(corner.channels.slice(0, 3).reduce((acc, c) => acc + c.mean, 0) / 3);

    const midW = Math.min(500, Math.round(width * 0.60));
    const midH = Math.min(120, Math.round(height * 0.15));
    const midLeft = Math.max(0, Math.round((width - midW) / 2));
    const midTop = Math.max(0, Math.round(height * 0.68));
    const mid = await sharp(imagePath)
      .extract({
        left: midLeft,
        top: midTop,
        width: midW,
        height: midH
      })
      .stats();
    const midBrightness = Math.round(mid.channels.slice(0, 3).reduce((acc, c) => acc + c.mean, 0) / 3);

    return { cornerBrightness, midBrightness };
  } catch (e) {
    return { cornerBrightness: 150, midBrightness: 150 };
  }
}

async function processFolder(folderName) {
  const sourceDir = path.join(__dirname, '../public/images', folderName);
  const backupDir = path.join(__dirname, '../originals', folderName);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const allFiles = fs.readdirSync(sourceDir);
  // Source files: exclude -card.webp and .webp unless it has no other source
  const sourceFiles = allFiles.filter(f => {
    if (f.includes('-card.')) return false;
    if (f.endsWith('.webp')) {
      const baseName = f.replace(/\.webp$/, '');
      const hasPng = fs.existsSync(path.join(sourceDir, `${baseName}.png`));
      const hasJpg = fs.existsSync(path.join(sourceDir, `${baseName}.jpg`)) || fs.existsSync(path.join(sourceDir, `${baseName}.jpeg`));
      return !hasPng && !hasJpg;
    }
    return f.match(/\.(png|jpe?g)$/i);
  });

  console.log(`\n========================================`);
  console.log(`Processing [${folderName}]: ${sourceFiles.length} original cake photographs`);
  console.log(`========================================`);

  const inventory = [];

  for (const filename of sourceFiles) {
    const srcPath = path.join(sourceDir, filename);
    const backupPath = path.join(backupDir, filename);

    // 1. Ensure pristine backup exists
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
      console.log(`  [BACKUP] Preserved pristine source: ${backupPath}`);
    }

    // Always process from the untouched pristine backup
    const meta = await sharp(backupPath).metadata();
    const { cornerBrightness, midBrightness } = await analyzeLuminance(backupPath, meta.width, meta.height);
    const watermarkSvg = createWatermarkSvg(meta.width, meta.height, cornerBrightness, midBrightness);

    // 2. Generate Watermarked Full-Resolution Primary Asset
    const baseExt = path.extname(filename).toLowerCase();
    const baseName = filename.replace(/\.[^/.]+$/, '');

    // Watermarked compositing buffer
    const watermarkedBuffer = await sharp(backupPath)
      .composite([{ input: watermarkSvg, top: 0, left: 0 }])
      .toBuffer();

    // Overwrite public primary file with watermarked high-res asset
    if (baseExt === '.png') {
      await sharp(watermarkedBuffer)
        .png({ quality: 95, compressionLevel: 8 })
        .toFile(srcPath);
    } else if (baseExt === '.jpg' || baseExt === '.jpeg') {
      await sharp(watermarkedBuffer)
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(srcPath);
    } else if (baseExt === '.webp') {
      await sharp(watermarkedBuffer)
        .webp({ quality: 90 })
        .toFile(srcPath);
    }

    // 3. Generate Watermarked Full-Size WebP Derivative (max 1200w)
    const webpPath = path.join(sourceDir, `${baseName}.webp`);
    let fullWebp = sharp(watermarkedBuffer);
    if (meta.width > 1200) {
      fullWebp = fullWebp.resize(1200, null, { fit: 'inside' });
    }
    await fullWebp.webp({ quality: 88 }).toFile(webpPath);

    // 4. Generate Watermarked Responsive Card WebP Derivative (max 600w)
    const cardWebpPath = path.join(sourceDir, `${baseName}-card.webp`);
    await sharp(watermarkedBuffer)
      .resize(600, null, { fit: 'inside' })
      .webp({ quality: 82 })
      .toFile(cardWebpPath);

    const stats = fs.statSync(srcPath);
    const webpStats = fs.statSync(webpPath);
    const cardStats = fs.statSync(cardWebpPath);

    console.log(`  ✓ Dual-Watermarked: ${filename} (${meta.width}x${meta.height}) | Corner: ${cornerBrightness}, Mid: ${midBrightness} | Primary: ${Math.round(stats.size/1024)}KB | WebP: ${Math.round(webpStats.size/1024)}KB | Card: ${Math.round(cardStats.size/1024)}KB`);

    inventory.push({
      folder: folderName,
      filename,
      width: meta.width,
      height: meta.height,
      cornerBrightness,
      midBrightness,
      backupPath,
      publicPath: srcPath,
      webpPath,
      cardWebpPath,
      primarySizeKB: Math.round(stats.size/1024),
      webpSizeKB: Math.round(webpStats.size/1024),
      cardSizeKB: Math.round(cardStats.size/1024)
    });
  }

  return inventory;
}

async function main() {
  console.log('Starting GoodNews Cake and Catering Dual-Zone Watermark Pipeline...');
  const cakesInv = await processFolder('cakes');
  const seasonalInv = await processFolder('seasonal');
  
  const fullInventory = [...cakesInv, ...seasonalInv];
  const invPath = path.join(__dirname, '../originals/watermark-inventory.json');
  fs.writeFileSync(invPath, JSON.stringify(fullInventory, null, 2));
  console.log(`\nInventory successfully written to ${invPath}`);
  console.log(`Total Cake Photographs Dual-Watermarked: ${fullInventory.length}`);
}

main().catch(console.error);
