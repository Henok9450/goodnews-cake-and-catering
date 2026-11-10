# Remediation Change Log & Traceability Register
**Application:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Engagement Phase:** Phase 2 — Controlled Defect Remediation  
**Author:** Senior Software Engineer & Configuration Management Lead  
**Document Version:** 2.0.0  
**Commit Reference:** `1b13ec2`  

---

## 1. Summary of Changes

Phase 2 applied controlled, non-destructive mitigations across 14 primary source, configuration, and infrastructure files, along with 95 compressed media assets in `public/images/`.

```
========================================================================
                       MODIFICATION BREAKDOWN
========================================================================
Security & Database Rules:       firestore.rules, storage.rules, firebase.json
Infrastructure & Routing:        vercel.json, public/sitemap.xml, public/robots.txt
SEO & Metadata:                  public/index.html, public/manifest.json
Business Logic & State:          src/contexts/CartContext.js, src/pages/CheckoutPage.jsx
Service Layer & Integrations:    src/services/emailService.js
Layout & Components:             src/components/layout/Header.jsx, Footer.jsx, Home.jsx
Catalog Pages (Lazy Loading):    src/pages/Gallery.jsx, Seasonal.jsx, Cupcakes.jsx, Cookies.jsx, Catering.jsx
Route Architecture:              src/App.js (Route-based Code Splitting)
Testing Harness:                 src/App.test.js, src/setupTests.js
Tooling & Dependencies:          package.json, scripts/optimize-images.js
Compressed Media:                95 images in public/images (193.7MB -> 34.7MB)
========================================================================
```

---

## 2. Chronological Change Log by File

### 1. `firestore.rules`
* **Defect IDs:** `DEF-SEC-001`, `DEF-SEC-002`
* **Severity:** Critical
* **Changes Implemented:**
  - Added helper functions `isAuthenticated()` and `isAdmin()`.
  - Refactored `match /orders/{orderId}`: Revoked unauthenticated read access (`allow read: if true`). Read operations are now constrained to `isAdmin() || (isAuthenticated() && resource.data.customerUid == request.auth.uid)`. Public creation requires non-empty `orderNumber`, `customerName`, and `items` array. Updates and deletes are restricted strictly to active admins.
  - Refactored `match /admins/{adminId}`: Revoked `allow read, write: if request.auth != null`. Admin creation and deletion now strictly require `isAdmin()`. Self-updates are constrained to login timestamp updates without role escalation or active flag mutation.

### 2. `storage.rules` (New File)
* **Defect ID:** `DEF-SEC-004`
* **Severity:** High
* **Changes Implemented:**
  - Created server-side storage rules for `match /{folder}/{imageName}`.
  - Public read access maintained for storefront catalog images.
  - Write access restricted to authenticated users with image MIME type matching `image/(jpeg|jpg|png|webp)` and max file size `< 5MB`. Delete access restricted to authenticated users.

### 3. `firebase.json` (New File)
* **Defect ID:** `DEF-SEC-004`
* **Severity:** High
* **Changes Implemented:**
  - Linked `firestore.rules` and `storage.rules` in standard Firebase configuration format for deployment synchronization.

### 4. `vercel.json`
* **Defect IDs:** `DEF-SEC-003`, `DEF-SEO-002`
* **Severity:** High / Medium
* **Changes Implemented:**
  - Added comprehensive `headers` block for `/(.*)`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and Content-Security-Policy (CSP).
  - Added long-term caching headers (`max-age=31536000, immutable`) for `/images/(.*)` and `/static/(.*)`.
  - Refined SPA rewrite regex to `/((?!api/|.*\\..*).*)` ensuring static files (`sitemap.xml`, `robots.txt`, images) are directly served and bypass the index.html fallback.

### 5. `src/contexts/CartContext.js`
* **Defect ID:** `DEF-CART-001`
* **Severity:** High
* **Changes Implemented:**
  - Refactored `getCartTotal()` to defensively handle null, undefined, and unpriced items using `String(item?.price ?? 0).replace(/[^0-9.]/g, '')`.
  - Guarded `cartItems` state initialization from `localStorage` using `Array.isArray(cart) ? cart : []`.
  - Guarded `addToCart` and `removeFromCart` against non-array previous states.

### 6. `src/pages/CheckoutPage.jsx`
* **Defect IDs:** `DEF-ORD-001`, `DEF-A11Y-001`
* **Severity:** Critical / Medium
* **Changes Implemented:**
  - Removed `console.warn` error-swallowing pattern around `addDoc(collection(db, 'orders'), fullOrderData)`. Database write is now a mandatory blocking requirement.
  - Added `errorMessage` state and rendered a prominent alert banner (`AlertCircle`) if order persistence fails.
  - Cart is strictly preserved if database write fails.
  - Added explicit `htmlFor` and `id` bindings to all form fields (Name, Phone, Email, Event Date, Preferred Time, Delivery Address, Additional Notes). Added explicit `<label>` for Delivery Address.
  - Added `aria-label` to cart item removal buttons.

### 7. `src/services/emailService.js`
* **Defect ID:** `DEF-INT-001`
* **Severity:** High
* **Changes Implemented:**
  - Integrated `AbortController` with `REQUEST_TIMEOUT_MS = 10000` (10 seconds) on webhook requests.
  - Added pre-dispatch object validation on `orderData`.
  - Configured graceful non-blocking error handling.

### 8. `public/images/*` (95 Files Compressed)
* **Defect ID:** `DEF-PERF-001`
* **Severity:** High
* **Changes Implemented:**
  - Compressed 95 oversized PNG and JPG assets using `sharp` within `scripts/optimize-images.js`.
  - Bounding box constrained to max 1200px preserving aspect ratio.
  - PNGs compressed with quality 80 and compression level 9; JPGs with mozjpeg quality 82.
  - Directory size reduced from 193.7 MB to 34.7 MB (139.6 MB saved, 81.1% reduction). Zero paths changed.

### 9. `src/App.js`
* **Defect ID:** `DEF-PERF-001`
* **Severity:** High
* **Changes Implemented:**
  - Implemented route-based code splitting using `React.lazy()` and `Suspense`.
  - Eager-loaded `Home.jsx` for optimal First Contentful Paint.
  - Lazy-loaded all secondary customer views (`Gallery`, `Catering`, `Seasonal`, etc.) and all 13 administrative portals (`DashboardOverview`, `OrderManagement`, `ProductManagement`, etc.).
  - Added branded `PageFallback` loading spinner.

### 10. `public/index.html` & `public/manifest.json`
* **Defect ID:** `DEF-SEO-001`
* **Severity:** Medium
* **Changes Implemented:**
  - Replaced `<title>React App</title>` with `GoodNews Cake & Catering | Artisanal Bakery in Addis Ababa`.
  - Added localized description, keyword meta tags, canonical link, OpenGraph tags, and Twitter Card tags.
  - Injected Schema.org `Bakery` JSON-LD structured data with Addis Ababa address, phone, and opening hours.
  - Updated `manifest.json` with brand name and theme color `#d97706`.

### 11. `public/sitemap.xml` (New File) & `public/robots.txt`
* **Defect ID:** `DEF-SEO-002`
* **Severity:** Medium
* **Changes Implemented:**
  - Created `public/sitemap.xml` indexing all canonical public routes (`/`, `/gallery`, `/custom-order`, `/catering`, `/seasonal`, `/cupcakes`, `/cookies`, `/reviews`, `/about`).
  - Updated `public/robots.txt` with `Sitemap: https://goodnews-cake-and-catering.vercel.app/sitemap.xml` and disallows for `/admin` and `/cart`.

### 12. `src/components/layout/Header.jsx` & `Footer.jsx`
* **Defect IDs:** `DEF-A11Y-001`, `DEF-NAV-001`
* **Severity:** Medium / Low
* **Changes Implemented:**
  - `Header.jsx`: Added `aria-label` to Cart button (`aria-label={`Cart, ${getCartCount()} items`}`), My Account link, Sign In button, and Mobile Menu toggle.
  - `Footer.jsx`: Corrected bakery email spelling (`goodnewscake@gmail.com`), wrapped phone number in `<a href="tel:+251917559943">`, and added valid target links and `aria-label` tags to Instagram and Facebook icons.

### 13. `src/pages/Gallery.jsx`, `Seasonal.jsx`, `Cupcakes.jsx`, `Cookies.jsx`, `Catering.jsx`
* **Defect IDs:** `DEF-A11Y-001`, `DEF-PERF-001`
* **Severity:** Medium / High
* **Changes Implemented:**
  - Added `loading="lazy"` and `decoding="async"` to all catalog product images.
  - `Gallery.jsx`: Injected `Escape` key event listeners to `CakeModal` and `OrderFormModal`. Added `role="dialog"`, `aria-modal="true"`, and accessible names to modal containers and close buttons.

### 14. `src/pages/Home.jsx`
* **Defect ID:** `DEF-UI-001`
* **Severity:** Medium
* **Changes Implemented:**
  - Refactored `heroBadge` initial state string from `'{heroContent.heroBadge || "Where Every Bite Brings Joy"}'` to clean string `'Where Every Bite Brings Joy'`.

### 15. `src/App.test.js` & `src/setupTests.js`
* **Defect ID:** `DEF-TST-001`
* **Severity:** Low
* **Changes Implemented:**
  - Removed broken Create-React-App default test.
  - Authored 6 unit tests in `src/App.test.js` covering order status calculation, manual overrides, elapsed time progression, badge CSS resolution, and cart total parsing.
  - Cleaned up uninstalled dependency import in `src/setupTests.js`.

### 16. `package.json`
* **Defect ID:** `DEF-DEP-001`
* **Severity:** High
* **Changes Implemented:**
  - Removed unneeded `emailjs-com` package.
  - Added npm `overrides` for `nth-check` (`^2.1.1`) and `postcss` (`^8.4.32`).
  - Added `"optimize:images": "node scripts/optimize-images.js"` script.

### 17. Across-the-Board Form Accessibility & Label/Input Bindings
* **Defect ID:** `DEF-A11Y-001` (Residual Component Hardening)
* **Severity:** Medium
* **Files Affected:** `CustomOrder.jsx`, `Reviews.jsx`, `TrackOrder.jsx`, `AdminLogin.jsx`, `Catering.jsx`, `Cookies.jsx`, `Cupcakes.jsx`, `Seasonal.jsx`, `Gallery.jsx`
* **Changes Implemented:**
  - Bound all `<label>` tags with explicit `htmlFor` matching exact `<input>`, `<select>`, and `<textarea>` `id` attributes across all interactive order forms and modals.
  - Added accessible `aria-label` tags to rating buttons in `Reviews.jsx` (1 to 5 stars).
  - Added accessible `aria-label` to password visibility eye toggles in `AdminLogin.jsx`.
  - Added accessible labels to quantity adjustment and removal buttons in `Catering.jsx`.
  - Added accessible search label and aria attributes to `TrackOrder.jsx`.

### 18. Dynamic Per-Route Document Titles & Floating Consultation Accessibility
* **Defect IDs:** `DEF-SEO-001`, `DEF-A11Y-001`
* **Severity:** Medium
* **Files Affected:** `PublicLayout.jsx`, `AdminLayout.jsx`
* **Changes Implemented:**
  - `PublicLayout.jsx`: Injected reactive `useEffect` monitoring `location.pathname` to update `document.title` on client-side route transitions (`/gallery`, `/custom-order`, `/catering`, `/seasonal`, `/cupcakes`, `/cookies`, `/about`, `/reviews`, `/cart`, `/track`, `/profile`).
  - `PublicLayout.jsx`: Added explicit `aria-label="Order via WhatsApp on +251917559943"` to floating action button.
  - `AdminLayout.jsx`: Added reactive `useEffect` dynamically titling administrative sections (`Admin | Products & Cakes - GoodNews Cake`, etc.). Added explicit `aria-label` to sidebar drawer toggles and logout buttons.

### 19. Administrative Modal Keyboard & Screen Reader Accessibility
* **Defect ID:** `DEF-A11Y-001`
* **Severity:** Medium
* **Files Affected:** `ProductManagement.jsx`, `CategoryManagement.jsx`, `ServiceManagement.jsx`, `PromotionManagement.jsx`
* **Changes Implemented:**
  - Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to all create, edit, and deletion dialogs.
  - Added global `Escape` key event listeners allowing administrators to immediately dismiss modals with standard keyboard interaction.
  - Added explicit `aria-label="Close dialog"` to modal close buttons.

---

## 3. Verification Summary

| Gate | Target Command | Result |
| :--- | :--- | :--- |
| **Unit Test Suite** | `npm test -- --watchAll=false` | **PASS** (6/6 tests passed) |
| **Production Build** | `npm run build` | **PASS** (Compiled successfully, 223.68 kB gzip main bundle) |
| **Git Synchronization** | `git push origin main` | **PASS** (Committed and synced to remote repository) |
