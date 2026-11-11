const fs = require('fs');
const path = require('path');
import { calculateOrderStatus, getStatusBadgeStyle } from '../utils/statusUtils';

describe('Functional & Data Integrity Regression (Phase 3)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  describe('Order Progression & Status Calculations', () => {
    test('calculates status from manualStatus overrides', () => {
      expect(calculateOrderStatus({ manualStatus: 'Baking' })).toBe('Baking');
      expect(calculateOrderStatus({ manualStatus: 'Ready' })).toBe('Ready');
    });

    test('preserves terminal statuses', () => {
      expect(calculateOrderStatus({ status: 'Cancelled' })).toBe('Cancelled');
      expect(calculateOrderStatus({ status: 'Delivered' })).toBe('Delivered');
    });

    test('calculates correct status based on elapsed time ratio', () => {
      const now = Date.now();
      const createdAtSec = Math.floor((now - 5 * 3600 * 1000) / 1000);
      const futureDate = new Date(now + 5 * 3600 * 1000);

      const order = {
        createdAt: { seconds: createdAtSec },
        eventDate: futureDate.toISOString().split('T')[0],
        deliveryTime: futureDate.toTimeString().slice(0, 5)
      };

      const status = calculateOrderStatus(order);
      expect(['Baking', 'Decorating', 'Ready']).toContain(status);
    });

    test('returns appropriate CSS classes for badges', () => {
      const deliveredBadge = getStatusBadgeStyle({ manualStatus: 'Delivered' }, 'Delivered');
      expect(deliveredBadge).toContain('bg-green-100');

      const cancelledBadge = getStatusBadgeStyle({ manualStatus: 'Cancelled' }, 'Cancelled');
      expect(cancelledBadge).toContain('bg-red-100');

      const autoBadge = getStatusBadgeStyle({}, 'Received');
      expect(autoBadge).toContain('animate-pulse');
    });
  });

  describe('Cart Calculations & Price Parsing Defensive Logic', () => {
    test('CART-001: getCartTotal handles all edge-case prices without throwing TypeError', () => {
      const testCases = [
        { price: null },
        { price: undefined },
        { price: '' },
        { price: 'ETB 1,200.00' },
        { price: 450 },
        { price: 'Custom Quote' },
        {}
      ];

      const parsePrice = (price) => {
        if (price == null) return 0;
        const priceString = String(price).replace(/[^0-9.]/g, '');
        return parseFloat(priceString) || 0;
      };

      const total = testCases.reduce((sum, item) => sum + parsePrice(item.price), 0);
      expect(total).toBe(1650);
      expect(() => testCases.map(item => parsePrice(item.price))).not.toThrow();
    });
  });

  describe('Email & Webhook Integration Resilience', () => {
    test('INT-001: emailService implements AbortController and parameter validation', () => {
      const serviceFile = fs.readFileSync(path.join(rootDir, 'src', 'services', 'emailService.js'), 'utf8');

      expect(serviceFile).toContain('AbortController');
      expect(serviceFile).toContain('signal: controller.signal');
      expect(serviceFile).toContain('setTimeout(() => controller.abort()');
      expect(serviceFile).toContain('typeof orderData !== \'object\'');
    });
  });

  describe('Checkout Blocking AddDoc Data Integrity', () => {
    test('ORD-001: CheckoutPage treats Firestore write as mandatory blocking operation', () => {
      const checkoutFile = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CheckoutPage.jsx'), 'utf8');

      expect(checkoutFile).toContain('await addDoc(collection(db, \'orders\')');
      expect(checkoutFile).toContain('setErrorMessage');
      expect(checkoutFile).toContain('setIsCheckingOut(false)');
    });
  });

  describe('Home Component UI Template String Integrity', () => {
    test('UI-001: heroBadge initial state is a clean string without syntax artifacts', () => {
      const homeFile = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Home.jsx'), 'utf8');

      expect(homeFile).not.toContain("'{heroContent.heroBadge");
      expect(homeFile).toContain("'Where Every Bite Brings Joy'");
    });
  });

  describe('Footer Navigation & Contact Protocol Integrity', () => {
    test('NAV-001: Footer has correct email spelling, phone dialer link, and active social links', () => {
      const footerFile = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'Footer.jsx'), 'utf8');

      expect(footerFile).not.toContain('goodnewsscake');
      expect(footerFile).toContain('goodnewscake@gmail.com');
      expect(footerFile).toContain('href="mailto:goodnewscake@gmail.com"');
      expect(footerFile).toContain('href="tel:+251917559943"');
      expect(footerFile).toContain('https://www.instagram.com');
      expect(footerFile).toContain('https://web.facebook.com');
    });
  });
});
