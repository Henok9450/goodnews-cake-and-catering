/**
 * Utility to calculate and manage automatic order status progression.
 */

export const calculateOrderStatus = (order) => {
  // 1. Manual Override Check
  // If a manager has manually set the status, we honor it.
  if (order.manualStatus) {
    return order.manualStatus;
  }

  // 2. Data Preparation
  try {
    const createdAt = order.createdAt?.seconds 
      ? new Date(order.createdAt.seconds * 1000) 
      : new Date(order.orderDate + ' ' + order.orderTime); // Fallback to string date

    const deliveryTime = order.deliveryTime || "12:00";
    const deliveryDate = new Date(`${order.eventDate}T${deliveryTime}`);
    const now = new Date();

    // 3. Simple State Handling (Cancelled/Delivered already set by manager)
    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      return order.status;
    }

    // 4. Percentage-Based Progression
    const totalDuration = deliveryDate.getTime() - createdAt.getTime();
    const elapsed = now.getTime() - createdAt.getTime();
    
    // Safety check for invalid dates
    if (isNaN(totalDuration) || totalDuration <= 0) return order.status || 'Received';

    const progress = elapsed / totalDuration;

    // 5. Status Mapping
    if (progress >= 1.0) return 'Delivered';
    if (progress >= 0.8) return 'Ready';
    if (progress >= 0.5) return 'Decorating';
    if (progress >= 0.2) return 'Baking';
    
    return 'Received';

  } catch (error) {
    console.error("Status calculation error:", error);
    return order.status || 'Received';
  }
};

/**
 * Returns the CSS classes for status badges based on the type (Auto vs Manual)
 */
export const getStatusBadgeStyle = (order, currentStatus) => {
  const isAuto = !order.manualStatus && currentStatus !== 'Delivered' && currentStatus !== 'Cancelled';
  
  const base = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ";
  
  if (isAuto) {
    return base + "bg-primary-50 text-primary-700 border border-primary-200 animate-pulse";
  }

  switch (currentStatus) {
    case 'Delivered': return base + "bg-green-100 text-green-700 bubble-glow";
    case 'Cancelled': return base + "bg-red-100 text-red-700";
    case 'Ready': return base + "bg-primary-100 text-primary-700";
    default: return base + "bg-dark-100 text-dark-700";
  }
};
