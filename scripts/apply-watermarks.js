const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WATERMARK_TEXT = 'GoodNews Cake and Catering';

/**
 * Creates an SVG watermark buffer tailored for the given dimensions and corner brightness.
 */
function createWatermarkSvg(width, height, cornerBrightness = 150) {
  const baseDim = Math.min(width, height);
  const fontSize = Math.max(14, Math.min(26, Math.round(baseDim * 0.024)));
  
  const marginRight = Math.max(18, Math.min(36, Math.round(width * 0.035)));
  const marginBottom = Math.max(18, Math.min(36, Math.round(height * 0.035)));
  
  const isLightBg = cornerBrightness > 195;
  const textColor = isLightBg ? '#0F172A' : '#FFFFFF';
  const textOpacity = isLightBg ? 0.28 : 0.30;
  const shadowColor = isLightBg ? '#FFFFFF' : '#000000';
  const shadowOpacity = isLightBg ? 0.40 : 0.35;

  const textX = width - marginRight;
  const textY = height - marginBottom;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="wm-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0.5" dy="1.0" stdDeviation="1.0" flood-color="${shadowColor}" flood-opacity="${shadowOpacity}"/>
      </filter>
    </defs>
    <style>
      .wm-text {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${fontSize}px;
        font-weight: 600;
        letter-spacing: 0.10em;
        fill: ${textColor};
        fill-opacity: ${textOpacity};
        filter: url(#wm-shadow);
      }
    </style>
    <text x="${textX}" y="${textY}" text-anchor="end" class="wm-text">
      ${WATERMARK_TEXT}
    </text>
  </svg>
  `;

  return Buffer.from(svg.trim());
}

async function analyzeCornerBrightness(imagePath, width, height) {
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
    
    return Math.round(corner.channels.slice(0, 3).reduce((acc, c) => acc + c.mean, 0) / 3);
  } catch (e) {
    return 150; // default mid-tone
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

    // 1. Permanent Pristine Backup
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
      console.log(`  [BACKUP] Preserved pristine source: ${backupPath}`);
    }

    // Always process from the untouched pristine backup
    const meta = await sharp(backupPath).metadata();
    const cornerBrightness = await analyzeCornerBrightness(backupPath, meta.width, meta.height);
    const watermarkSvg = createWatermarkSvg(meta.width, meta.height, cornerBrightness);

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

    console.log(`  ✓ Watermarked: ${filename} (${meta.width}x${meta.height}) | Corner Brightness: ${cornerBrightness} | Primary: ${Math.round(stats.size/1024)}KB | WebP: ${Math.round(webpStats.size/1024)}KB | Card: ${Math.round(cardStats.size/1024)}KB`);

    inventory.push({
      folder: folderName,
      filename,
      width: meta.width,
      height: meta.height,
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
  console.log('Starting GoodNews Cake and Catering Watermark Pipeline...');
  const cakesInv = await processFolder('cakes');
  const seasonalInv = await processFolder('seasonal');

  const total = cakesInv.length + seasonalInv.length;
  console.log(`\n========================================`);
  console.log(`WATERMARK PIPELINE COMPLETE!`);
  console.log(`Total Cake Photographs Watermarked: ${total}`);
  console.log(`  - Cakes Gallery: ${cakesInv.length}`);
  console.log(`  - Seasonal / Holiday Cakes: ${seasonalInv.length}`);
  console.log(`All original source files preserved in public/images/originals/`);
  console.log(`========================================`);

  // Write inventory JSON for QA reporting
  const reportPath = path.join(__dirname, '../originals/watermark-inventory.json');
  fs.writeFileSync(reportPath, JSON.stringify([...cakesInv, ...seasonalInv], null, 2));
}

main().catch(err => {
  console.error('Fatal error during watermarking:', err);
  process.exit(1);
});
