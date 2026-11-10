const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Disable Sharp cache to prevent file locking on Windows
sharp.cache(false);

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const SIZE_THRESHOLD_BYTES = 200 * 1024; // 200KB

function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllImageFiles(fullPath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        fileList.push({ path: fullPath, size: stat.size, ext });
      }
    }
  }
  return fileList;
}

async function optimizeImages() {
  console.log('🔍 Scanning public/images for oversized assets...');
  const allImages = getAllImageFiles(IMAGES_DIR);
  const oversized = allImages.filter(img => img.size > SIZE_THRESHOLD_BYTES);
  console.log(`Found ${allImages.length} total images, ${oversized.length} above 200KB threshold.`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const img of oversized) {
    totalOriginal += img.size;

    try {
      const inputBuffer = fs.readFileSync(img.path);
      let pipeline = sharp(inputBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        });

      if (img.ext === '.png') {
        pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
      } else if (img.ext === '.jpg' || img.ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
      } else if (img.ext === '.webp') {
        pipeline = pipeline.webp({ quality: 82 });
      }

      const outputBuffer = await pipeline.toBuffer();

      if (outputBuffer.length < img.size) {
        fs.writeFileSync(img.path, outputBuffer);
        totalOptimized += outputBuffer.length;
        const saved = ((img.size - outputBuffer.length) / (1024 * 1024)).toFixed(2);
        console.log(`✅ Compressed ${path.basename(img.path)}: ${(img.size / 1024).toFixed(0)}KB -> ${(outputBuffer.length / 1024).toFixed(0)}KB (saved ${saved}MB)`);
      } else {
        totalOptimized += img.size;
        console.log(`⏩ Keeping original ${path.basename(img.path)}`);
      }
    } catch (err) {
      console.warn(`⚠️ Skipped ${path.basename(img.path)}: ${err.message}`);
      totalOptimized += img.size;
    }
  }

  const origMB = (totalOriginal / (1024 * 1024)).toFixed(1);
  const optMB = (totalOptimized / (1024 * 1024)).toFixed(1);
  const savedMB = ((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(1);
  const percent = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1);

  console.log('\n========================================');
  console.log(`🎉 Optimization Complete!`);
  console.log(`Original Size: ${origMB} MB`);
  console.log(`Optimized Size: ${optMB} MB`);
  console.log(`Total Bandwidth Saved: ${savedMB} MB (${percent}% reduction)`);
  console.log('========================================');
}

optimizeImages().catch(console.error);
