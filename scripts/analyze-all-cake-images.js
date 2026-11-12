const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function analyzeCakeImages() {
  const folders = ['cakes', 'seasonal'];
  const cakeFiles = [];

  for (const folder of folders) {
    const fullDir = path.join(__dirname, '../public/images', folder);
    const files = fs.readdirSync(fullDir);
    for (const f of files) {
      // Exclude pre-existing derivatives
      if (f.includes('-card.') || f.endsWith('.webp')) continue;
      const filePath = path.join(fullDir, f);
      const meta = await sharp(filePath).metadata();
      const stats = await sharp(filePath).stats();
      // Calculate average brightness
      const avgBrightness = stats.channels.slice(0, 3).reduce((acc, c) => acc + c.mean, 0) / 3;

      cakeFiles.push({
        folder,
        filename: f,
        filePath,
        width: meta.width,
        height: meta.height,
        aspectRatio: (meta.width / meta.height).toFixed(2),
        channels: meta.channels,
        hasAlpha: meta.hasAlpha,
        format: meta.format,
        brightness: Math.round(avgBrightness)
      });
    }
  }

  console.log(`Identified ${cakeFiles.length} original cake photographs.`);
  console.log('\n--- Cakes Folder (', cakeFiles.filter(c => c.folder === 'cakes').length, ') ---');
  cakeFiles.filter(c => c.folder === 'cakes').forEach(c => {
    console.log(`  ${c.filename} | ${c.width}x${c.height} | AR: ${c.aspectRatio} | Brightness: ${c.brightness}`);
  });

  console.log('\n--- Seasonal Folder (', cakeFiles.filter(c => c.folder === 'seasonal').length, ') ---');
  cakeFiles.filter(c => c.folder === 'seasonal').forEach(c => {
    console.log(`  ${c.filename} | ${c.width}x${c.height} | AR: ${c.aspectRatio} | Brightness: ${c.brightness}`);
  });

  // Also check if any .webp in cakes has no corresponding source file
  const cakeDir = path.join(__dirname, '../public/images/cakes');
  const allCakeFiles = fs.readdirSync(cakeDir);
  const webpOnly = allCakeFiles.filter(f => f.endsWith('.webp') && !f.includes('-card.') && !fs.existsSync(path.join(cakeDir, f.replace(/\.webp$/, '.png'))) && !fs.existsSync(path.join(cakeDir, f.replace(/\.webp$/, '.jpg'))));
  console.log('\nWebP-only in cakes:', webpOnly);
}

analyzeCakeImages().catch(console.error);
