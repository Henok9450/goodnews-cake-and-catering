# Application Functionality Inventory
**Application Name:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Repository Branch:** `main` (React 18 SPA on Vercel + Firebase BaaS)  
**Audit Phase:** Phase 1 — Comprehensive QA Assessment Baseline  
**Auditor Role:** Senior Software Quality Assurance Architect & Systems Auditor  

---

## 1. Executive Inventory Overview

GoodNews Cake and Catering is a full-stack e-commerce and bakery operations web application designed for the Addis Ababa confectionery, milestone celebration, and catering market. The system comprises a responsive, client-side rendered Single-Page Application (SPA) customer portal, integrated shopping bag/checkout flow, real-time order tracking, and an extensive role-based administration portal (CMS, order management, inventory, promotions, testimonials, and payment verification).

---

## 2. Route & Page Inventory

### 2.1 Customer-Facing Public Website (`PublicLayout.jsx`)

| Route Path | View / Component | Primary User Objective | Interactive Features & Forms | Data Source / Backing Layer |
|---|---|---|---|---|
| `/` | `src/pages/Home.jsx` | Landing page, brand intro, value propositions, featured reviews | Dynamic CMS hero texts, CTA buttons, real-time approved testimonials stream | Firestore (`website_content/homepage`, `reviews`), local fallback |
| `/gallery` | `src/pages/Gallery.jsx` | Cake product catalog | Filter/category tabs, cake details modal, custom cake configuration modal, "Quick Order" / "Add to Bag" | Firestore (`products` where `category=='cakes'`), fallback to `defaultCakes` |
| `/cupcakes` | `src/pages/Cupcakes.jsx` | Cupcake menu | Cupcake flavor cards, order modal (quantity, flavor, frosting, custom message, notes), "Add to Bag" | Firestore (`products` where `category=='cupcakes'`), fallback to `cupcakes` array |
| `/cookies` | `src/pages/Cookies.jsx` | Artisan cookie batch catalog | Batch size selections, flavor options, cookie order modal, "Add to Bag" | Firestore (`products` where `category=='cookies'`), fallback to `cookies` array |
| `/seasonal` | `src/pages/Seasonal.jsx` | Ethiopian & holiday cakes | Holiday themed cakes (Enkutatash, Fasika, Genna, Timket, Meskel, Graduations, Valentine, Vegan Fasting), order modal, "Add to Bag" | Firestore (`products` where `category=='seasonal'`), fallback to `seasonalItems` |
| `/custom-order` | `src/pages/CustomOrder.jsx` | 3-Step interactive custom cake builder | Multi-step wizard: Step 1 (Cake specifications), Step 2 (Design & themes), Step 3 (Review & add to bag) | Client state + `useCart` hook (`localStorage`) |
| `/catering` | `src/pages/Catering.jsx` | Event & reception catering packages | Tiered dessert buffets, meal boxes, catering quote inquiry modal with guest count & event date | Firestore (`services`), fallback to `cateringItems` |
| `/about` | `src/pages/About.jsx` | Brand history, mission & values | CMS-driven story, mission statement, community commitment cards | Firestore (`website_content/about`), local fallback |
| `/reviews` | `src/pages/Reviews.jsx` | Customer feedback & submission | Interactive 5-star rating input, customer review submission form, approved reviews list | Firestore (`reviews`) with status `approved` vs `pending` |
| `/cart` | `src/pages/CheckoutPage.jsx` | Shopping bag & order checkout | Cart item list, quantity adjustment, item removal, customer details form (name, phone, delivery address, event date, notes), place order action | `localStorage` (`goodnews_cart`), Firestore (`orders`), Google Apps Script Webhook |
| `/track` | `src/pages/TrackOrder.jsx` | Order status lookup | Order number search input, status visual timeline stepper, item breakdown | Firestore (`orders` query by `orderNumber`) |
| `/track/:orderNumber` | `src/pages/TrackOrder.jsx` | Direct link order tracking | Param-driven status tracker with real-time Firestore `onSnapshot` listener | Firestore (`orders`) |
| `/profile` | `src/pages/Profile.jsx` | Customer account dashboard | Google authenticated customer profile, order history query by `customerUid`, sign out | Firebase Auth, Firestore (`orders` where `customerUid == uid`) |

---

### 2.2 Administrative Portal (`AdminLayout.jsx` / `AdminRoute.jsx`)

| Route Path | View / Component | Access Level | Administrative Capabilities | Data Collections Accessed |
|---|---|---|---|---|
| `/admin/login` | `src/pages/admin/AdminLogin.jsx` | Public / Unauth | Email/Password login, Google OAuth redirect/popup sign-in, Initial Administrator bootstrap setup, password reset email trigger | Firebase Auth, Firestore (`admins`) |
| `/admin` | `src/pages/admin/DashboardOverview.jsx` | Authenticated Admin | High-level metrics: total revenue, order count, pending actions, recent orders, quick actions | Firestore (`orders`, `products`, `reviews`, `customers`) |
| `/admin/products` | `src/pages/admin/ProductManagement.jsx` | Authenticated Admin | CRUD operations for bakery products, category assignment, price, inventory quantity, image upload to Firebase Storage, publish/draft toggle | Firestore (`products`, `categories`), Firebase Storage |
| `/admin/categories` | `src/pages/admin/CategoryManagement.jsx` | Authenticated Admin | CRUD for product categories, display order sequencing, slug generation, category cover image upload | Firestore (`categories`), Firebase Storage |
| `/admin/services` | `src/pages/admin/ServiceManagement.jsx` | Authenticated Admin | CRUD for catering packages & custom services, package features list, cover images | Firestore (`services`), Firebase Storage |
| `/admin/orders` | `src/pages/admin/OrderManagement.jsx` | Authenticated Admin | Full order lifecycle management: Status changes (Pending, Confirmed, Preparing, Ready, Delivered, Cancelled), admin notes, payment verification | Firestore (`orders`) |
| `/admin/customers` | `src/pages/admin/CustomerManagement.jsx` | Authenticated Admin | Customer directory, aggregated order statistics per phone/email, customer notes | Firestore (`customers`, `orders`) |
| `/admin/inventory` | `src/pages/admin/InventoryManagement.jsx` | Authenticated Admin | Stock quantities tracking, low stock alerts threshold, stock level manual adjustment | Firestore (`products`) |
| `/admin/payments` | `src/pages/admin/PaymentManagement.jsx` | Authenticated Admin | Payment channel configuration (Telebirr, CBE Bank, Cash on Delivery), transfer remark instructions, manual payment reconciliation | Firestore (`payment_settings`, `orders`) |
| `/admin/promotions` | `src/pages/admin/PromotionManagement.jsx` | Authenticated Admin | Coupon codes, percentage/fixed discounts, promo banners, start/end validity dates | Firestore (`promotions`) |
| `/admin/gallery` | `src/pages/admin/GalleryManagement.jsx` | Authenticated Admin | Showcase gallery images management, tags, customer photo highlights | Firestore (`gallery`), Firebase Storage |
| `/admin/testimonials`| `src/pages/admin/TestimonialManagement.jsx` | Authenticated Admin | Moderation queue for submitted customer reviews: Approve, Reject, Delete | Firestore (`reviews`) |
| `/admin/content` | `src/pages/admin/ContentManagement.jsx` | Authenticated Admin | Real-time CMS for homepage hero banners, about page story, contact details, social links, opening hours | Firestore (`website_content`) |
| `/admin/reports` | `src/pages/admin/ReportsAnalytics.jsx` | Authenticated Admin | Sales reporting, order velocity charts, category revenue breakdown, export capabilities | Firestore (`orders`) |
| `/admin/settings` | `src/pages/admin/AdminSettings.jsx` | Authenticated Admin | Administrative user provisioning (Manager/Superadmin roles), revocation, force database re-seeding tool | Firestore (`admins`, all collections) |

---

## 3. Component & Subsystem Inventory

### 3.1 Global Navigation & Layout
- **Header (`src/components/layout/Header.jsx`):**
  - Operating Hours Real-time Indicator: Computes Addis Ababa local time (UTC+3) and toggles dynamic badge ("Open Today: 8:00 AM - 6:00 PM" vs "Opens Today at 8:00 AM").
  - Click-to-call phone shortcut (`+251 917 559 943`).
  - Multi-level dropdowns for "Shop" (`/gallery`, `/cupcakes`, `/cookies`, `/seasonal`) and "Specialty" (`/custom-order`, `/catering`).
  - Mobile hamburger drawer with animated slide-in menu.
  - Shopping bag badge with real-time item counter connected to `useCart()`.
  - Google Authentication button (switches between "Sign In", User Avatar with dropdown, or Admin badge).
- **Footer (`src/components/layout/Footer.jsx`):**
  - Brand identity, Facebook page link, contact coordinates (Ayat, Addis Ababa), operating hours, dynamic copyright year.
- **Admin Layout (`src/components/admin/AdminLayout.jsx`):**
  - Collapsible sidebar navigation with 13 functional modules, badge counters, active route indicators, quick logout.

### 3.2 State Management & Context Architecture
- **`AuthContext.jsx` (`src/contexts/AuthContext.jsx`):**
  - Global authentication provider encapsulating Firebase Auth (`signInWithEmailAndPassword`, `signInWithRedirect`, `signInWithPopup`, `signOut`).
  - Pre-computed SHA-256 bootstrap administrator hash (`8329102d38896567bdac521d1c1d5e99dff5c11026d408badf469a8b95aa6a2a`).
  - Dynamic admin status verification via Firestore `admins/{uid}`.
- **`CartContext.js` (`src/contexts/CartContext.js`):**
  - Shopping cart provider persisting cart state to browser `localStorage` (`goodnews_cart`).
  - Actions: `addToCart`, `removeFromCart`, `clearCart`, `getCartTotal`, `getCartCount`, `setIsCartOpen`.

### 3.3 Services & External Integrations Layer
- **`firebase.js` (`src/config/firebase.js`):** Initializes Firebase App, Firestore database, Firebase Auth with Google Provider, and Firebase Storage.
- **`productService.js` (`src/services/productService.js`):** Firestore abstraction for querying, creating, updating, and deleting catalog products.
- **`orderService.js` (`src/services/orderService.js`):** Firestore abstraction for orders with status history tracking and payment status tracking.
- **`emailService.js` (`src/services/emailService.js`):** Dispatches asynchronous order notification payloads via HTTP POST (`no-cors`) to Google Apps Script Webhook.
- **`storageService.js` (`src/services/storageService.js`):** Manages file uploads to Firebase Cloud Storage with client-side file size and MIME-type validation.
- **`categoryService.js`, `serviceService.js`, `contentService.js`, `promotionService.js`:** Specialized Firestore collection CRUD helpers.
- **`seedData.js` (`src/utils/seedData.js`):** Comprehensive seed script populating default categories, products, catering packages, and CMS configuration.

---

## 4. Third-Party Integrations & External Services

1. **Vercel Edge Platform:** Hosting environment for frontend React application (`goodnews-cake-and-catering.vercel.app`), SSL termination, and client-side rewrites.
2. **Google Firebase Authentication:** Identity management (Email/Password and Google OAuth 2.0).
3. **Google Cloud Firestore (BaaS):** NoSQL document database hosting 11 primary collections (`admins`, `categories`, `products`, `services`, `orders`, `customers`, `reviews`, `promotions`, `gallery`, `payment_settings`, `website_content`).
4. **Google Cloud Storage for Firebase:** Media asset storage for admin image uploads (`products/`, `categories/`, `services/`, `gallery/`).
5. **Google Apps Script Webhook:** Serverless email notification endpoint (`https://script.google.com/macros/s/AKfycbxIK7toPLy-PQm8s8NeG5WdCMEUVkLvnM1FM5A_psSRMCkUvzmm8CxAXCRumi9S65CU/exec`) relaying customer orders to bakery operations email.
6. **Local Ethiopian Payment Systems (Informational/Manual):** Telebirr mobile wallet and Commercial Bank of Ethiopia (CBE) manual transfer instructions.
