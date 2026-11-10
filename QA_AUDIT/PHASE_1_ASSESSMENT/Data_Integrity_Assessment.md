# Data Integrity & Database Architecture Assessment
**Application:** GoodNews Cake and Catering  
**Database Infrastructure:** Google Cloud Firestore (NoSQL Document Store)  
**Evaluation Scope:** Schema Consistency, Relational References, Concurrency Control, Persistence Guarantees, Indexing  
**Auditor:** Principal Data Architect & Enterprise Database QA Engineer  

---

## 1. Executive Summary

GoodNews Cake and Catering employs Google Cloud Firestore as its primary operational datastore across 11 document collections. The database architecture benefits from Firestore's managed global replication, real-time snapshot listeners, and high read availability. However, the evaluation identified critical data integrity vulnerabilities: **absence of server-side schema validation**, **lack of transactional inventory decrementing during checkout**, **order number race condition risks**, **unindexed composite queries causing silent history fetch failures in user profiles**, and **disconnected relational references between products and categories**.

---

## 2. Collection Schema & Model Inventory

```
+----------------------------------------------------------------------------------------+
|                               FIRESTORE DATA COLLECTIONS                               |
|                                                                                        |
|  - admins/            : Administrator profiles & role assignments                     |
|  - categories/        : Product categories (slug, displayOrder, isActive)             |
|  - products/          : Cakes, cupcakes, cookies, seasonal items catalog              |
|  - services/          : Catering banquet packages and service items                   |
|  - orders/            : Customer purchase orders, status history, customerUid         |
|  - customers/         : Aggregated customer records (phone, orderCount, totalSpent)   |
|  - reviews/           : Customer testimonials and moderation status (pending/approved)|
|  - promotions/        : Coupon discount codes and validity dates                      |
|  - payment_settings/  : Bank accounts, Telebirr numbers, payment instructions         |
|  - website_content/   : CMS text content for homepage, about, and contact sections    |
|  - gallery/           : Visual media portfolio items                                  |
+----------------------------------------------------------------------------------------+
```

---

## 3. Data Integrity & Validation Deficiencies

### 3.1 Total Absence of Server-Side Schema Validation
* **Vulnerability Analysis:** Firestore security rules (`firestore.rules`) contain zero data shape, type, or attribute constraints:
  ```
  match /orders/{orderId} {
    allow create: if true;
  }
  ```
  Any client can write arbitrary, malformed documents to the `orders` collection (e.g., omitting `phone`, injecting strings into numeric fields, or injecting arbitrary nested properties).
* **Impact:** In the event of an untrusted client or modified browser script, invalid documents can corrupt admin reporting dashboards (`ReportsAnalytics.jsx`) and break order status updates.
* **Remediation:** Introduce strict validation rules in `firestore.rules`:
  ```
  match /orders/{orderId} {
    allow create: if request.resource.data.keys().hasAll(['orderNumber', 'name', 'phone', 'items', 'status'])
                  && request.resource.data.name is string
                  && request.resource.data.phone is string
                  && request.resource.data.items is list;
  }
  ```

### 3.2 Inventory Race Conditions & Lack of ACID Transactions
* **Current Implementation:** In `ProductManagement.jsx`, each product has a `stockQuantity` attribute. However, during customer checkout (`CheckoutPage.jsx`), orders are placed **without decrementing `stockQuantity`** or verifying item availability.
* **Impact:** If multiple customers order the same limited seasonal cake (e.g., Enkutatash New Year special), the system allows unlimited overselling.
* **Remediation:** Implement a Firestore `runTransaction()` during checkout that verifies and decrements `stockQuantity` atomically.

### 3.3 Order Number Generation Collision Risk
* **Current Implementation:** In `CheckoutPage.jsx:48`, order numbers are generated using client timestamp and a short random substring:
  ```javascript
  const orderNumber = `GNC-${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  ```
* **Evaluation:** While collisions are rare under low traffic, client-side timestamp generation lacks database uniqueness enforcement. If two orders generate identical order numbers, `TrackOrder.jsx` (which executes `where('orderNumber', '==', num)`) will load only the first matching document, rendering the duplicate order untrackable.
* **Remediation:** Enforce uniqueness in Firestore by using the unique `orderNumber` as the document ID (`setDoc(doc(db, 'orders', orderNumber), ...)`).

### 3.4 Missing Composite Indexes in Customer Profile Query
* **Location:** `src/pages/Profile.jsx:22-26`
* **Defect Code:**
  ```javascript
  const q = query(
    collection(db, 'orders'),
    where('customerUid', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  ```
* **Evaluation:** In Cloud Firestore, combining an equality filter (`customerUid == ...`) with an `orderBy('createdAt', 'desc')` requires a dedicated composite index. If this composite index has not been provisioned in the Firebase Console, Firestore throws:
  `FirebaseError: The query requires an index.`
  Unlike `orderService.js` (which includes a fallback `try/catch` query), `Profile.jsx` catches the error, logs `console.error`, and leaves the order history completely blank for customers.
* **Remediation:** Provision the required composite index in Firestore (`orders: customerUid ASC, createdAt DESC`) and add an in-memory sorting fallback in `Profile.jsx`.

---

## 4. LocalStorage Persistence & Client Cache Integrity

* **Cart Synchronization:** `goodnews_cart` is stored in browser `localStorage` as a serialized JSON string.
  * **Integrity Check:** If a user modifies `localStorage` manually or if corrupted data is stored, `CartContext.js:18-20` gracefully catches JSON parse errors and resets the cart to `[]`.
  * **Stale Price Risk:** Cart items preserve the price string at the moment they were added to the bag. If an administrator updates product pricing in `ProductManagement.jsx`, items already residing in a customer's cart retain the old price unless re-validated against Firestore at checkout.

---

## 5. Data Integrity Scorecard

| Integrity Dimension | Score (1-10) | Evaluation Comments |
|---|---|---|
| **Persistence Guarantees** | 4.0 | Critical defect: Checkout UI marks orders successful even if DB write fails (`DEF-ORD-001`). |
| **Server-Side Validation** | 2.0 | Zero schema validation rules in Firestore; accepts arbitrary client payloads. |
| **Relational Consistency** | 6.5 | No foreign key cascades; deleting a category leaves orphan category slugs in products. |
| **Concurrency & ACID** | 3.0 | No transactions; no inventory decrementing; client-generated order numbers. |
| **Index Optimization** | 5.5 | Basic single-field indexes active; composite indexes missing on profile order history. |
| **OVERALL DATA INTEGRITY SCORE** | **4.2 / 10** | **POOR — Requires schema rules, atomic checkout, and index provisioning.** |
