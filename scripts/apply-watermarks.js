const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WATERMARK_TEXT = 'GoodNews Cake and Catering';

/**
 * Creates an SVG watermark buffer tailored for the given dimensions and luminance.
 * Implements 360-DEGREE CROP-PROOF PROTECTION:
 * 1. Center Core Diagonal Ribbon (at 50%, 50% - impossible to crop from top, bottom, or sides!)
 * 2. Secondary Upper Diagonal Ribbon (at y ~ 28%)
 * 3. Secondary Lower Diagonal Ribbon (at y ~ 72%)
 * 4. Bottom-Right Brand Signature
 */
function createCropProofWatermarkSvg(width, height, centerBrightness = 150, cornerBrightness = 150) {
  const baseDim = Math.min(width, height);
  
  // Adaptive colors for Center / Diagonal ribbons
  const isCenterLight = centerBrightness > 195;
  const centerTextColor = isCenterLight ? '#0F172A' : '#FFFFFF';
  const centerTextOpacity = isCenterLight ? 0.20 : 0.22;
  const centerShadowColor = isCenterLight ? '#FFFFFF' : '#000000';
  const centerShadowOpacity = isCenterLight ? 0.35 : 0.30;

  // Adaptive colors for Secondary ribbons
  const subTextOpacity = isCenterLight ? 0.14 : 0.16;

  // Adaptive colors for Corner signature
  const isCornerLight = cornerBrightness > 195;
  const cornerTextColor = isCornerLight ? '#0F172A' : '#FFFFFF';
  const cornerTextOpacity = isCornerLight ? 0.28 : 0.30;
  const cornerShadowColor = isCornerLight ? '#FFFFFF' : '#000000';
  const cornerShadowOpacity = isCornerLight ? 0.40 : 0.35;

  // Font sizing
  const centerFontSize = Math.max(18, Math.min(32, Math.round(baseDim * 0.028)));
  const subFontSize = Math.max(14, Math.min(24, Math.round(baseDim * 0.022)));
  const cornerFontSize = Math.max(14, Math.min(24, Math.round(baseDim * 0.022)));

  // Center Coordinates
  const centerX = Math.round(width / 2);
  const centerY = Math.round(height / 2);
  const upperY = Math.round(height * 0.28);
  const lowerY = Math.round(height * 0.72);

  // Corner Coordinates
  const marginRight = Math.max(18, Math.min(36, Math.round(width * 0.035)));
  const marginBottom = Math.max(18, Math.min(36, Math.round(height * 0.035)));
  const cornerX = width - marginRight;
  const cornerY = height - marginBottom;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="center-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0.5" dy="1.0" stdDeviation="1.5" flood-color="${centerShadowColor}" flood-opacity="${centerShadowOpacity}"/>
      </filter>
      <filter id="corner-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0.5" dy="1.0" stdDeviation="1.0" flood-color="${cornerShadowColor}" flood-opacity="${cornerShadowOpacity}"/>
      </filter>
    </defs>
    <style>
      .wm-center {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${centerFontSize}px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        fill: ${centerTextColor};
        fill-opacity: ${centerTextOpacity};
        filter: url(#center-shadow);
      }
      .wm-sub {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${subFontSize}px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        fill: ${centerTextColor};
        fill-opacity: ${subTextOpacity};
        filter: url(#center-shadow);
      }
      .wm-corner {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${cornerFontSize}px;
        font-weight: 600;
        letter-spacing: 0.08em;
        fill: ${cornerTextColor};
        fill-opacity: ${cornerTextOpacity};
        filter: url(#corner-shadow);
      }
    </style>

    <!-- UPPER DIAGONAL RIBBON (Protects top crop) -->
    <g transform="rotate(-22, ${centerX}, ${upperY})">
      <text x="${centerX}" y="${upperY}" text-anchor="middle" class="wm-sub">
        ${WATERMARK_TEXT}
      </text>
    </g>

    <!-- CENTER CORE DIAGONAL RIBBON (Un-croppable from ANY side: Top, Bottom, Left, or Right) -->
    <g transform="rotate(-22, ${centerX}, ${centerY})">
      <text x="${centerX}" y="${centerY}" text-anchor="middle" class="wm-center">
        ${WATERMARK_TEXT}
      </text>
    </g>

    <!-- LOWER DIAGONAL RIBBON (Protects bottom & pedestal crop) -->
    <g transform="rotate(-22, ${centerX}, ${lowerY})">
      <text x="${centerX}" y="${lowerY}" text-anchor="middle" class="wm-sub">
        ${WATERMARK_TEXT}
      </text>
    </g>

    <!-- BOTTOM-RIGHT BRAND SIGNATURE -->
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

    const centerW = Math.min(400, Math.round(width * 0.50));
    const centerH = Math.min(200, Math.round(height * 0.25));
    const centerLeft = Math.max(0, Math.round((width - centerW) / 2));
    const centerTop = Math.max(0, Math.round((height - centerH) / 2));
    const center = await sharp(imagePath)
      .extract({
        left: centerLeft,
        top: centerTop,
        width: centerW,
        height: centerH
      })
      .stats();
    const centerBrightness = Math.round(center.channels.slice(0, 3).reduce((acc, c) => acc + c.mean, 0) / 3);

    return { cornerBrightness, centerBrightness };
  } catch (e) {
    return { cornerBrightness: 150, centerBrightness: 150 };
  }
}

async function processFolder(folderName) {
  const sourceDir = path.join(__dirname, '../public/images', folderName);
  const backupDir = path.join(__dirname, '../originals', folderName);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const allFiles = fs.readdirSync(sourceDir);
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
    const { cornerBrightness, centerBrightness } = await analyzeLuminance(backupPath, meta.width, meta.height);
    const watermarkSvg = createCropProofWatermarkSvg(meta.width, meta.height, centerBrightness, cornerBrightness);

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
    if (srcPath !== webpPath) {
      let fullWebp = sharp(watermarkedBuffer);
      if (meta.width > 1200) {
        fullWebp = fullWebp.resize(1200, null, { fit: 'inside' });
      }
      await fullWebp.webp({ quality: 88 }).toFile(webpPath);
    }

    // 4. Generate Watermarked Responsive Card WebP Derivative (max 600w)
    const cardWebpPath = path.join(sourceDir, `${baseName}-card.webp`);
    await sharp(watermarkedBuffer)
      .resize(600, null, { fit: 'inside' })
      .webp({ quality: 82 })
      .toFile(cardWebpPath);

    const stats = fs.statSync(srcPath);
    const webpStats = fs.statSync(webpPath);
    const cardStats = fs.statSync(cardWebpPath);

    console.log(`  ✓ Crop-Proof Watermarked: ${filename} (${meta.width}x${meta.height}) | Center: ${centerBrightness}, Corner: ${cornerBrightness} | Primary: ${Math.round(stats.size/1024)}KB | WebP: ${Math.round(webpStats.size/1024)}KB | Card: ${Math.round(cardStats.size/1024)}KB`);

    inventory.push({
      folder: folderName,
      filename,
      width: meta.width,
      height: meta.height,
      centerBrightness,
      cornerBrightness,
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
  console.log('Starting GoodNews Cake and Catering 360-Degree Crop-Proof Watermark Pipeline...');
  const cakesInv = await processFolder('cakes');
  const seasonalInv = await processFolder('seasonal');
  const cupcakesInv = await processFolder('cupcakes');
  const cookiesInv = await processFolder('cookies');
  const cateringInv = await processFolder('catering');
  
  const fullInventory = [...cakesInv, ...seasonalInv, ...cupcakesInv, ...cookiesInv, ...cateringInv];
  const invPath = path.join(__dirname, '../originals/watermark-inventory.json');
  fs.writeFileSync(invPath, JSON.stringify(fullInventory, null, 2));
  console.log(`\nInventory successfully written to ${invPath}`);
  console.log(`Total Food & Catering Photographs Crop-Proof Watermarked: ${fullInventory.length}`);
}

main().catch(console.error);
