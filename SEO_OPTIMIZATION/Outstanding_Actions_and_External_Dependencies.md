# OUTSTANDING ACTIONS AND EXTERNAL DEPENDENCIES
**Project:** GoodNews Cake & Catering  
**Production URL:** `https://goodnews-cake-and-catering.vercel.app/`  
**Date:** November 11, 2026  
**Auditor / Strategist:** Lead Technical SEO Specialist  

---

## 1. External Account Dependencies & Action Checklist

The codebase, technical SEO infrastructure, on-page content, and structured data are complete. To achieve live search ranking and local map discovery, the following external accounts must be accessed or verified by the business owner:

| Task / Dependency | Platform | Required Action | Status |
| :--- | :--- | :--- | :--- |
| **Google Search Console Property** | Google Search Console | 1. Add domain property `https://goodnews-cake-and-catering.vercel.app/`.<br>2. Verify ownership (via HTML tag, DNS record on domain, or Google Analytics).<br>3. Submit XML sitemap: `https://goodnews-cake-and-catering.vercel.app/sitemap.xml`.<br>4. Monitor crawl status and URL inspection. | ⏳ Requires Google Account Access |
| **Google Business Profile Claim & Verification** | Google Business Profile | 1. Claim or create `GoodNews Cake & Catering`.<br>2. Verify physical location in Ayat, Addis Ababa (via postcard, phone, or video verification).<br>3. Input verified NAP: `+251 917 559 943`, Ayat, Addis Ababa.<br>4. Upload the recommended high-resolution cake and catering photographs. | ⏳ Requires Business Owner Verification |
| **Bing Webmaster Tools** | Bing Webmaster Tools | 1. Import verified Google Search Console property into Bing Webmaster Tools.<br>2. Submit sitemap to Bing for Yahoo and Edge discovery. | ⏳ Requires Account Access |
| **Official Instagram Handle** | Instagram | 1. Confirm official business Instagram handle (e.g. `@goodnewscake_addis`).<br>2. Update link in `src/components/layout/Footer.jsx` from generic `instagram.com` to the official profile. | ⏳ Awaiting Handle Confirmation |
| **Google Analytics 4 (GA4)** | Google Analytics | Monitor organic landing page performance, UTM referral tags from social media, and conversions (WhatsApp order clicks and checkout submissions). | ⏳ Requires GA4 Property Setup |

---

## 2. Google Search Console Setup Instructions (Step-by-Step)

1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Select **URL prefix** and enter:  
   `https://goodnews-cake-and-catering.vercel.app/`
4. Choose verification method:
   - **Recommended for Vercel:** Select **HTML tag** and add the verification meta tag `<meta name="google-site-verification" content="..." />` to `public/index.html`, OR verify via Google Analytics / DNS.
5. Once verified, navigate to **Sitemaps** in the left sidebar.
6. Enter `sitemap.xml` and click **Submit**.
7. Confirm that Google reports *"Success"* with 9 discovered pages.

---

## 3. Post-Launch Monitoring Routine

- **Week 1–2:** Verify that all 9 pages appear in the Google Search Console "Indexed" coverage report.
- **Week 3–4:** Monitor the **Performance** report for search queries (`wedding cakes addis ababa`, `cakes in addis ababa`, `catering addis ababa`) and impressions.
- **Monthly:** Collect genuine customer reviews on Google Business Profile to build local authority and map prominence.
