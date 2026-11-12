import { 
  calculateOrderStatus, 
  getOrderLeadTimeHours, 
  getFreshnessAssurance, 
  getStatusBadgeStyle,
  parseDeliveryDate
} from '../utils/statusUtils';

describe('Order Lifecycle, Live Tracking & Freshness Optimization Suite', () => {

  describe('Scenario A: Four Days Before Delivery (Freshness Guard)', () => {
    test('strictly displays Scheduled for Preparation and NEVER Baking for future deliveries', () => {
      const now = new Date('2026-11-12T16:00:00');
      // Mock Date.now or construct order 4 days away
      const futureOrder = {
        orderNumber: 'GN-202611-1601',
        createdAt: { seconds: Math.floor(new Date('2026-11-12T10:00:00').getTime() / 1000) },
        eventDate: '2026-11-16',
        deliveryTime: '14:00',
        status: 'Confirmed',
        items: [{ title: 'Classic Chocolate Birthday Cake', details: { size: '8 inch' } }]
      };

      const computedStatus = calculateOrderStatus(futureOrder);
      expect(computedStatus).toBe('Scheduled for Preparation');
      expect(computedStatus).not.toBe('Baking');
      expect(computedStatus).not.toBe('Decorating');
      expect(computedStatus).not.toBe('Ready');

      const message = getFreshnessAssurance(futureOrder, computedStatus);
      expect(message).toContain('Freshness Guarantee');
      expect(message).toContain('closer to your delivery date');
    });
  });

  describe('Scenario B: Baking Genuinely Starts', () => {
    test('displays Baking when staff explicitly logs baking in kitchen', () => {
      const bakingOrder = {
        orderNumber: 'GN-202611-1602',
        eventDate: '2026-11-16',
        deliveryTime: '14:00',
        manualStatus: 'Baking'
      };

      expect(calculateOrderStatus(bakingOrder)).toBe('Baking');
      const message = getFreshnessAssurance(bakingOrder, 'Baking');
      expect(message).toContain('Fresh Baking');
      expect(message).toContain('oven');
    });
  });

  describe('Scenario C: Cake is Being Decorated', () => {
    test('displays Decorating when layers are cooling and icing begins', () => {
      const decoratingOrder = {
        orderNumber: 'GN-202611-1603',
        eventDate: '2026-11-16',
        deliveryTime: '14:00',
        manualStatus: 'Decorating'
      };

      expect(calculateOrderStatus(decoratingOrder)).toBe('Decorating');
      const message = getFreshnessAssurance(decoratingOrder, 'Decorating');
      expect(message).toContain('Artisanal Crafting');
      expect(message).toContain('frosting');
    });
  });

  describe('Scenario D: Cake is Ready', () => {
    test('displays Ready for Delivery when quality check passes', () => {
      const readyOrder = {
        orderNumber: 'GN-202611-1604',
        eventDate: '2026-11-16',
        deliveryTime: '14:00',
        manualStatus: 'Ready'
      };

      expect(calculateOrderStatus(readyOrder)).toBe('Ready');
      const message = getFreshnessAssurance(readyOrder, 'Ready');
      expect(message).toContain('Quality Approved');
      expect(message).toContain('ready for transport');
    });
  });

  describe('Scenario E: Out for Delivery', () => {
    test('displays Out for Delivery when courier takes order', () => {
      const transitOrder = {
        orderNumber: 'GN-202611-1605',
        manualStatus: 'Out for Delivery'
      };

      expect(calculateOrderStatus(transitOrder)).toBe('Out for Delivery');
      const message = getFreshnessAssurance(transitOrder, 'Out for Delivery');
      expect(message).toContain('On the Way');
    });
  });

  describe('Scenario F: Delivery Completed', () => {
    test('preserves terminal Delivered status and displays celebratory message', () => {
      const deliveredOrder = {
        orderNumber: 'GN-202611-1606',
        status: 'Delivered'
      };

      expect(calculateOrderStatus(deliveredOrder)).toBe('Delivered');
      const message = getFreshnessAssurance(deliveredOrder, 'Delivered');
      expect(message).toContain('Delivered with Joy');
    });
  });

  describe('Scenario G: Different Cake Complexity (Lead-Time Variance)', () => {
    test('multi-tier wedding cake requires 72 hours lead time', () => {
      const weddingOrder = {
        items: [
          { title: 'Habesha Traditional 3-Tier Wedding Cake', details: { tiers: 3 } }
        ]
      };
      expect(getOrderLeadTimeHours(weddingOrder)).toBe(72);
    });

    test('custom sculpted fondant cake requires 48 hours lead time', () => {
      const customFondantOrder = {
        items: [
          { title: 'Custom Sculpted Character Cake', details: { frosting: 'Fondant' } }
        ]
      };
      expect(getOrderLeadTimeHours(customFondantOrder)).toBe(48);
    });

    test('standard birthday sponge cake requires 24 hours lead time', () => {
      const standardOrder = {
        items: [
          { title: 'Vanilla Sponge Birthday Cake', details: { size: '10 inch' } }
        ]
      };
      expect(getOrderLeadTimeHours(standardOrder)).toBe(24);
    });
  });

  describe('Scenario H: Exceptional Statuses (Cancelled & Delayed)', () => {
    test('preserves terminal Cancelled status with clear customer guidance', () => {
      const cancelledOrder = {
        orderNumber: 'GN-202611-1607',
        status: 'Cancelled'
      };
      expect(calculateOrderStatus(cancelledOrder)).toBe('Cancelled');
      const message = getFreshnessAssurance(cancelledOrder, 'Cancelled');
      expect(message).toContain('Order Cancelled');
      expect(message).toContain('WhatsApp');
    });
  });

  describe('Scenario I: Date & Timezone Parsing Integrity', () => {
    test('safely parses standard eventDate and deliveryTime', () => {
      const order = { eventDate: '2026-11-16', deliveryTime: '15:30' };
      const parsed = parseDeliveryDate(order);
      expect(parsed).not.toBeNull();
      expect(parsed.getFullYear()).toBe(2026);
      expect(parsed.getMonth()).toBe(10); // November is index 10
      expect(parsed.getDate()).toBe(16);
    });

    test('handles missing or malformed dates without throwing exceptions', () => {
      expect(calculateOrderStatus({})).toBe('Received');
      expect(calculateOrderStatus({ status: 'Pending' })).toBe('Pending');
      expect(calculateOrderStatus({ eventDate: 'invalid-date' })).toBe('Received');
    });
  });

  describe('Status Badge Styling Verification', () => {
    test('generates distinctive CSS classes for all lifecycle states', () => {
      expect(getStatusBadgeStyle({}, 'Received')).toContain('animate-pulse');
      expect(getStatusBadgeStyle({}, 'Confirmed')).toContain('bg-blue-100');
      expect(getStatusBadgeStyle({}, 'Scheduled for Preparation')).toContain('bg-amber-100');
      expect(getStatusBadgeStyle({}, 'Preparation Started')).toContain('bg-yellow-100');
      expect(getStatusBadgeStyle({}, 'Baking')).toContain('bg-orange-100');
      expect(getStatusBadgeStyle({}, 'Decorating')).toContain('bg-purple-100');
      expect(getStatusBadgeStyle({}, 'Ready')).toContain('bg-primary-100');
      expect(getStatusBadgeStyle({}, 'Out for Delivery')).toContain('bg-indigo-100');
      expect(getStatusBadgeStyle({}, 'Delivered')).toContain('bg-green-100');
      expect(getStatusBadgeStyle({}, 'Cancelled')).toContain('bg-red-100');
    });
  });

});
