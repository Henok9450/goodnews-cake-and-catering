# Existing Order Data Review & Migration Safety Plan
**GoodNews Cake and Catering – Safe Lifecycle Transition & Data Integrity**  
*Auditor: Senior Order Management System Architect & QA Engineer*  
*Date: November 12, 2026*  
*Scope: Firestore `orders` Collection & Customer Record Integrity*

---

## 1. Safety Objectives & Constraints

1. **Zero Data Loss:** Under no circumstances shall existing order IDs, customer contact details, payment transaction records, or product customizations be deleted or modified destructively.
2. **No Unintended Status Regressions:** Orders that have already been physically delivered (`Delivered`), picked up, or cancelled (`Cancelled`) must remain locked in their terminal states.
3. **Graceful Status Normalization:** Historic orders stored with older string variations (`"Ready for Pickup / Out for Delivery"`, `"Delivered / Completed"`, `"Pending"`) must automatically map into the new lifecycle model without requiring bulk database rewrites.
4. **Pre-Migration Snapshotting:** A complete JSON snapshot script must be available to back up all order documents before any administrative migration.

---

## 2. Review of Existing Order Categories & Safety Rules

### Category A: Completed Orders (`Delivered`, `Completed`, `Delivered / Completed`)
- **Status in DB:** Terminal states.
- **Handling:** Immutable. The status engine preserves these states unconditionally. Under no circumstances should a delivered cake revert to `Scheduled` or `Baking`.

### Category B: Cancelled Orders (`Cancelled`, `Void`)
- **Status in DB:** Terminal states.
- **Handling:** Immutable. Preserved without modification. The tracking interface displays a courteous cancellation notice with support contact details.

### Category C: Historic / In-Flight Orders with Future Delivery Dates
- **Problem Scenario:** Orders placed previously that were assigned `status: 'Received'` or `status: 'Baking'` by the legacy percentage engine.
- **Handling:**
  - If `order.eventDate` is in the future (> 24 hours away from current time) and no manual kitchen notes indicate baking:
    - The status engine intelligently presents them as **`Scheduled for Preparation`** or **`Order Confirmed`**.
    - This immediately restores customer confidence that the cake is scheduled for fresh baking.
  - If kitchen staff previously added an admin note or explicitly selected `Baking`, the system checks whether the timestamp of that change corresponds to the physical delivery window.

### Category D: In-Flight Orders Within Active Production Window (< 24–48 Hours)
- **Handling:**
  - If the delivery date is today or tomorrow, the order transitions through `Preparation Started` or `Baking` as managed by the bakery production crew.

---

## 3. Database Schema Compatibility & Field Preservation

The new lifecycle model is 100% additive and non-breaking:

| Field Name | Type | Existing Usage | New Lifecycle Usage |
|---|---|---|---|
| `id` | String | Firestore document ID | Preserved identically |
| `orderNumber` | String | Human-readable ID (e.g. `GN-123456`) | Preserved identically |
| `customerName` | String | Customer full name | Preserved identically |
| `customerPhone` | String | Contact phone | Preserved identically |
| `eventDate` | String | Delivery/Event date (`YYYY-MM-DD`) | Preserved identically |
| `deliveryTime` | String | Preferred time (`HH:mm`) | Preserved identically |
| `items` | Array | Ordered cake specifications | Preserved identically |
| `totalPrice` | String | ETB total | Preserved identically |
| `paymentStatus` | String | `Pending`, `Paid` | Preserved identically |
| `orderStatus` / `status` | String | Primary status string | Normalized to standard 9-stage vocabulary |
| `scheduledProductionDate` | String (Optional) | N/A | Added dynamically for explicit kitchen scheduling |
| `statusHistory` | Array | Audit log | Preserved and enriched with timestamps and source |

---

## 4. Verification Check Before Modifying Production Order Data

Prior to executing any bulk batch update:
1. Verify automated tests pass across all legacy status representations.
2. Confirm that unindexed query fallbacks in `orderService.js` retrieve all documents reliably.
3. Obtain explicit administrative authorization prior to running any permanent batch writes.
