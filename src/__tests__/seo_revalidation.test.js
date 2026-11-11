const fs = require('fs');
const path = require('path');

describe('SEO Revalidation (Phase 3)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('SEO-001: index.html has localized title, meta description, and Schema.org markup', () => {
    const indexPath = path.join(rootDir, 'public', 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
    const html = fs.readFileSync(indexPath, 'utf8');

    // Title must NOT be default React App
    expect(html).not.toContain('<title>React App</title>');
    expect(html).toContain('GoodNews Cake & Catering');
    expect(html).toContain('Addis Ababa');

    // Description must be present
    expect(html).toMatch(/<meta\s+name=["']description["']\s+content=["'][^"']*Addis Ababa/i);

    // OpenGraph tags
    expect(html).toContain('og:title');
    expect(html).toContain('og:description');
    expect(html).toContain('og:image');

    // Schema.org JSON-LD
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type": "Bakery"');
    expect(html).toContain('"addressCountry": "ET"');
    expect(html).toContain('"telephone": "+251917559943"');
  });

  test('SEO-002: sitemap.xml exists, is valid XML, and contains all canonical routes', () => {
    const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const canonicalRoutes = [
      'https://goodnews-cake-and-catering.vercel.app/',
      'https://goodnews-cake-and-catering.vercel.app/gallery',
      'https://goodnews-cake-and-catering.vercel.app/custom-order',
      'https://goodnews-cake-and-catering.vercel.app/catering',
      'https://goodnews-cake-and-catering.vercel.app/seasonal',
      'https://goodnews-cake-and-catering.vercel.app/cupcakes',
      'https://goodnews-cake-and-catering.vercel.app/cookies',
      'https://goodnews-cake-and-catering.vercel.app/reviews',
      'https://goodnews-cake-and-catering.vercel.app/about'
    ];

    canonicalRoutes.forEach(route => {
      expect(sitemap).toContain(`<loc>${route}</loc>`);
    });
  });

  test('SEO-003: robots.txt declares Sitemap directive and protects private routes', () => {
    const robotsPath = path.join(rootDir, 'public', 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);
    const robots = fs.readFileSync(robotsPath, 'utf8');

    expect(robots).toContain('Sitemap: https://goodnews-cake-and-catering.vercel.app/sitemap.xml');
    expect(robots).toContain('Disallow: /admin');
    expect(robots).toContain('Disallow: /cart');
    expect(robots).toContain('Disallow: /track');
  });

  test('SEO-004: Vercel rewrite configuration bypasses static assets and sitemap', () => {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

    const rewrite = config.rewrites.find(r => r.destination === '/index.html');
    expect(rewrite).toBeDefined();

    // Verify regex excludes xml, json, images, and static files
    const regex = new RegExp(`^${rewrite.source}$`);
    expect(regex.test('/sitemap.xml')).toBe(false);
    expect(regex.test('/robots.txt')).toBe(false);
    expect(regex.test('/images/cakes/cake1.webp')).toBe(false);
    expect(regex.test('/gallery')).toBe(true);
    expect(regex.test('/custom-order')).toBe(true);
  });
});
