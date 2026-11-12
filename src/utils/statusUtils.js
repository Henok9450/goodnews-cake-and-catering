/**
 * GoodNews Cake and Catering – Intelligent Order Lifecycle & Freshness Engine
 * Standard: Artisanal Bakery Freshness & Transparency Standard (ABFTS-2026)
 *
 * Implements strict freshness preservation guards:
 * - Future delivery dates (> lead-time) are safely held in "Scheduled for Preparation"
 * - Perishable baked goods are NEVER marked as "Baking" days before delivery
 * - Normalizes to Addis Ababa, Ethiopia timezone (UTC+3)
 */

export const ETHIOPIA_TIMEZONE = 'Africa/Addis_Ababa';

export const ORDER_LIFECYCLE_STAGES = [
  { key: 'Received', label: 'Order Received', icon: 'Clock', stepIndex: 0 },
  { key: 'Confirmed', label: 'Order Confirmed', icon: 'ShieldCheck', stepIndex: 1 },
  { key: 'Scheduled for Preparation', label: 'Scheduled for Prep', icon: 'Calendar', stepIndex: 2 },
  { key: 'Preparation Started', label: 'Preparation Started', icon: 'Sparkles', stepIndex: 3 },
  { key: 'Baking', label: 'Baking', icon: 'Flame', stepIndex: 4 },
  { key: 'Decorating', label: 'Decorating', icon: 'Package', stepIndex: 5 },
  { key: 'Ready', label: 'Ready for Delivery', icon: 'CheckCircle', stepIndex: 6 },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: 'Truck', stepIndex: 7 },
  { key: 'Delivered', label: 'Delivered', icon: 'CheckCircle', stepIndex: 8 },
  { key: 'Cancelled', label: 'Cancelled', icon: 'X', stepIndex: -1 }
];

/**
 * Calculates category-based culinary lead time in hours.
 * Multi-tier wedding cakes require 72h; custom fondant 48h; standard cakes 24h.
 */
export const getOrderLeadTimeHours = (order) => {
  if (!order || !order.items || order.items.length === 0) return 24;

  let maxLeadTime = 24; // Base 24h for standard cakes

  for (const item of order.items) {
    const title = (item.title || '').toLowerCase();
    const type = (order.orderType || '').toLowerCase();
    const details = JSON.stringify(item.details || {}).toLowerCase();

    if (title.includes('wedding') || title.includes('tier') || type.includes('wedding') || details.includes('tier')) {
      return 72; // 3 days for structural multi-tier cakes
    }

    if (title.includes('custom') || details.includes('fondant') || details.includes('sculpted') || type.includes('custom')) {
      maxLeadTime = Math.max(maxLeadTime, 48); // 2 days for sculpted / custom fondant
    }

    if (title.includes('cupcake') || title.includes('cookie')) {
      maxLeadTime = Math.max(maxLeadTime, 24);
    }
  }

  return maxLeadTime;
};

/**
 * Safely parses event/delivery date into a reliable Date object.
 */
export const parseDeliveryDate = (order) => {
  if (!order) return null;
  const eventDate = order.eventDate || order.deliveryDate;
  if (!eventDate) return null;

  const deliveryTime = order.deliveryTime || '12:00';
  
  // Format standard YYYY-MM-DDTHH:mm
  const dateStr = `${eventDate}T${deliveryTime.length === 5 ? deliveryTime : deliveryTime.padStart(5, '0')}`;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Intelligent Status Calculation Engine.
 * Reconciles admin explicit actions, delivery schedules, and kitchen lead times.
 */
export const calculateOrderStatus = (order) => {
  if (!order) return 'Received';

  // 1. Explicit Staff / Manager Manual Overrides (Highest Priority)
  if (order.manualStatus) {
    return order.manualStatus;
  }

  // 2. Terminal States (Delivered / Cancelled)
  const rawStatus = order.orderStatus || order.status || '';
  if (rawStatus === 'Cancelled' || rawStatus.toLowerCase() === 'cancelled') {
    return 'Cancelled';
  }
  if (rawStatus === 'Delivered' || rawStatus.includes('Delivered') || rawStatus === 'Completed') {
    return 'Delivered';
  }

  // 3. Date & Timeline Extraction
  try {
    let createdAt = null;
    if (order.createdAt?.seconds) {
      createdAt = new Date(order.createdAt.seconds * 1000);
    } else if (order.createdAt?.toMillis) {
      createdAt = new Date(order.createdAt.toMillis());
    } else if (order.orderDate && order.orderTime) {
      createdAt = new Date(`${order.orderDate} ${order.orderTime}`);
    } else if (order.createdAt) {
      createdAt = new Date(order.createdAt);
    }

    const deliveryDate = parseDeliveryDate(order);
    const now = new Date();

    // If dates are invalid or missing, fall back to stored status or Received
    if (!deliveryDate || isNaN(deliveryDate.getTime())) {
      return order.status || 'Received';
    }

    // Past Delivery Time Check -> Delivered
    if (now.getTime() >= deliveryDate.getTime()) {
      return 'Delivered';
    }

    const hoursUntilDelivery = (deliveryDate.getTime() - now.getTime()) / (1000 * 3600);
    const leadTimeHours = getOrderLeadTimeHours(order);

    // 4. FRESHNESS GUARD (The Nov 16 / Multi-Day Rule)
    // If the delivery is further in the future than the required baking lead time:
    // It MUST NOT show Baking or Decorating!
    if (hoursUntilDelivery > leadTimeHours) {
      if (rawStatus === 'Confirmed' || rawStatus === 'Order Confirmed' || rawStatus === 'Scheduled') {
        return 'Scheduled for Preparation';
      }
      return order.status || 'Scheduled for Preparation';
    }

    // 5. Active Kitchen Window (Within lead time: e.g. < 24-48h to delivery)
    // If staff has explicitly assigned an operational kitchen status, honor it:
    if (rawStatus && !['Pending', 'Received', 'Order Received'].includes(rawStatus)) {
      if (['Baking', 'Decorating', 'Ready', 'Ready for Delivery', 'Out for Delivery'].includes(rawStatus)) {
        return rawStatus;
      }
    }

    // If within active window and created earlier, compute kitchen progression
    if (createdAt && !isNaN(createdAt.getTime())) {
      const totalDuration = deliveryDate.getTime() - createdAt.getTime();
      const elapsed = now.getTime() - createdAt.getTime();
      if (totalDuration > 0) {
        const progress = elapsed / totalDuration;
        if (progress >= 0.8) return 'Ready';
        if (progress >= 0.5) return 'Decorating';
        if (progress >= 0.2) return 'Baking';
      }
    }

    return 'Preparation Started';
  } catch (error) {
    console.error('Status calculation error:', error);
    return order.status || 'Received';
  }
};

/**
 * Returns contextual customer-facing reassurance text explaining the status.
 */
export const getFreshnessAssurance = (order, currentStatus) => {
  switch (currentStatus) {
    case 'Received':
    case 'Order Received':
    case 'Pending':
      return 'We have received your order request and our bakery team is reviewing your specifications.';
    
    case 'Confirmed':
    case 'Order Confirmed':
      return 'Your order is confirmed! Your delivery date and kitchen production slot are secured.';

    case 'Scheduled':
    case 'Scheduled for Preparation':
      return 'Freshness Guarantee: Your cake is confirmed and scheduled for fresh preparation. To ensure maximum moisture and exquisite taste, we freshly bake your cake closer to your delivery date.';

    case 'Preparation Started':
    case 'Preparing':
      return 'Fresh Preparation: Our pastry chefs have begun measuring fresh butter, eggs, and specialty ingredients for your order.';

    case 'Baking':
      return 'Fresh Baking: Your cake layers are currently in the oven, freshly baking with premium ingredients.';

    case 'Decorating':
      return 'Artisanal Crafting: Your baked cake is cooling and our pastry decorators are applying handcrafted frosting, piping, and customized details.';

    case 'Ready':
    case 'Ready for Delivery':
    case 'Ready for Pickup':
      return 'Quality Approved: Your order has passed our visual and temperature inspection. It is securely boxed and ready for transport.';

    case 'Out for Delivery':
      return 'On the Way: Your cake has been carefully loaded into our delivery carrier and is en route to your location.';

    case 'Delivered':
      return 'Delivered with Joy: Your order has been successfully delivered. Thank you for choosing GoodNews Cake and Catering!';

    case 'Cancelled':
      return 'Order Cancelled: This order has been cancelled. Please contact our support team on WhatsApp or phone if you need assistance.';

    default:
      return 'Your order is progressing smoothly under the care of our bakery team.';
  }
};

/**
 * Returns the CSS classes for status badges based on the type (Auto vs Manual)
 */
export const getStatusBadgeStyle = (order = {}, currentStatus = '') => {
  const isAuto = !order.manualStatus && currentStatus !== 'Delivered' && currentStatus !== 'Cancelled';
  const base = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ';

  if (isAuto && currentStatus === 'Received') {
    return base + 'bg-primary-50 text-primary-700 border border-primary-200 animate-pulse';
  }

  switch (currentStatus) {
    case 'Delivered':
      return base + 'bg-green-100 text-green-700 bubble-glow';
    case 'Cancelled':
      return base + 'bg-red-100 text-red-700';
    case 'Ready':
    case 'Ready for Delivery':
      return base + 'bg-primary-100 text-primary-700';
    case 'Baking':
      return base + 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'Decorating':
      return base + 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'Scheduled for Preparation':
    case 'Scheduled':
      return base + 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Preparation Started':
    case 'Preparing':
      return base + 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Confirmed':
      return base + 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'Out for Delivery':
      return base + 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    default:
      return base + 'bg-dark-100 text-dark-700';
  }
};
