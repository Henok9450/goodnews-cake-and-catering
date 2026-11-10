# Application Architecture Assessment
**Application:** GoodNews Cake and Catering  
**Production Target:** https://goodnews-cake-and-catering.vercel.app/  
**Audit Stage:** Phase 1 — Comprehensive QA Assessment Baseline  
**Auditor Role:** Enterprise Senior QA Architect & Principal Systems Auditor  

---

## 1. Architectural Topology Overview

GoodNews Cake and Catering is engineered as a two-tier **Decoupled Serverless Client-to-BaaS Architecture**. The presentation tier is delivered as a client-side Single Page Application (SPA) compiled via Create React App (Webpack 5) and hosted on Vercel's Edge Network. Data persistence, authentication, authorization, and media storage are delegated directly to Google Firebase managed services (Cloud Firestore, Firebase Authentication, Cloud Storage for Firebase), supplemented by a Google Apps Script serverless webhook for email routing.

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                       |
|                                                                                         |
|  +--------------------+   +-----------------------+   +------------------------------+  |
|  | Customer Portal UI |   | Shopping Cart Context |   | Role-Based Admin Portal      |  |
|  | (React 18 / Lucide)|   | (Browser localStorage)|   | (13 Operational Subsystems)  |  |
|  +---------+----------+   +-----------+-----------+   +--------------+---------------+  |
+------------|--------------------------|------------------------------|------------------+
             |                          |                              |
             | HTTPS                    |                              | HTTPS (Auth Bearer)
             v                          |                              v
+------------------------+              |             +-----------------------------------+
|   Vercel Edge CDN      |              |             |      Firebase Authentication      |
|  - SSL / TLS 1.3       |              |             |  - Email / Password Credentials   |
|  - SPA Rewrites /(.*)  |              |             |  - Google OAuth 2.0 Identity      |
+------------------------+              |             +-----------------+-----------------+
                                        |                               |
                                        v                               v
                       +-----------------------------------------------------+
                       |             Google Cloud Firestore                  |
                       |  - Security Rules (Client-to-DB Security Boundary)  |
                       |  - 11 Data Collections (Orders, Products, etc.)     |
                       |  - Real-time Listeners (onSnapshot)                 |
                       +------------------------+----------------------------+
                                                |
                      +-------------------------+-------------------------+
                      |                                                   |
                      v                                                   v
+--------------------------------------+         +----------------------------------------+
|   Cloud Storage for Firebase         |         |     Google Apps Script Webhook         |
|  - Image uploads (Admin only)        |         |  - Order notifications to bakery inbox |
|  - Max 5MB, JPG/PNG/WebP client check|         |  - HTTP POST (no-cors mode)            |
+--------------------------------------+         +----------------------------------------+
```

---

## 2. Technology Stack Evidence Matrix

| Layer | Component / Tool | Version (Source Evidence) | Architectural Role | Evaluation / Risk Rating |
|---|---|---|---|---|
| **Frontend Framework** | React / React DOM | `^18.2.0` (`package.json:12-13`) | Core component rendering engine | **Modern / Standard** |
| **Routing** | React Router DOM | `^6.20.1` (`package.json:15`) | Client-side routing & deep-linking | **Standard** (Requires patch for CVE GHSA-2w69-qvjg-hvjx) |
| **Styling** | Tailwind CSS / PostCSS | `^3.3.6` / `^8.4.32` (`package.json:22-23`) | Utility-first responsive styling | **Efficient / Scalable** |
| **Form Handling** | React Hook Form | `^7.63.0` (`package.json:14`) | High-performance uncontrolled forms | **Underutilized** (CustomOrder & Checkout use manual useState) |
| **Animations** | Framer Motion | `^10.16.16` (`package.json:10`) | UI transitions and modal animations | **Good UX** |
| **Icons** | Lucide React | `^0.294.0` (`package.json:11`) | SVG icon iconography | **Clean / Lightweight** |
| **Build Tooling** | `react-scripts` (CRA) | `5.0.1` (`package.json:16`) | Webpack 5 abstraction | **CRITICAL TECH DEBT** (Deprecated CRA, 84 vulnerabilities) |
| **Authentication** | Firebase Auth | `^10.14.1` (`package.json:9`) | Identity management | **High Quality** (Needs custom claims for RBAC) |
| **Database** | Google Cloud Firestore | `^10.14.1` (`package.json:9`) | NoSQL document database | **High Quality** (Compromised by overly permissive rules) |
| **Storage** | Cloud Storage for Firebase | `^10.14.1` (`package.json:9`) | Media asset repository | **Adequate** (Missing storage security rules file) |
| **Email Delivery** | Google Apps Script | Hardcoded Endpoint (`emailService.js:1`) | Order notification bridge | **FRAGILE SPOF** (`no-cors`, no delivery guarantees, unauthenticated) |
| **Hosting** | Vercel Platform | `vercel.json` | Global Edge distribution & DNS | **High Quality** (Missing custom security headers) |

---

## 3. Subsystem Architecture Deep-Dive

### 3.1 Data Flow Architecture: Order Creation & Checkout
The order placement flow follows a dual-path execution strategy in `src/pages/CheckoutPage.jsx`:
1. **Cart Persistence:** Items added to the cart are serialized to `localStorage` under `goodnews_cart`.
2. **Checkout Submission:**
   - **Path A (Asynchronous Notification):** An HTTP POST request is dispatched to Google Apps Script via `emailService.sendOrder()` using `mode: 'no-cors'`.
   - **Path B (Database Persistence):** An `addDoc()` operation is dispatched to the Firestore `orders` collection.
3. **Architectural Flaw:**
   - In `CheckoutPage.jsx:127-129`, the Firestore persistence promise is wrapped in a `try/catch` block that catches failures, logs a `console.warn`, and allows the UI to proceed to the success screen:
     ```javascript
     try {
       const docRef = await addDoc(collection(db, 'orders'), fullOrderData);
     } catch (fsErr) {
       console.warn('⚠️ Firestore order save notice (continuing order completion):', fsErr.message);
     }
     ```
   - **Impact:** If the database write fails (e.g., security rule rejection, network drop, quota exhaustion), the customer is presented with an Order Confirmation screen and a tracking link, but **no order record exists in the database**. Combined with `mode: 'no-cors'` on the email webhook (which resolves even on HTTP 500 errors), transactions can disappear silently with zero audit trail.

### 3.2 Authorization & Access Control Architecture
Administrative security relies on a hybrid authorization model:
1. **Frontend Gatekeeping:**
   - `AdminRoute.jsx` protects `/admin/*` routes by interrogating `useAuth()`.
   - In `AuthContext.jsx`, a user is recognized as an admin if their email's SHA-256 hash matches the hardcoded `BOOTSTRAP_ADMIN_HASHES` (`8329102d...`) **OR** if a document exists at `admins/{uid}` with `isActive !== false`.
2. **Backend Database Boundary (`firestore.rules`):**
   - The security rules define the actual enforcement boundary:
     ```
     match /admins/{adminId} {
       allow read, write: if request.auth != null;
     }
     match /products/{productId} {
       allow write: if request.auth != null;
     }
     ```
   - **Critical Vulnerability (Broken Object Level Access Control):** Any user who creates a free account or signs in via Google OAuth qualifies as `request.auth != null`. Consequently:
     - An authenticated regular customer can execute `setDoc(doc(db, 'admins', auth.currentUser.uid), { role: 'admin', isActive: true })` from the browser console.
     - The customer can directly write or delete records in `/products/`, `/categories/`, `/services/`, `/website_content/`, `/promotions/`, and `/payment_settings/`.
   - **Architectural Remedy:** Migrate from client-side Firestore document role checks to Firebase Custom Claims (e.g., `request.auth.token.admin == true`) verified strictly in `firestore.rules`.

### 3.3 Media Management & Asset Architecture
1. **Static Local Assets:** The repository stores approximately **193.7 MB** of unoptimized PNG and JPG assets inside `public/images/`.
   - High-resolution uncompressed files (2.0 MB to 3.5 MB per image) are referenced directly by the public catalog pages (`Gallery.jsx`, `Seasonal.jsx`, `Catering.jsx`).
   - Loading `/gallery` or `/seasonal` requires transferring 15 MB to 30 MB of image data in a single session.
2. **Dynamic Admin Uploads:** Images uploaded through `ProductManagement.jsx` are stored in Firebase Storage. `storageService.js` validates file extension and size (5MB limit) client-side before uploading.
   - However, the repository lacks a `storage.rules` specification file, leaving Cloud Storage vulnerable to unauthorized uploads or overwrites if the backend bucket rules are unconfigured or in open test mode.

---

## 4. Single Points of Failure (SPOF) & Reliability Analysis

1. **Google Apps Script Webhook:**
   - Single personal macro script URL.
   - Subject to Google Apps Script daily execution quotas (typically 20,000 to 100,000 executions/day or 6 min execution limit).
   - Zero SLA, no retry queue, and opaque response handling.
2. **Direct Client-to-Firestore Write Dependency:**
   - Because there is no backend API gateway or Cloud Function validating orders, data integrity relies 100% on the client device sending valid schemas.
3. **Create React App (CRA) Deprecation & Lock-In:**
   - The project is bound to `react-scripts 5.0.1`, which was deprecated by the React Core Team in 2023.
   - CRA locks Webpack, Babel, ESLint, and Jest into unmaintained versions, triggering 84 security vulnerabilities in `npm audit` that cannot be resolved without ejecting or migrating to Vite.

---

## 5. Architectural Quality Scorecard

| Architectural Dimension | Score (1-10) | Evaluation Comments |
|---|---|---|
| **Separation of Concerns** | 7.0 | Clean directory structure; separate services, contexts, layouts, and pages. |
| **Scalability** | 8.0 | Serverless Vercel edge + Firestore auto-scales seamlessly for customer read spikes. |
| **Resilience & Fault Tolerance** | 4.0 | Silent order write failures, opaque email webhooks, and lack of offline queueing. |
| **Security Architecture** | 3.0 | Critical flaws in Firestore security rules allowing unauthenticated order harvesting and privilege escalation. |
| **Maintainability** | 5.0 | High technical debt from deprecated CRA build harness and uncompressed image assets. |
| **Testability** | 2.0 | Zero unit/integration tests; sole template test fails immediately on execution. |
| **OVERALL ARCHITECTURE SCORE** | **4.8 / 10** | **Architecturally modern concept severely compromised by access control rules, unmanaged asset payload, and legacy tooling.** |
