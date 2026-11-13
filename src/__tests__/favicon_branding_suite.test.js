import fs from 'fs';
import path from 'path';

describe('GoodNews Favicon & Multi-Tab Brand Recognition Suite', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const indexHtmlPath = path.join(publicDir, 'index.html');
  const manifestPath = path.join(publicDir, 'manifest.json');

  test('FAV-001: Standard and scalable favicon files exist and are non-empty', () => {
    const requiredFiles = [
      'favicon.ico',
      'favicon.svg',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'apple-touch-icon.png',
      'logo192.png',
      'logo512.png'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  test('FAV-002: PNG icons contain valid 8-byte PNG headers', () => {
    const pngFiles = [
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'apple-touch-icon.png',
      'logo192.png',
      'logo512.png'
    ];
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    pngFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      const buffer = fs.readFileSync(filePath);
      const header = buffer.subarray(0, 8);
      expect(header.equals(pngHeader)).toBe(true);
    });
  });

  test('FAV-003: favicon.svg contains SVG vector graphics with brand badge and celebration cake', () => {
    const svgPath = path.join(publicDir, 'favicon.svg');
    const content = fs.readFileSync(svgPath, 'utf8');

    expect(content).toContain('<svg');
    expect(content).toContain('viewBox=');
    // Ensure it is NOT an embedded raster base64 wrapper
    expect(content).not.toContain('image/png;base64');
    // Brand color ruby red / rose
    expect(content.toLowerCase()).toMatch(/#e11d48|#be123c|#f43f5e/);
    // Cake elements & candle flame gold
    expect(content.toLowerCase()).toMatch(/#fbbf24|#f59e0b|#d97706/);
  });

  test('FAV-004: public/index.html includes cache-busting version params on favicon links', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');

    expect(html).toMatch(/<link\s+rel="icon"[^>]+href="%PUBLIC_URL%\/favicon\.ico\?v=\d+"/);
    expect(html).toMatch(/<link\s+rel="icon"[^>]+href="%PUBLIC_URL%\/favicon\.svg\?v=\d+"/);
    expect(html).toMatch(/<link\s+rel="icon"[^>]+href="%PUBLIC_URL%\/favicon-32x32\.png\?v=\d+"/);
    expect(html).toMatch(/<link\s+rel="icon"[^>]+href="%PUBLIC_URL%\/favicon-16x16\.png\?v=\d+"/);
  });

  test('FAV-005: public/index.html theme-color matches GoodNews brand ruby red', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    expect(html).toContain('<meta name="theme-color" content="#e11d48" />');
  });

  test('FAV-006: public/index.html default title places brand name first for multi-tab clarity', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    expect(titleMatch).not.toBeNull();
    const title = titleMatch[1];
    expect(title.startsWith('GoodNews Cake & Catering')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(65);
    expect(title.length).toBeGreaterThanOrEqual(30);
  });

  test('FAV-007: public/manifest.json references correct theme_color and valid icon entries', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.theme_color).toBe('#e11d48');
    expect(Array.isArray(manifest.icons)).toBe(true);
    const has192 = manifest.icons.some(i => i.sizes === '192x192' || i.sizes.includes('192x192'));
    const has512 = manifest.icons.some(i => i.sizes === '512x512' || i.sizes.includes('512x512'));
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });
});
