# Root Cause Analysis
**Forensic Investigation: Premature "Baking" Status Display**  
*Auditor: Senior Ecommerce Business Analyst & Order Management System Architect*  
*Date: November 12, 2026*  
*Reference Ticket: GN-BUG-ORDER-FRESHNESS-001*

---

## 1. Problem Statement

On **November 12, 2026**, a customer whose cake delivery is scheduled for **November 16, 2026** views the Live Order Status page (`/track/:orderNumber`). The application displays the order status as:

> **Current Status: Baking**  
> *"Our bakers are working on your treats."*

This status is displayed four (4) full days before the requested delivery date, creating serious customer anxiety regarding freshness and product quality.

---

## 2. Mathematical Root Cause Analysis

### 2.1 The Underlying Code Mechanism
The status display is governed by `calculateOrderStatus(order)` in `src/utils/statusUtils.js` (lines 27–43):

```javascript
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
```

### 2.2 Numerical Walkthrough of the November 16 Delivery

Assume the order was placed on **November 10, 2026 at 12:00:00 EAT**:
- $T_{\text{created}} = \text{Nov 10, 12:00} = 1794224400000\text{ ms}$
- $T_{\text{delivery}} = \text{Nov 16, 12:00} = 1794742800000\text{ ms}$
- $\text{Total Duration} = 6 \text{ days} = 144 \text{ hours} = 518,400,000\text{ ms}$

Current inspection time: **November 12, 2026 at 16:00:00 EAT**:
- $T_{\text{now}} = \text{Nov 12, 16:00} = 1794411600000\text{ ms}$
- $\text{Elapsed Time} = 2 \text{ days, } 4 \text{ hours} = 52 \text{ hours} = 187,200,000\text{ ms}$

Calculation of progress ratio:
$$\text{Progress} = \frac{\text{Elapsed}}{\text{Total Duration}} = \frac{52}{144} \approx 0.3611 \quad (36.11\%)$$

Evaluation against threshold rules:
1. `progress >= 1.0` (100%): `false`
2. `progress >= 0.8` (80%): `false`
3. `progress >= 0.5` (50%): `false`
4. `progress >= 0.2` (20%): **`TRUE`** ($36.11\% \ge 20\%$)

**Result:** The algorithm unequivocally returns `'Baking'`.

In fact, the order entered the `Baking` state on **November 11 at 16:48:00 EAT** (exactly 28.8 hours after creation, a staggering **4.8 days prior to delivery**)!

Even worse:
- By **November 13 at 12:00:00 EAT** (3 days before delivery, at 50% elapsed time), the system would automatically change status to **`Decorating`**.
- By **November 15 at 07:12:00 EAT** (over 28 hours before delivery, at 80% elapsed time), the system would claim the cake is **`Ready`**.
- On **November 16 at 12:00:00 EAT**, the system would mark the order as **`Delivered`**, regardless of whether the driver was delayed, the delivery van was en route, or the customer was not home.

---

## 3. Contributing Architectural & Design Flaws

### Flaw 1: Equating Calendar Wait Time with Culinary Production
In physical bakery operations, time between order placement and delivery is **idle queue time**, not active production time. A cake ordered 3 weeks in advance must remain in the queue for 20 days. A linear percentage scale (`elapsed / totalDuration`) is fundamentally incompatible with perishable goods manufacturing.

### Flaw 2: Status Disconnection Between Admin and Tracking
1. When an admin reviews and accepts an order in `OrderManagement.jsx`, the system writes:
   - `order.orderStatus = 'Confirmed'`
   - `order.status = 'Confirmed'`
2. However, `calculateOrderStatus(order)` in `statusUtils.js` only checked `order.manualStatus`.
3. Because `manualStatus` is `undefined`, and `status !== 'Cancelled' && status !== 'Delivered'`, the function ignored the admin's `'Confirmed'` status and ran the flawed percentage math, overriding the admin's explicit action!

### Flaw 3: Complete Absence of the "Scheduled for Preparation" Lifecycle Stage
The existing tracking UI (`TrackOrder.jsx`) and status utility provided zero intermediary state between `Received` and `Baking`. There was no stage to communicate:
> *"Your order is confirmed and scheduled for preparation. We will begin fresh baking closer to your delivery date."*

### Flaw 4: Missing Operational Lead Time Logic
A 2-tier wedding cake might require 48 hours for baking, chilling, crumb-coating, fondant application, and dowel stabilization. A standard 8-inch birthday cake requires 12–24 hours. The existing system had no cake-complexity awareness or lead-time calculation.

### Flaw 5: Timezone and Date-String Vulnerabilities
1. `new Date(`${order.eventDate}T${deliveryTime}`)` uses host browser local time. When a customer or staff member checks from another country or timezone, the date object is distorted by the UTC offset.
2. The standard business operations of GoodNews Cake and Catering take place in **Addis Ababa, Ethiopia (`Africa/Addis_Ababa`, UTC+3)**, which has no daylight saving time shifts. All production and delivery scheduling must strictly normalize to EAT (`UTC+3`).

---

## 4. Remediation Plan

To permanently resolve this root cause:
1. **Abolish the percentage-based progression engine.**
2. **Implement an intelligent, lead-time-based scheduling model** where future orders remain in `Confirmed` or `Scheduled for Preparation` until their designated production window.
3. **Strictly enforce operational triggers:** `Baking` and subsequent stages must only reflect actual kitchen operations initiated by staff or verified within the strict freshness window (e.g. < 24-48 hours before delivery).
4. **Synchronize all status fields** (`orderStatus`, `status`, `manualStatus`) so admin workflow changes immediately reflect in the customer tracking view.
5. **Normalize all timestamps to `Africa/Addis_Ababa` (UTC+3).**
