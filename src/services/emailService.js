const GOOGLE_SCRIPT_URL = process.env.REACT_APP_EMAIL_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxIK7toPLy-PQm8s8NeG5WdCMEUVkLvnM1FM5A_psSRMCkUvzmm8CxAXCRumi9S65CU/exec';
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Sends order data to the notification webhook.
 * Includes timeout controller and parameter sanitation.
 * 
 * @param {Object} orderData - The structured order data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const emailService = {
  sendOrder: async (orderData, retryCount = 1) => {
    if (!orderData || typeof orderData !== 'object') {
      return { success: false, error: 'Invalid order data provided' };
    }

    // Sanitize order payload to prevent prototype pollution or oversized payloads
    const sanitizedData = {
      orderNumber: String(orderData.orderNumber || '').slice(0, 50),
      orderType: String(orderData.orderType || '').slice(0, 100),
      customerName: String(orderData.customerName || orderData.name || '').slice(0, 100),
      customerEmail: String(orderData.customerEmail || orderData.email || '').slice(0, 100),
      customerPhone: String(orderData.customerPhone || orderData.phone || '').slice(0, 50),
      eventDate: String(orderData.eventDate || '').slice(0, 30),
      deliveryTime: String(orderData.deliveryTime || '').slice(0, 30),
      deliveryAddress: String(orderData.deliveryAddress || '').slice(0, 300),
      deliveryNotes: String(orderData.deliveryNotes || '').slice(0, 500),
      orderSummary: String(orderData.orderSummary || '').slice(0, 2000),
      totalPrice: String(orderData.totalPrice || '').slice(0, 50),
      itemsCount: Array.isArray(orderData.items) ? orderData.items.length : 0
    };

    const attemptSend = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(sanitizedData),
          signal: controller.signal
        });
        return { success: true };
      } finally {
        clearTimeout(timeoutId);
      }
    };

    try {
      return await attemptSend();
    } catch (primaryError) {
      if (retryCount > 0 && primaryError.name !== 'AbortError') {
        console.warn('⚠️ Primary email dispatch failed, retrying in 1.5s...', primaryError.message);
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
          return await attemptSend();
        } catch (retryError) {
          console.warn('⚠️ Retry email dispatch notice:', retryError.message);
          return { success: false, error: retryError.message };
        }
      }
      const isTimeout = primaryError.name === 'AbortError';
      const errorMessage = isTimeout 
        ? `Notification request timed out after ${REQUEST_TIMEOUT_MS / 1000}s` 
        : primaryError.message;
      console.warn('⚠️ Order notification dispatch notice:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  getReviews: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Review fetch notice:', error.message);
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
