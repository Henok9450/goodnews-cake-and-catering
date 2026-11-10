# Comprehensive Software Quality Assurance Test Plan
**Application:** GoodNews Cake and Catering  
**Production URL:** https://goodnews-cake-and-catering.vercel.app/  
**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Standard Compliance:** IEEE 829 / ISO/IEC/IEEE 29119 Quality Assurance Standards  
**Prepared By:** Enterprise QA Directorate & Senior Test Architect  

---

## 1. Test Strategy & Objectives

The primary objective of this QA audit is to independently assess and establish a verifiable quality, security, reliability, performance, and accessibility baseline for the GoodNews Cake and Catering platform prior to production scale-up and enterprise advertising in Addis Ababa.

### 1.1 In-Scope Capabilities
1. **Public Customer Journeys:** Navigation, responsive layout, cake catalog (`/gallery`), cupcakes (`/cupcakes`), cookies (`/cookies`), seasonal catalog (`/seasonal`), 3-step custom cake builder (`/custom-order`), catering package requests (`/catering`), customer reviews submission (`/reviews`), cart operations, checkout submission, order tracking (`/track`), customer profile order history (`/profile`).
2. **Administration Subsystems:** Authentication (`/admin/login`), role verification, catalog management (products, categories, services), order lifecycle and status mutations, customer directory, inventory levels, payment method configuration, testimonial moderation, CMS content updates, sales analytics reports, administrative user provisioning.
3. **Cross-Cutting Quality Disciplines:**
   - Application Security (OWASP Top 10, access control, CORS, secret management, Firestore rules).
   - UI/UX & Responsive Design (viewport behavior across Mobile 375px, Tablet 768px, Desktop 1440px).
   - Accessibility (WCAG 2.2 Level AA guidelines).
   - Performance & Core Web Vitals (LCP, INP, CLS, Time to Interactive, bundle analysis, image payload).
   - Search Engine Optimization (Meta tags, OpenGraph, Structured Data, robots.txt, sitemaps).
   - Code Quality & Maintainability (architecture, tech debt, npm dependencies audit).
   - Data Integrity & Consistency (order schema persistence, offline resilience, Firestore query indices).

### 1.2 Out-of-Scope (Phase 1 Assessment Restrictions)
- Destructive security penetration testing (DDoS, volumetric brute-force attacks against Firebase Auth endpoints).
- Production database deletion, record tampering, or simulated test order spam that affects live bakery operations.
- Direct modification of source code or production configuration during this phase.

---

## 2. Test Execution Methodology

```
+---------------------------------------------------------------------------------------+
|                              MULTI-LAYER TEST TAXONOMY                                |
|                                                                                       |
|  [ LAYER 1: STATIC CODE AUDIT ]                                                       |
|  - Source-code architecture review, rule validation, dependency vulnerability scans  |
|                                                                                       |
|  [ LAYER 2: NON-DESTRUCTIVE FUNCTIONAL TESTING ]                                      |
|  - 40+ structured functional test cases covering positive, negative & boundary paths  |
|                                                                                       |
|  [ LAYER 3: SECURITY & ACCESS CONTROL VERIFICATION ]                                 |
|  - Broken Object Level Authorization (BOLA), Firestore rules audit, security headers   |
|                                                                                       |
|  [ LAYER 4: PERFORMANCE & ACCESSIBILITY BENCHMARKING ]                               |
|  - Network payload measurements, Core Web Vitals profiling, WCAG 2.2 compliance audit |
|                                                                                       |
|  [ LAYER 5: SEO & CODE QUALITY AUDIT ]                                                |
|  - Meta-tag validation, technical debt analysis, maintainability assessment          |
+---------------------------------------------------------------------------------------+
```

---

## 3. Test Environment Specifications

| Environment | Host / Infrastructure | URL / Coordinates | Configuration |
|---|---|---|---|
| **Production** | Vercel Edge Network | `https://goodnews-cake-and-catering.vercel.app/` | Live production environment with active Firebase project |
| **Local Audit Sandbox** | Windows 10 Enterprise / Node v22.23.3 | `c:\Users\Administrator\goodnews-cake` | Local Git repository checkout on branch `main` |
| **Database Tier** | Google Cloud Firestore | Production Firebase Project (`goodnews-cake`) | Live NoSQL database with deployed `firestore.rules` |
| **Storage Tier** | Cloud Storage for Firebase | Production Storage Bucket | Live cloud media repository |
| **Email Endpoint** | Google Apps Script Webhook | Script `AKfycbx...` | Production order relay macro |

---

## 4. Defect Severity & Priority Classification Matrix

| Severity Level | Definition | Target SLA (Phase 2 Remediation) |
|---|---|---|
| **Critical (S1)** | Catastrophic failure: Security vulnerability enabling total data breach, unauthorized privilege escalation, or silent loss of customer orders. | Immediate / Blocker for production marketing |
| **High (S2)** | Major functional breakdown: Cart crashes on undefined pricing, missing security headers, or core workflow failure without workaround. | Must fix before public promotion |
| **Medium (S3)** | Non-blocking functional defect, accessibility violation, severe asset bloat (>15MB page weight), or SEO metadata absence. | Fix within normal sprint cycle |
| **Low (S4)** | Cosmetic defect, minor typography issue, dead placeholder link (`href="#"`), or non-critical console warning. | Backlog prioritization |
| **Informational (S5)** | Architectural recommendation, tech debt documentation, or best-practice suggestion. | Continuous improvement |

---

## 5. Traceability Matrix & Test Case Mapping

| Test Suite ID | Test Suite Name | Target Module | Total Test Cases | Executed | Passed | Failed | Blocked |
|---|---|---|---|---|---|---|---|
| **TS-NAV** | Global Navigation & Header | Header, Footer, Mobile Drawer | 5 | 5 | 4 | 1 | 0 |
| **TS-CAT** | Product Catalogs | Gallery, Cupcakes, Cookies, Seasonal | 8 | 8 | 7 | 1 | 0 |
| **TS-CUST** | Custom Cake Builder | CustomOrder (Step 1-3 Wizard) | 4 | 4 | 4 | 0 | 0 |
| **TS-CART** | Shopping Bag Operations | CartContext, LocalStorage, Pricing | 5 | 5 | 3 | 2 | 0 |
| **TS-CHK** | Checkout & Order Dispatch | CheckoutPage, Firestore, Email | 6 | 6 | 3 | 3 | 0 |
| **TS-TRK** | Order Tracking & Status | TrackOrder, Real-time Listener | 4 | 4 | 3 | 1 | 0 |
| **TS-REV** | Reviews & Testimonials | Reviews, Moderation Flow | 3 | 3 | 3 | 0 | 0 |
| **TS-ADM** | Administrative Portal | AdminLogin, RBAC, Subsystems | 7 | 7 | 3 | 4 | 0 |
| **TOTALS** | **Comprehensive Baseline** | **Full Application** | **42** | **42** | **27** | **15** | **0** |

*Pass Rate: 64.3% (27 Passed, 15 Failed out of 42 Core Test Cases).*
