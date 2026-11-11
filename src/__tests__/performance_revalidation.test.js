const fs = require('fs');
const path = require('path');

describe('Performance Revalidation (Phase 3)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('PERF-001: Image assets footprint is reduced by >70% from 193.7MB baseline', () => {
    const imagesDir = path.join(rootDir, 'public', 'images');
    expect(fs.existsSync(imagesDir)).toBe(true);

    let totalBytes = 0;
    let fileCount = 0;
    const largeFiles = [];

    function scanDir(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(item)) {
          totalBytes += stat.size;
          fileCount++;
          if (stat.size > 2 * 1024 * 1024) { // Larger than 2MB
            largeFiles.push({ file: item, sizeMb: (stat.size / 1024 / 1024).toFixed(2) });
          }
        }
      }
    }

    scanDir(imagesDir);

    const totalMb = totalBytes / 1024 / 1024;

    // Must be under 50MB (baseline was 193.7MB)
    expect(totalMb).toBeLessThan(50);

    // No asset should be over 2MB
    expect(largeFiles).toEqual([]);
    expect(fileCount).toBeGreaterThan(50);
  });

  test('PERF-002: App.js implements route-based code splitting with React.lazy', () => {
    const appFile = fs.readFileSync(path.join(rootDir, 'src', 'App.js'), 'utf8');

    expect(appFile).toContain('lazy(');
    expect(appFile).toContain('Suspense');
    expect(appFile).toContain("lazy(() => import('./pages/admin/ProductManagement'))");
    expect(appFile).toContain("lazy(() => import('./pages/Gallery'))");
  });

  test('PERF-003: Catalog views use native loading="lazy" and decoding="async"', () => {
    const catalogFiles = [
      'Gallery.jsx',
      'Seasonal.jsx',
      'Cupcakes.jsx',
      'Cookies.jsx',
      'Catering.jsx'
    ];

    catalogFiles.forEach(file => {
      const content = fs.readFileSync(path.join(rootDir, 'src', 'pages', file), 'utf8');
      expect(content).toContain('loading="lazy"');
      expect(content).toContain('decoding="async"');
    });
  });
});
