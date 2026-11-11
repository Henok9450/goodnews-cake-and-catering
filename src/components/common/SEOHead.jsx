import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_METADATA, ROUTE_SEO_CONFIG, buildSchemaOrgGraph } from '../../config/seoConfig';

/**
 * SEOHead - Robust Dynamic Head & Metadata Manager for React SPA
 * Dynamically updates document title, meta tags, canonical link, Open Graph, Twitter cards, and Schema.org JSON-LD.
 */
const SEOHead = ({
  customTitle,
  customDescription,
  customImage,
  customCanonical,
  customKeywords,
  isIndexable,
  itemData
}) => {
  const location = useLocation();

  useEffect(() => {
    // Resolve base path for route config
    let basePath = location.pathname;
    if (basePath.startsWith('/track/')) basePath = '/track';

    const routeConfig = ROUTE_SEO_CONFIG[basePath] || ROUTE_SEO_CONFIG['/'];

    // 1. Title
    const title = customTitle || routeConfig.title;
    document.title = title;

    // Helper to safely set or update meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set or update link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    const description = customDescription || routeConfig.description;
    setMetaTag('name', 'description', description);

    const keywords = customKeywords || routeConfig.keywords;
    if (keywords) setMetaTag('name', 'keywords', keywords);

    const indexable = isIndexable !== undefined ? isIndexable : (routeConfig.indexable !== false);
    setMetaTag('name', 'robots', indexable ? 'index, follow' : 'noindex, follow');

    // 3. Canonical URL (Strictly synchronized to avoid duplicate content penalties)
    const canonical = customCanonical || routeConfig.canonical || `${SITE_METADATA.siteUrl}${location.pathname}`;
    setLinkTag('canonical', canonical);

    // 4. Open Graph Tags
    const ogImage = customImage || routeConfig.image || SITE_METADATA.defaultImage;
    setMetaTag('property', 'og:site_name', SITE_METADATA.siteName);
    setMetaTag('property', 'og:locale', SITE_METADATA.locale);
    setMetaTag('property', 'og:type', routeConfig.type || 'website');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', ogImage);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:url', canonical);

    // 6. Dynamic Schema.org JSON-LD Graph
    const schemas = buildSchemaOrgGraph(routeConfig, itemData);
    let scriptTag = document.getElementById('dynamic-page-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-page-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas
    }, null, 2);

  }, [
    location.pathname,
    location.search,
    customTitle,
    customDescription,
    customImage,
    customCanonical,
    customKeywords,
    isIndexable,
    itemData
  ]);

  return null;
};

export default SEOHead;
