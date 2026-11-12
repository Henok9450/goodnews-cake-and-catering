# Production Scheduling Recommendations
**GoodNews Cake and Catering – Intelligent Freshness & Scheduling Architecture**  
*Auditor: Senior Bakery Operations Consultant & OMS Architect*  
*Date: November 12, 2026*  
*Standard: Artisanal Bakery Freshness & Transparency Standard (ABFTS-2026)*

---

## 1. Freshness Principles for Perishable Confectionery

In commercial and artisanal pastry kitchens:
1. **Sponge Degeneration:** Cake sponges begin losing bound water within 24 hours of baking. Staling occurs as amylose retrogrades, resulting in a dry, crumbly texture.
2. **Buttercream & Dairy Stabilization:** Whipped dairy fillings, mascarpone, and custard mousses have strict refrigerated stability limits (typically 48–72 hours).
3. **Fondant Moisture Migration:** Fondant absorbs moisture from refrigerated fillings if stored for extended days, causing softening, sweating, and structural sagging.
4. **The Golden Freshness Rule:** *No celebration cake should be baked earlier than 24 to 48 hours prior to delivery or collection.*

---

## 2. Product Complexity & Production Lead-Time Matrix

Different baked items require vastly different operational horizons. A single universal timeline is invalid. The table below defines recommended production windows:

| Product Category | Example Items | Production Lead Time Window | Recommended Baking Window | Decorating / Finishing Window |
|---|---|---|---|---|
| **Standard Celebration Cakes** | 8" Birthday Sponge, Black Forest, Chocolate Fudge, Vanilla Classic | **24 hours prior to delivery** | 18–24 hours before delivery | 6–12 hours before delivery |
| **Custom & Themed Cakes** | Custom fondant cakes, carved 3D shapes, edible prints, hand-sculpted toppers | **48 hours prior to delivery** | 36–48 hours before delivery | 12–24 hours before delivery |
| **Wedding & Multi-Tier Cakes** | 2-tier to 4-tier wedding cakes, melse/Ethiopian traditional celebration tiers, sugar flower cascaded cakes | **72 hours prior to delivery** | 48–72 hours before delivery (internal dowel stabilization) | 24–36 hours before delivery |
| **Cupcakes & Cookies** | Boxed cupcakes, artisanal decorated cookies, catering treat boxes | **18–24 hours prior to delivery** | Morning of delivery or evening before | 4–8 hours before delivery |
| **Hot Savory & Catering Platters** | Sambusas, savory pastries, finger food buffet platters | **6–12 hours prior to delivery** | Day of delivery (fresh morning prep) | Immediately prior to dispatch |

---

## 3. Intelligent Scheduling Algorithm

### 3.1 Step 1: Delivery Date & Time Normalization
Convert the order's `eventDate` and `deliveryTime` into a precise timestamp normalized to Addis Ababa, Ethiopia time (`Africa/Addis_Ababa`, UTC+3).
$$\text{DeliveryTimestamp} = \text{parseTimezone}(order.eventDate, order.deliveryTime, \text{"Africa/Addis_Ababa"})$$

### 3.2 Step 2: Determine Required Production Lead Time
Inspect order items for category and complexity:
```javascript
export const getOrderLeadTimeHours = (order) => {
  if (!order.items || order.items.length === 0) return 24; // Default standard lead time

  let maxLeadTime = 24; // Base 24h for standard cakes

  for (const item of order.items) {
    const title = (item.title || '').toLowerCase();
    const type = (order.orderType || '').toLowerCase();
    const details = JSON.stringify(item.details || {}).toLowerCase();

    // Multi-tier wedding cakes require 72 hours
    if (title.includes('wedding') || title.includes('tier') || type.includes('wedding') || details.includes('tier')) {
      return 72;
    }

    // Custom carved or fondant cakes require 48 hours
    if (title.includes('custom') || details.includes('fondant') || details.includes('sculpted') || type.includes('custom')) {
      maxLeadTime = Math.max(maxLeadTime, 48);
    }

    // Cookies and cupcakes standard 24 hours
    if (title.includes('cupcake') || title.includes('cookie')) {
      maxLeadTime = Math.max(maxLeadTime, 24);
    }
  }

  return maxLeadTime;
};
```

### 3.3 Step 3: Production Threshold Check
Compute the hours remaining until delivery:
$$\text{HoursUntilDelivery} = \frac{\text{DeliveryTimestamp} - \text{Now}}{3,600,000}$$

- **Condition 1: $\text{HoursUntilDelivery} > \text{LeadTimeHours}$**
  The delivery date is in the future beyond the active production window.
  - If order is confirmed: System status **MUST be `Scheduled for Preparation`**.
  - **The system must NEVER show `Baking` or `Decorating` in this window.**
- **Condition 2: $0 < \text{HoursUntilDelivery} \le \text{LeadTimeHours}$**
  The order has entered its production lead window.
  - If staff have not yet logged baking: System displays `Preparation Started`.
  - Once staff starts ovens: Status updates to `Baking`.
- **Condition 3: Explicit Staff Actions Override Virtual Defaults**
  If kitchen staff explicitly marks an order as `Baking`, `Decorating`, or `Ready` in the Admin Dashboard, their human action represents physical reality and is strictly honored.

---

## 4. The Critical Operational Rule

> [!IMPORTANT]
> **A scheduled production date is NOT proof that production has started.**  
> The system must never automatically mark an order as "Baking" merely because a scheduled production date or lead-time threshold has been reached. Production status changes must require either explicit staff confirmation or an explicit "Preparation Started" lead-time transition. Customers must only see "Baking" when batter is genuinely in the ovens.

---

## 5. Staff Workflow Guidance

1. **Morning Production Meeting (07:00 EAT):**
   Staff open `/admin/orders` filtered to **"Due Today"** and **"Due Tomorrow"**.
2. **Oven Dispatch:**
   When loading pans into the oven, the baker clicks **"Baking"** on the order drawer.
3. **Cooling & Assembly:**
   When layers are turned onto racks and icing begins, status is set to **"Decorating"**.
4. **Final Quality Check:**
   When the cake is boxed with ribbon and passed visual check, click **"Ready"**.
5. **Driver Dispatch:**
   When the courier takes the box into the van, status changes to **"Out for Delivery"**.
