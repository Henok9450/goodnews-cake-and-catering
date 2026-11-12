# Existing Order Lifecycle Assessment
**GoodNews Cake and Catering – Order Lifecycle, Live Tracking and Freshness Status Optimization**  
*Auditor: Senior Ecommerce Business Analyst & Bakery Operations Consultant*  
*Date: November 12, 2026*  
*System: GoodNews Cake and Catering (React, Firebase Firestore, Vercel)*

---

## 1. Executive Summary

This assessment provides a comprehensive forensic inspection of the existing order management and live tracking implementation for GoodNews Cake and Catering. A critical operational discrepancy was reported: an order placed on November 10 or 12 for a delivery date on November 16 automatically displayed a customer-facing status of **"Baking"** four days before the scheduled event. 

For an artisanal, made-to-order bakery, presenting a cake as "Baking" days before delivery alarms customers about product freshness, texture degradation, and shelf-life, and misrepresents the bakery's actual production workflows.

---

## 2. In-Depth Forensic Investigation (12 Assessment Dimensions)

### 2.1 Existing Order Management Functionality
- **Admin Control Center (`src/pages/admin/OrderManagement.jsx`):**
  Provides a centralized administrative interface for viewing live orders, filtering by status, searching by customer credentials, opening an order details drawer, printing invoices, updating workflow status, adding internal admin notes, and processing order cancellations.
- **Service Layer (`src/services/orderService.js`):**
  Houses the data access logic for Firestore's `orders` collection. Functions include `getOrders()`, `getOrderById()`, `updateOrderStatus()`, `updatePaymentStatus()`, `cancelOrder()`, and `deleteOrder()`. When updating status, it writes `orderStatus`, `status`, `updatedAt`, and appends an audit trail entry to `statusHistory: [{ status, timestamp, note, changedBy }]`.
- **Legacy Order Module (`src/pages/AdminOrders.jsx`):**
  An unrouted legacy component that handled manual status updates by setting a property named `manualStatus`.

### 2.2 All Order Statuses and Their Definitions
Currently, the codebase exhibits multiple conflicting status vocabularies across different files:

| Layer / File | Status Values Defined | Discrepancy / Observation |
|---|---|---|
| `src/services/orderService.js` | `['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup / Out for Delivery', 'Delivered / Completed', 'Cancelled']` | Broad compound labels with slashes (`/`) that complicate tracking step mapping. |
| `src/utils/statusUtils.js` | `['Received', 'Baking', 'Decorating', 'Ready', 'Delivered', 'Cancelled']` | 5 linear stages based on a naive percentage calculation; completely lacks `Confirmed` and `Scheduled`. |
| `src/pages/TrackOrder.jsx` | `['Received', 'Baking', 'Decorating', 'Ready', 'Delivered']` | 5 visual icons. Does not account for `Pending`, `Confirmed`, `Scheduled`, or `Out for Delivery`. |
| `src/pages/CheckoutPage.jsx` | Sets `status: 'Received'` | Does not set `orderStatus` or `manualStatus`. |

### 2.3 How the System Assigns the Initial Order Status
- When a customer checks out via `src/pages/CheckoutPage.jsx` (lines 179-185), the initial order record is created with:
  ```javascript
  status: 'Received',
  customerUid: user?.uid || 'guest',
  orderDate: new Date().toLocaleDateString(),
  orderTime: new Date().toLocaleTimeString(),
  createdAt: serverTimestamp()
  ```
- No explicit confirmation or scheduling state is initialized at inception.

### 2.4 Whether Statuses Are Assigned Manually or Automatically
- **The system operates in a hybrid, conflicting state:**
  - In `src/pages/admin/OrderManagement.jsx`, administrators manually click workflow status buttons (e.g., "Confirmed", "Preparing"). This writes `orderStatus` and `status` to Firestore.
  - However, in `src/pages/TrackOrder.jsx` (line 67) and `src/utils/statusUtils.js` (lines 5-48), the customer-facing status is calculated **dynamically on the fly** using `calculateOrderStatus(order)`.
  - Critically, `calculateOrderStatus` only checks `order.manualStatus`. Because `OrderManagement.jsx` writes `order.status` and `order.orderStatus` (and not `manualStatus`), the automatic percentage algorithm **completely overrides** the admin's setting unless `order.status` is `'Cancelled'` or `'Delivered'`.

### 2.5 How Delivery Dates and Times Are Stored
- Delivery information is captured at checkout:
  - `eventDate`: Stored as an ISO date string (`YYYY-MM-DD`, e.g., `"2026-11-16"`).
  - `deliveryTime`: Stored as a 24-hour time string (e.g., `"14:00"`).
  - `deliveryAddress`: Free-text delivery destination.
  - In some legacy or manual records, `deliveryDate` is used as an alias for `eventDate`.

### 2.6 How the System Calculates Preparation and Baking Dates
- **Defect Found:** The existing system **does not calculate** preparation or baking dates.
- There is no concept of culinary lead times (e.g., multi-tier cakes requiring 48-72h vs. simple sponge cakes requiring 12-24h).
- Instead, the system treats time as an abstract timeline between order placement and delivery date.

### 2.7 Whether There Is an Automated Order Status Progression
- Yes, a client-side virtual progression engine exists in `src/utils/statusUtils.js`:
  ```javascript
  const totalDuration = deliveryDate.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();
  const progress = elapsed / totalDuration;

  if (progress >= 1.0) return 'Delivered';
  if (progress >= 0.8) return 'Ready';
  if (progress >= 0.5) return 'Decorating';
  if (progress >= 0.2) return 'Baking';
  return 'Received';
  ```
- This artificial progress bar automatically pushes an order into `Baking` as soon as 20% of the calendar wait time has elapsed.

### 2.8 Triggers for Status Changes
- Customer-facing status changes are triggered solely by the **passage of client wall-clock time** relative to the delivery date.
- No human staff confirmation, no oven logging, and no kitchen dispatch triggers the `Baking` state.

### 2.9 How Live Order Status Is Displayed to Customers
- In `src/pages/TrackOrder.jsx`:
  - The customer enters their Order Number (e.g. `GN-202611-1001`).
  - An animated connector line and 5 status nodes (`Received`, `Baking`, `Decorating`, `Ready`, `Delivered`) are rendered.
  - The active node is determined by `calculateOrderStatus(order)`.
  - When `Baking` is active, the customer sees: *"Baking: Our bakers are working on your treats."*

### 2.10 Accuracy of Customer-Facing Status vs. Production Reality
- **Highly Inaccurate:**
  - A cake scheduled for November 16 was shown as "Baking" on November 12.
  - Cakes baked 4 days in advance will dry out, lose crumb softness, and suffer staling.
  - Customers seeing "Baking" 4 days early legitimately question whether they will receive a stale product.

### 2.11 Connection Between Creation, Payment, and Production Scheduling
- Order creation and payment status tracking are linked (`paymentStatus: 'Pending' | 'Paid'`).
- However, production scheduling is disconnected. An order can be marked "Paid" without being scheduled, or "Baking" before ingredients are even requisitioned.

### 2.12 Timezone and Date-Calculation Vulnerabilities
- In `src/utils/statusUtils.js`:
  ```javascript
  const deliveryDate = new Date(`${order.eventDate}T${deliveryTime}`);
  ```
  - This string construction relies on the user device's local timezone.
  - For customers ordering from abroad (e.g. diaspora placing orders for family in Addis Ababa), parsing dates in local UTC/EST creates up to an 11-hour shift compared to Addis Ababa local time (`UTC+3`).
  - Fallback string date parsing (`new Date(order.orderDate + ' ' + order.orderTime)`) fails in non-US locales, producing `NaN` and causing errors.

---

## 3. Conclusion & Immediate Recommendations

The current implementation suffers from an overly simplistic mathematical percentage model that ignores physical bakery operations. To resolve this:
1. Eliminate naive elapsed-time ratio progression.
2. Introduce an explicit **"Scheduled for Preparation"** state for orders whose delivery date is in the future.
3. Ensure that physical stages (**Baking**, **Decorating**, **Ready**, **Out for Delivery**) only activate when genuine kitchen operations occur or when verified lead-time windows are reached.
4. Normalize status naming across `orderService.js`, `OrderManagement.jsx`, and `TrackOrder.jsx`.
