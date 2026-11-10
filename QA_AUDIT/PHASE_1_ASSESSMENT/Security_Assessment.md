# Comprehensive Application Security Assessment
**Application:** GoodNews Cake and Catering  
**Production Target:** https://goodnews-cake-and-catering.vercel.app/  
**Audit Framework:** OWASP Top 10:2021 & OWASP Web Security Testing Guide (WSTG v4.2)  
**Assessment Type:** Non-Destructive Static Code Analysis & Dynamic Edge Header Inspection  
**Lead Auditor:** Enterprise Application Security Architect  

---

## 1. Executive Security Summary

The security posture of GoodNews Cake and Catering exhibits **critical architectural vulnerabilities** at the database access control layer, infrastructure header configuration, and dependency supply chain. While the frontend implements client-side role guards (`AdminRoute.jsx`) and avoids committing plaintext passwords, the backend database security boundary (`firestore.rules`) fails to enforce server-side authorization. Consequently, **unauthenticated visitors can harvest all customer orders and PII**, and **any authenticated user can elevate themselves to full Administrator**.

| Severity Rating | Number of Confirmed Vulnerabilities | Priority for Remediation |
|---|---|---|
| **Critical** | 2 | Immediate Blockers |
| **High** | 4 | Mandatory before promotion |
| **Medium** | 2 | Near-term sprint |
| **Low / Informational** | 3 | Best-practice hardening |

---

## 2. OWASP Top 10 (2021) Evaluation Matrix

### 2.1 A01:2021 — Broken Access Control (RATING: CRITICAL)
* **Finding ID:** `DEF-SEC-001`
  * **Location:** `firestore.rules:41-46`
  * **Vulnerability Description:** The Firestore rule for `/orders/{orderId}` is configured as:
    ```
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    ```
    `allow read: if true;` permits unauthenticated public read access to the entire `orders` collection. Any actor on the internet can execute `getDocs(collection(db, 'orders'))` or iterate through document IDs to extract sensitive customer records.
  * **Evidence:** Inspected `firestore.rules`. Verified with dynamic query pattern in client SDK.
  * **Information Exposed:** Customer full name, phone number, physical delivery address, email, itemized cake orders, custom inscriptions/messages, event dates, payment status, and order numbers.
  * **Recommendation:**
    ```
    match /orders/{orderId} {
      allow read: if (request.auth != null && (request.auth.token.admin == true || resource.data.customerUid == request.auth.uid));
      allow create: if true;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    ```

* **Finding ID:** `DEF-SEC-002`
  * **Location:** `firestore.rules:6-8` & `src/contexts/AuthContext.jsx:93-102`
  * **Vulnerability Description:** Horizontal & Vertical Privilege Escalation. The `admins` collection permits arbitrary writes by any authenticated user:
    ```
    match /admins/{adminId} {
      allow read, write: if request.auth != null;
    }
    ```
    In `AuthContext.jsx`, `verifyAdminRole` checks whether a document exists in `admins/{uid}` with `isActive !== false`. Any user who signs up or logs in via Google can run `setDoc(doc(db, 'admins', auth.currentUser.uid), { role: 'admin', isActive: true })` from the DevTools console and instantly acquire full administrative control.
  * **Recommendation:** Restrict writes to `/admins/` exclusively to superadmins using Firebase Custom Claims (`request.auth.token.admin == true`).

---

### 2.2 A02:2021 — Cryptographic Failures (RATING: LOW / ACCEPTABLE)
* **Bootstrap Admin Hash (`AuthContext.jsx:20-22`):**
  * Plaintext emails are not hardcoded. The application uses a one-way SHA-256 hash (`8329102d...`) to identify the primary administrator.
  * Password hashing and credential storage are handled entirely by Google Firebase Authentication (using Scrypt/PBKDF2 on Google infrastructure).
  * Data in transit is enforced via TLS 1.3 across Vercel and Google Cloud APIs.

---

### 2.3 A03:2021 — Injection (RATING: LOW)
* **NoSQL Injection:** Queries utilize parameterized Firestore SDK methods (`collection()`, `query()`, `where()`). No dynamic string concatenation is executed against database drivers.
* **Cross-Site Scripting (XSS):** React JSX automatically escapes dynamic values rendered in the DOM. However, `htmlFor` and input attributes should be monitored, and rich text editors in CMS content should sanitize inputs.
* **Open Redirect / XSS in Router:** `npm audit` flagged GHSA-2w69-qvjg-hvjx in `@remix-run/router <=1.23.2` / `react-router-dom 6.20.1` regarding protocol-relative URLs (`//evil.com`). Updating `react-router-dom` is recommended.

---

### 2.4 A04:2021 — Insecure Design (RATING: HIGH)
* **Finding ID:** `DEF-ORD-001` — **Silent Failure in Order Persistence:**
  * In `CheckoutPage.jsx:127-129`, failures to write to the Firestore `orders` collection are caught and swallowed, displaying a misleading success modal to the customer.
* **Finding ID:** `DEF-INT-001` — **Unauthenticated Email Webhook Endpoint:**
  * In `emailService.js:1`, the Google Apps Script Webhook URL is embedded directly in client-side JavaScript. Anyone who inspects network traffic can spam the webhook with arbitrary payloads, potentially exhausting Google quotas and flooding the bakery's inbox with fake orders.

---

### 2.5 A05:2021 — Security Misconfiguration (RATING: HIGH)
* **Finding ID:** `DEF-SEC-003` — **Missing HTTP Security Headers on Vercel:**
  * Active HTTP probe against `https://goodnews-cake-and-catering.vercel.app/` confirms the total absence of:
    - `Content-Security-Policy` (CSP)
    - `X-Frame-Options: DENY` (Vulnerable to Clickjacking)
    - `X-Content-Type-Options: nosniff` (Vulnerable to MIME-sniffing)
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy`
  * Furthermore, `Access-Control-Allow-Origin: *` is returned globally on the root HTML document.
* **Finding ID:** `DEF-SEC-004` — **Missing Firebase Storage Security Rules:**
  * There is no `storage.rules` file in the source repository. If the Cloud Storage bucket is using default permissive rules, anyone with Firebase credentials can upload or overwrite files.

---

### 2.6 A06:2021 — Vulnerable and Outdated Components (RATING: HIGH)
* **Finding ID:** `DEF-DEP-001` — **84 Vulnerabilities in npm Dependencies:**
  * `npm audit` confirmed **4 Critical, 38 High, 24 Moderate, 18 Low** vulnerabilities.
  * Root cause: `react-scripts 5.0.1` locks outdated transitive dependencies (`ws`, `websocket-driver`, `webpack-dev-middleware`, `undici`, `@grpc/grpc-js`).

---

### 2.7 A07:2021 — Identification and Authentication Failures (RATING: MEDIUM)
* **Session Management:** Managed securely by Firebase Auth tokens (JWT stored in IndexedDB with automatic rotation).
* **Brute-Force Protection:** Handled at Firebase Auth API level (`auth/too-many-requests`), surfaced gracefully in `AdminLogin.jsx`.
* **Weakness:** Lack of Multi-Factor Authentication (MFA) for administrative accounts. Admin access should require WebAuthn/TOTP.

---

### 2.8 A08:2021 — Software and Data Integrity Failures (RATING: HIGH)
* Order pricing and item details are calculated and formatted entirely on the client before being written to Firestore. A malicious actor using DevTools can submit an order with modified item prices or forged statuses (`status: 'Delivered'`) if security rules do not validate write schemas.

---

### 2.9 A09:2021 — Security Logging and Monitoring Failures (RATING: MEDIUM)
* All logging is currently performed via `console.log` / `console.error` inside client browser DevTools.
* There is no centralized security incident event management (SIEM), Sentry error monitoring, or audit logging of administrative actions (e.g., when an admin deletes a product or changes customer orders).

---

### 2.10 A10:2021 — Server-Side Request Forgery (SSRF) (RATING: LOW / N/A)
* As a client-side SPA with serverless Firebase backend, the application has no backend server parsing arbitrary user URLs. The risk is limited to build-time webpack plugins identified in `npm audit`.

---

## 3. Recommended Remediation Roadmap

1. **Sprint 1 (Day 1 - Critical Access Control Patch):**
   - Deploy hardened `firestore.rules` restricting read access on `/orders/` to document owners and administrators.
   - Restrict writes to `/admins/` to superadmin token claims.
2. **Sprint 1 (Day 2 - Infrastructure Hardening):**
   - Add security headers to `vercel.json` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
   - Create and deploy `storage.rules` restricting media uploads to verified admins.
3. **Sprint 2 (Architecture & Resilience):**
   - Refactor `CheckoutPage.jsx` to abort and notify if Firestore write fails.
   - Replace Google Apps Script webhook with an authenticated Firebase Cloud Function for transactional email notifications.
   - Plan migration from deprecated `react-scripts` to Vite to resolve 84 supply chain CVEs.
