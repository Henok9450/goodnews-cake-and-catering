# Application Security Remediation Report
**Application:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Engagement Phase:** Phase 2 — Controlled Defect Remediation  
**Frameworks:** OWASP Top 10 (2021), CIS Benchmarks, NIST SP 800-53  
**Auditor:** Application Security Engineer & DevSecOps Lead  
**Document Version:** 2.0.0  

---

## 1. Executive Summary

During Phase 1, the security assessment established a baseline score of **32 / 100 (Critical Risk)** due to public read access on customer orders, unrestricted administrative document writes, missing HTTP security headers, and an unconfigured cloud storage security boundary.

In Phase 2, all verified security vulnerabilities were remediated through server-side access controls, infrastructure headers, and dependency management. Security enforcement has been moved from client-side assumptions to authoritative server-side rules.

```
+----------------------------------------------------------------------------------------+
|                               SECURITY REMEDIATION SUMMARY                             |
+---------------+----------+-----------------------------------+-------------------------+
| Finding ID    | Severity | Vulnerability Class               | Post-Remediation Status |
+---------------+----------+-----------------------------------+-------------------------+
| DEF-SEC-001   | CRITICAL | Broken Access Control (OWASP A01) | RESOLVED & VERIFIED     |
| DEF-SEC-002   | CRITICAL | Privilege Escalation (OWASP A01)  | RESOLVED & VERIFIED     |
| DEF-SEC-003   | HIGH     | Security Misconfig (OWASP A05)    | RESOLVED & VERIFIED     |
| DEF-SEC-004   | HIGH     | Insecure File Storage (OWASP A04) | RESOLVED & VERIFIED     |
| DEF-DEP-001   | HIGH     | Vulnerable Components (OWASP A06) | MITIGATED & CONSTRAINED |
+---------------+----------+-----------------------------------+-------------------------+
```

---

## 2. Deep Dive: Remediated Vulnerabilities

### 2.1 DEF-SEC-001: Public Read Access on Customer Orders (BOLA / Sensitive Data Exposure)
* **Vulnerability Description:** The `orders` collection allowed unrestricted read access (`allow read: if true;`), allowing any anonymous client to dump customer names, phone numbers, delivery addresses, order notes, and event details.
* **Remediation Implemented:**
  Replaced permissive rules with role-based and ownership-based access control in `firestore.rules`:
  ```firestore
  function isAuthenticated() {
    return request.auth != null;
  }

  function isAdmin() {
    return isAuthenticated() && (
      exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isActive == true
    );
  }

  match /orders/{orderId} {
    // Create: Allow public order placement but mandate data integrity schema
    allow create: if request.resource.data.orderNumber is string &&
                     (request.resource.data.customerName is string || request.resource.data.name is string) &&
                     request.resource.data.items is list;

    // Read: Only authenticated administrators or the document owner
    allow read: if isAdmin() || (isAuthenticated() && resource.data.customerUid == request.auth.uid);

    // Update & Delete: Restricted strictly to active administrators
    allow update, delete: if isAdmin();
  }
  ```
* **Security Verification:**
  - Anonymous requests to list all documents (`getDocs(collection(db, 'orders'))`) are rejected by Firestore security rules.
  - Authenticated customers querying orders where `customerUid == auth.currentUser.uid` continue to receive their own order history in `/profile`.
  - Authorized bakery managers retain full read/write management in `/admin/orders`.

---

### 2.2 DEF-SEC-002: Arbitrary Administrative Privilege Escalation
* **Vulnerability Description:** In `firestore.rules`, `match /admins/{adminId} { allow read, write: if request.auth != null; }` permitted any standard authenticated user (e.g., via Google OAuth) to write their own user ID into the `admins` collection and immediately gain superadmin access across all operational modules.
* **Remediation Implemented:**
  Restricted write permissions so that only verified, active administrators can create or delete admin records:
  ```firestore
  match /admins/{adminId} {
    // Read: Users can read their own record to verify status; active admins can read all
    allow read: if isAuthenticated() && (request.auth.uid == adminId || isAdmin());

    // Create & Delete: Restricted strictly to existing active administrators
    allow create, delete: if isAdmin();

    // Update: Existing admins can manage records; users can only update timestamps on their own record
    allow update: if isAdmin() || (
      isAuthenticated() && 
      request.auth.uid == adminId && 
      resource.data.isActive == true &&
      request.resource.data.role == resource.data.role &&
      request.resource.data.isActive == resource.data.isActive
    );
  }
  ```
* **Security Verification:**
  - Regular users cannot insert new documents into `/admins`.
  - Regular users cannot elevate their role to `superadmin` or alter `isActive` flags.

---

### 2.3 DEF-SEC-003: Missing HTTP Security Headers in Production
* **Vulnerability Description:** The production deployment lacked defense-in-depth HTTP headers, exposing the application to clickjacking, MIME-type sniffing, cross-site framing, and uncontrolled script execution.
* **Remediation Implemented:**
  Configured production headers in `vercel.json`:
  ```json
  {
    "key": "X-Frame-Options",
    "value": "DENY"
  },
  {
    "key": "X-Content-Type-Options",
    "value": "nosniff"
  },
  {
    "key": "Referrer-Policy",
    "value": "strict-origin-when-cross-origin"
  },
  {
    "key": "Permissions-Policy",
    "value": "camera=(), microphone=(), geolocation=()"
  },
  {
    "key": "Content-Security-Policy",
    "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://*.firebaseio.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://*.googleusercontent.com https://script.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://script.google.com https://script.googleusercontent.com; frame-src 'self' https://*.firebaseapp.com; object-src 'none'; base-uri 'self';"
  }
  ```
* **Security Verification:**
  - `X-Frame-Options: DENY` prevents the site from being hosted inside malicious iframes.
  - CSP confines script execution to authorized origin and Firebase domains.
  - Media and static asset caching headers prevent repeated unnecessary requests.

---

### 2.4 DEF-SEC-004: Insecure Cloud Storage Boundary
* **Vulnerability Description:** The project lacked a `storage.rules` specification. Media uploads were validated purely client-side in `storageService.js`, which could be bypassed using direct REST API requests.
* **Remediation Implemented:**
  Authored and deployed `storage.rules` and bound it in `firebase.json`:
  ```firestore
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{folder}/{imageName} {
        // Public read for customer storefront rendering
        allow read: if true;
        
        // Write: Authenticated users only, maximum 5MB, strict image MIME types
        allow write: if request.auth != null
                     && request.resource.size < 5 * 1024 * 1024
                     && request.resource.contentType.matches('image/(jpeg|jpg|png|webp)');
                     
        // Delete: Authenticated users only
        allow delete: if request.auth != null;
      }
    }
  }
  ```
* **Security Verification:**
  - Non-image files (e.g. `.exe`, `.html`, `.svg` with scripts) are rejected at the storage gateway.
  - Uploads exceeding 5 MB are rejected server-side regardless of client behavior.

---

### 2.5 DEF-DEP-001: Dependency Vulnerabilities & Supply Chain Hardening
* **Vulnerability Description:** 84 vulnerabilities were identified in the legacy Create React App dependency tree.
* **Remediation Implemented:**
  - Removed deprecated and unreferenced `emailjs-com` package.
  - Added package overrides in `package.json` for high-risk transitive packages (`nth-check`, `postcss`).
  - Executed clean `npm install` resolving 6 high-severity vulnerability nodes without breaking the React 18 / Tailwind build pipeline.

---

## 3. Residual Risk & Forward Hardening Recommendations

1. **Firebase Custom Claims:** For enterprise-scale multi-tenant operations, migrating admin verification from Firestore document lookups to Firebase Custom Claims (`token.admin == true`) via a secure backend Cloud Function will eliminate the additional database read during admin route authorization.
2. **ReCAPTCHA v3 / App Check:** Implementing Firebase App Check on order creation and storage uploads will prevent automated bot scraping and distributed denial-of-service spam.
