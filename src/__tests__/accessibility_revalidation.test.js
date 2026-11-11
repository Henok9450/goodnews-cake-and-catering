const fs = require('fs');
const path = require('path');

describe('Accessibility & WCAG 2.2 AA Revalidation (Phase 3)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('A11Y-001: CheckoutPage has strict htmlFor/id associations for all form fields', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CheckoutPage.jsx'), 'utf8');

    const expectedBindings = [
      'checkout-name',
      'checkout-phone',
      'checkout-email',
      'checkout-event-date',
      'checkout-delivery-time',
      'checkout-address',
      'checkout-notes'
    ];

    expectedBindings.forEach(id => {
      expect(file).toContain(`htmlFor="${id}"`);
      expect(file).toContain(`id="${id}"`);
    });
  });

  test('A11Y-002: CustomOrder has htmlFor/id associations for all wizard fields', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CustomOrder.jsx'), 'utf8');

    const expectedBindings = [
      'custom-cake-type',
      'custom-cake-size',
      'custom-flavor',
      'custom-filling',
      'custom-frosting',
      'custom-theme',
      'custom-colors',
      'custom-message',
      'custom-special-requests'
    ];

    expectedBindings.forEach(id => {
      expect(file).toContain(`htmlFor="${id}"`);
      expect(file).toContain(`id="${id}"`);
    });
  });

  test('A11Y-003: Reviews page has accessible rating star buttons and input associations', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Reviews.jsx'), 'utf8');

    expect(file).toContain('aria-label={`${star} star${star > 1 ? \'s\' : \'\'}`}');
    expect(file).toContain('htmlFor="review-name"');
    expect(file).toContain('id="review-name"');
    expect(file).toContain('htmlFor="review-comment"');
    expect(file).toContain('id="review-comment"');
  });

  test('A11Y-004: TrackOrder page has accessible search input labeling', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'TrackOrder.jsx'), 'utf8');

    expect(file).toContain('htmlFor="track-order-number"');
    expect(file).toContain('id="track-order-number"');
    expect(file).toContain('aria-label="Enter order tracking number"');
  });

  test('A11Y-005: AdminLogin has htmlFor/id bindings and aria-label on password toggles', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'admin', 'AdminLogin.jsx'), 'utf8');

    expect(file).toContain('htmlFor="admin-email"');
    expect(file).toContain('id="admin-email"');
    expect(file).toContain('htmlFor="admin-password"');
    expect(file).toContain('id="admin-password"');
    expect(file).toContain("aria-label={showPassword ? 'Hide password' : 'Show password'}");
  });

  test('A11Y-006: Admin modals have role="dialog", aria-modal="true", and Escape key handlers', () => {
    const adminPages = [
      'ProductManagement.jsx',
      'CategoryManagement.jsx',
      'ServiceManagement.jsx',
      'PromotionManagement.jsx'
    ];

    adminPages.forEach(page => {
      const content = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'admin', page), 'utf8');
      expect(content).toContain('role="dialog"');
      expect(content).toContain('aria-modal="true"');
      expect(content).toContain('aria-labelledby=');
      expect(content).toContain("e.key === 'Escape'");
      expect(content).toContain('aria-label="Close dialog"');
    });
  });

  test('A11Y-007: PublicLayout floating WhatsApp button has explicit accessible name', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'PublicLayout.jsx'), 'utf8');
    expect(file).toContain('aria-label="Order via WhatsApp on +251917559943"');
  });
});
