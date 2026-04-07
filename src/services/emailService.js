const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_VHdTudShRFLaj_vlxNL77ZlxqpTHUEQ1Q8dXqqECwSDB5l8EifKgHW2LnqSH0CL5/exec';

/**
 * Sends order data to the Google Apps Script Web App.
 * Note: 'no-cors' mode is used, so we cannot read the response status.
 * We rely on the fetch promise resolving to assume the request was sent.
 * 
 * @param {Object} orderData - The data to send
 * @returns {Promise<{success: boolean}>}
 */
export const emailService = {
  sendOrder: async (orderData) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        redirect: 'follow',
        method: 'POST',
        // mode: 'no-cors' is needed for POST, but complicates error handling. 
        // For simple fire-and-forget, this works.
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(orderData),
      });

      // Since we can't read the response in no-cors (or opaque), 
      // we assume success if the network request didn't fail.
      return { success: true };
    } catch (error) {
      console.error('Error sending order:', error);
      return { success: false, error: error.message };
    }
  },

  getReviews: async () => {
    try {
      // GET requests to GAS Web Apps usually follow redirects to serve JSON
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }
};
