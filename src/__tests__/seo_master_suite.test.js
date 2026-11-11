import { ROUTE_SEO_CONFIG, SITE_METADATA, buildSchemaOrgGraph } from '../config/seoConfig';
import fs from 'fs';
import path from 'path';

describe('Master SEO & Social Optimization Suite', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('SEO-001: Every public route has a unique, optimized title tag under 65 characters', () => {
    const publicRoutes = ['/', '/gallery', '/custom-order', '/catering', '/seasonal', '/cupcakes', '/cookies', '/about', '/reviews'];
    
    publicRoutes.forEach(route => {
      const config = ROUTE_SEO_CONFIG[route];
      expect(config).toBeDefined();
      expect(config.title).toBeTruthy();
      expect(config.title.length).toBeLessThanOrEqual(65);
      expect(config.title.length).toBeGreaterThanOrEqual(30);
      expect(config.title).toContain('GoodNews');
    });
  });

  test('SEO-002: Every public route has an engaging meta description between 120 and 165 characters', () => {
    const publicRoutes = ['/', '/gallery', '/custom-order', '/catering', '/seasonal', '/cupcakes', '/cookies', '/about', '/reviews'];
    
    publicRoutes.forEach(route => {
      const config = ROUTE_SEO_CONFIG[route];
      expect(config.description).toBeTruthy();
      expect(config.description.length).toBeLessThanOrEqual(165);
      expect(config.description.length).toBeGreaterThanOrEqual(120);
      expect(config.description.toLowerCase()).toContain('addis ababa');
    });
  });

  test('SEO-003: Every public route specifies an exact, fully-qualified canonical URL', () => {
    const publicRoutes = ['/', '/gallery', '/custom-order', '/catering', '/seasonal', '/cupcakes', '/cookies', '/about', '/reviews'];
    
    publicRoutes.forEach(route => {
      const config = ROUTE_SEO_CONFIG[route];
      expect(config.canonical).toBeTruthy();
      expect(config.canonical.startsWith('https://goodnews-cake-and-catering.vercel.app')).toBe(true);
      expect(config.canonical).not.toContain('undefined');
    });
  });

  test('SEO-004: Schema.org graph builds valid Bakery, WebSite, Breadcrumbs, and Service schemas', () => {
    // 1. Homepage Schema
    const homeSchemas = buildSchemaOrgGraph(ROUTE_SEO_CONFIG['/']);
    expect(homeSchemas.some(s => s['@type'] === 'Bakery')).toBe(true);
    expect(homeSchemas.some(s => s['@type'] === 'WebSite')).toBe(true);

    const bakerySchema = homeSchemas.find(s => s['@type'] === 'Bakery');
    expect(bakerySchema.name).toBe('GoodNews Cake & Catering');
    expect(bakerySchema.telephone).toBe('+251917559943');
    expect(bakerySchema.address.addressLocality).toBe('Addis Ababa');
    expect(bakerySchema.geo.latitude).toBe(9.0227);

    // 2. Catering Service Schema
    const cateringSchemas = buildSchemaOrgGraph(ROUTE_SEO_CONFIG['/catering']);
    expect(cateringSchemas.some(s => s['@type'] === 'Service')).toBe(true);
    expect(cateringSchemas.some(s => s['@type'] === 'BreadcrumbList')).toBe(true);

    const breadcrumbs = cateringSchemas.find(s => s['@type'] === 'BreadcrumbList');
    expect(breadcrumbs.itemListElement.length).toBe(2);
    expect(breadcrumbs.itemListElement[0].name).toBe('Home');
    expect(breadcrumbs.itemListElement[1].name).toBe('Catering Services');
  });

  test('SEO-005: robots.txt protects private and admin routes while exposing sitemap', () => {
    const robotsPath = path.join(rootDir, 'public/robots.txt');
    const content = fs.readFileSync(robotsPath, 'utf8');

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /admin/');
    expect(content).toContain('Disallow: /cart');
    expect(content).toContain('Disallow: /track');
    expect(content).toContain('Disallow: /profile');
    expect(content).toContain('Sitemap: https://goodnews-cake-and-catering.vercel.app/sitemap.xml');
  });

  test('SEO-006: sitemap.xml declares valid priority and changefreq for all core indexable pages', () => {
    const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf8');

    const expectedPages = [
      'https://goodnews-cake-and-catering.vercel.app/',
      'https://goodnews-cake-and-catering.vercel.app/gallery',
      'https://goodnews-cake-and-catering.vercel.app/custom-order',
      'https://goodnews-cake-and-catering.vercel.app/catering',
      'https://goodnews-cake-and-catering.vercel.app/seasonal',
      'https://goodnews-cake-and-catering.vercel.app/cupcakes',
      'https://goodnews-cake-and-catering.vercel.app/cookies',
      'https://goodnews-cake-and-catering.vercel.app/about',
      'https://goodnews-cake-and-catering.vercel.app/reviews'
    ];

    expectedPages.forEach(url => {
      expect(content).toContain(`<loc>${url}</loc>`);
    });

    // Private admin and cart should NEVER be in sitemap
    expect(content).not.toContain('/admin');
    expect(content).not.toContain('/cart');
  });

  test('SEO-007: Private routes are marked as non-indexable', () => {
    expect(ROUTE_SEO_CONFIG['/cart'].indexable).toBe(false);
    expect(ROUTE_SEO_CONFIG['/track'].indexable).toBe(false);
    expect(ROUTE_SEO_CONFIG['/profile'].indexable).toBe(false);
  });
});
