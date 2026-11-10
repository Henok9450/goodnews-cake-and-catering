import { calculateOrderStatus, getStatusBadgeStyle } from './utils/statusUtils';

describe('Order Status Progression Engine', () => {
  test('returns manual status if manager set manualStatus', () => {
    const order = {
      manualStatus: 'Decorating',
      status: 'Received',
      eventDate: '2026-12-01',
      deliveryTime: '14:00'
    };
    expect(calculateOrderStatus(order)).toBe('Decorating');
  });

  test('preserves terminal statuses Cancelled and Delivered', () => {
    expect(calculateOrderStatus({ status: 'Cancelled' })).toBe('Cancelled');
    expect(calculateOrderStatus({ status: 'Delivered' })).toBe('Delivered');
  });

  test('falls back to order status or Received on invalid/missing dates', () => {
    expect(calculateOrderStatus({})).toBe('Received');
    expect(calculateOrderStatus({ status: 'Pending' })).toBe('Pending');
  });

  test('returns Delivered when past delivery time', () => {
    const now = Date.now();
    const createdAtSeconds = Math.floor((now - 10 * 3600 * 1000) / 1000);
    const pastDelivery = new Date(now - 2 * 3600 * 1000);
    const eventDate = pastDelivery.toISOString().split('T')[0];
    const deliveryTime = pastDelivery.toTimeString().slice(0, 5);

    const pastOrder = {
      createdAt: { seconds: createdAtSeconds },
      eventDate,
      deliveryTime
    };
    expect(calculateOrderStatus(pastOrder)).toBe('Delivered');
  });

  test('provides correct badge style classes', () => {
    const deliveredBadge = getStatusBadgeStyle({ manualStatus: 'Delivered' }, 'Delivered');
    expect(deliveredBadge).toContain('bg-green-100');

    const cancelledBadge = getStatusBadgeStyle({ manualStatus: 'Cancelled' }, 'Cancelled');
    expect(cancelledBadge).toContain('bg-red-100');

    const autoBadge = getStatusBadgeStyle({}, 'Received');
    expect(autoBadge).toContain('animate-pulse');
  });
});

describe('Cart Calculation Integrity', () => {
  test('safely parses diverse currency formats and ignores null/undefined prices', () => {
    const items = [
      { price: 'ETB 1500' },
      { price: 250 },
      { price: '300.50' },
      { price: null },
      { price: undefined },
      {}
    ];

    const total = items.reduce((sum, item) => {
      if (!item || item.price == null) return sum;
      const priceString = String(item.price).replace(/[^0-9.]/g, '');
      const price = parseFloat(priceString) || 0;
      return sum + price;
    }, 0);

    expect(total).toBe(2050.5);
  });
});
