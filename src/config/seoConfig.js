/**
 * SEO & Structured Data Configuration for GoodNews Cake & Catering
 * Aligned with Keyword Research and Search Intent Optimization Matrix
 */

export const SITE_METADATA = {
  siteName: 'GoodNews Cake & Catering',
  businessName: 'GoodNews Cake & Catering',
  siteUrl: 'https://goodnews-cake-and-catering.vercel.app',
  defaultImage: 'https://goodnews-cake-and-catering.vercel.app/images/logo/logo3.png',
  locale: 'en_US',
  currency: 'ETB',
  telephone: '+251917559943',
  email: 'goodnewscake@gmail.com',
  address: {
    streetAddress: 'Ayat',
    addressLocality: 'Addis Ababa',
    addressRegion: 'Addis Ababa',
    postalCode: '1000',
    addressCountry: 'ET'
  },
  geo: {
    latitude: 9.0227,
    longitude: 38.8682
  },
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '18:00'
  },
  socialLinks: [
    'https://web.facebook.com/profile.php?id=61575509915632'
  ]
};

export const ROUTE_SEO_CONFIG = {
  '/': {
    title: 'GoodNews Cake & Catering | Cakes and Catering Services',
    description: 'Discover handcrafted artisanal cakes, custom wedding designs, and luxury catering in Addis Ababa. Order online with reliable delivery across Addis Ababa.',
    canonical: `${SITE_METADATA.siteUrl}/`,
    keywords: 'cake shop in addis ababa, custom cakes addis ababa, catering services addis ababa, wedding cakes addis ababa, birthday cake delivery addis',
    image: `${SITE_METADATA.siteUrl}/images/cakes/wedding-cake-grand.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` }
    ],
    schemaType: 'Bakery'
  },
  '/gallery': {
    title: 'Artisanal Cake Gallery | GoodNews Cake Addis Ababa',
    description: 'Explore handcrafted wedding cakes, birthday cakes, chocolate drips, and celebration designs in Addis Ababa. Choose your size, flavor, and order online.',
    canonical: `${SITE_METADATA.siteUrl}/gallery`,
    keywords: 'cakes in addis ababa, wedding cakes addis ababa, birthday cakes addis ababa, chocolate drip cake, habesha wedding cake',
    image: `${SITE_METADATA.siteUrl}/images/cakes/cake9.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Cake Gallery', url: `${SITE_METADATA.siteUrl}/gallery` }
    ],
    schemaType: 'CollectionPage'
  },
  '/custom-order': {
    title: 'Custom Cake Studio Addis Ababa | GoodNews Cake & Catering',
    description: 'Design your dream celebration cake online in Addis Ababa. Customize flavors, fillings, frostings, tiers, and inscriptions for birthdays and weddings.',
    canonical: `${SITE_METADATA.siteUrl}/custom-order`,
    keywords: 'custom cakes in addis ababa, design cake online addis ababa, custom wedding cakes, custom birthday cakes addis, personalized celebration cake',
    image: `${SITE_METADATA.siteUrl}/images/cakes/two-tier-pearl-celebration.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Custom Cake Studio', url: `${SITE_METADATA.siteUrl}/custom-order` }
    ],
    schemaType: 'Service'
  },
  '/catering': {
    title: 'Catering Services Addis Ababa | GoodNews Cake & Catering',
    description: 'Premium event catering, luxury dessert tables, breakfast spreads, and banquet buffets in Addis Ababa. Book catering for weddings, corporate galas & parties.',
    canonical: `${SITE_METADATA.siteUrl}/catering`,
    keywords: 'catering services in addis ababa, wedding catering addis ababa, dessert table catering, corporate event catering addis, banquet buffet addis ababa',
    image: `${SITE_METADATA.siteUrl}/images/catering/catering1.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Catering Services', url: `${SITE_METADATA.siteUrl}/catering` }
    ],
    schemaType: 'Service'
  },
  '/seasonal': {
    title: 'Ethiopian Holiday & Seasonal Cakes | GoodNews Cake Addis Ababa',
    description: 'Celebrate Ethiopian holidays with handcrafted celebration cakes. Special designs for Enkutatash New Year, Fasika Easter, and Gena Christmas in Addis Ababa.',
    canonical: `${SITE_METADATA.siteUrl}/seasonal`,
    keywords: 'holiday cakes addis ababa, enkutatash new year cake, fasika easter cake addis ababa, gena christmas cake, ethiopian celebration cakes',
    image: `${SITE_METADATA.siteUrl}/images/seasonal/seasonal1.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Seasonal & Holiday Cakes', url: `${SITE_METADATA.siteUrl}/seasonal` }
    ],
    schemaType: 'CollectionPage'
  },
  '/cupcakes': {
    title: 'Gourmet Handcrafted Cupcakes | GoodNews Cake Addis Ababa',
    description: 'Indulge in fresh gourmet cupcakes baked daily in Addis Ababa. Assorted celebration boxes, velvety buttercreams, and custom event cupcake towers.',
    canonical: `${SITE_METADATA.siteUrl}/cupcakes`,
    keywords: 'cupcakes addis ababa, gourmet cupcakes, birthday cupcakes addis ababa, assorted cupcake box, mini cupcakes addis',
    image: `${SITE_METADATA.siteUrl}/images/cupcakes/cupcakes1.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Gourmet Cupcakes', url: `${SITE_METADATA.siteUrl}/cupcakes` }
    ],
    schemaType: 'CollectionPage'
  },
  '/cookies': {
    title: 'Fresh Artisanal Cookies | GoodNews Cake Addis Ababa',
    description: 'Freshly baked artisanal cookies in Addis Ababa. Rich chocolate chip, buttery crumbles, and gourmet gift boxes made with premium ingredients.',
    canonical: `${SITE_METADATA.siteUrl}/cookies`,
    keywords: 'cookies addis ababa, artisanal cookies, fresh baked cookies addis, chocolate chip cookies addis ababa, gourmet cookie box',
    image: `${SITE_METADATA.siteUrl}/images/cookies/cookies1.webp`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Artisanal Cookies', url: `${SITE_METADATA.siteUrl}/cookies` }
    ],
    schemaType: 'CollectionPage'
  },
  '/about': {
    title: 'Our Story & Bakery in Ayat | GoodNews Cake Addis Ababa',
    description: 'Learn about GoodNews Cake & Catering in Ayat, Addis Ababa. Our passion for handcrafted artisanal baking, authentic ingredients, and sweet celebrations.',
    canonical: `${SITE_METADATA.siteUrl}/about`,
    keywords: 'about goodnews cake, bakery ayat addis ababa, artisanal bakery story, best cake shop addis ababa, goodnews catering mission',
    image: `${SITE_METADATA.siteUrl}/images/logo/logo3.png`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'About Us', url: `${SITE_METADATA.siteUrl}/about` }
    ],
    schemaType: 'AboutPage'
  },
  '/reviews': {
    title: 'Customer Reviews & Ratings | GoodNews Cake Addis Ababa',
    description: 'Read authentic reviews from happy customers across Addis Ababa. See why families and event planners choose GoodNews Cake for their sweetest celebrations.',
    canonical: `${SITE_METADATA.siteUrl}/reviews`,
    keywords: 'goodnews cake reviews, cake reviews addis ababa, customer testimonials, best bakery reviews addis',
    image: `${SITE_METADATA.siteUrl}/images/logo/logo3.png`,
    type: 'website',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_METADATA.siteUrl}/` },
      { name: 'Customer Reviews', url: `${SITE_METADATA.siteUrl}/reviews` }
    ],
    schemaType: 'WebPage'
  },
  '/cart': {
    title: 'Shopping Bag & Checkout | GoodNews Cake & Catering',
    description: 'Review your handcrafted cake and catering order. Fast checkout and delivery coordination in Addis Ababa.',
    canonical: `${SITE_METADATA.siteUrl}/cart`,
    indexable: false
  },
  '/track': {
    title: 'Track Your Cake Order Status | GoodNews Cake & Catering',
    description: 'Track your GoodNews Cake preparation and delivery status in real-time.',
    canonical: `${SITE_METADATA.siteUrl}/track`,
    indexable: false
  },
  '/profile': {
    title: 'Customer Profile | GoodNews Cake & Catering',
    description: 'Manage your customer account and view celebration order history.',
    canonical: `${SITE_METADATA.siteUrl}/profile`,
    indexable: false
  }
};

/**
 * Builds structured data schemas based on current page context
 */
export function buildSchemaOrgGraph(routeConfig, customData = {}) {
  const schemas = [];

  // 1. Core Bakery & Organization Schema (Present on all pages)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${SITE_METADATA.siteUrl}/#bakery`,
    'name': SITE_METADATA.businessName,
    'image': SITE_METADATA.defaultImage,
    'url': SITE_METADATA.siteUrl,
    'telephone': SITE_METADATA.telephone,
    'email': SITE_METADATA.email,
    'priceRange': 'ETB',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': SITE_METADATA.address.streetAddress,
      'addressLocality': SITE_METADATA.address.addressLocality,
      'addressRegion': SITE_METADATA.address.addressRegion,
      'addressCountry': SITE_METADATA.address.addressCountry
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': SITE_METADATA.geo.latitude,
      'longitude': SITE_METADATA.geo.longitude
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': SITE_METADATA.openingHours.days,
      'opens': SITE_METADATA.openingHours.opens,
      'closes': SITE_METADATA.openingHours.closes
    },
    'servesCuisine': 'Bakery, Custom Cakes, Event Catering, Artisanal Pastries',
    'areaServed': [
      { '@type': 'City', 'name': 'Addis Ababa' },
      { '@type': 'AdministrativeArea', 'name': 'Ayat' },
      { '@type': 'AdministrativeArea', 'name': 'Bole' },
      { '@type': 'AdministrativeArea', 'name': 'CMC' }
    ],
    'sameAs': SITE_METADATA.socialLinks
  });

  // 2. WebSite Schema (on Homepage)
  if (routeConfig.canonical === `${SITE_METADATA.siteUrl}/`) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_METADATA.siteUrl}/#website`,
      'url': SITE_METADATA.siteUrl,
      'name': SITE_METADATA.siteName,
      'description': routeConfig.description,
      'publisher': {
        '@id': `${SITE_METADATA.siteUrl}/#bakery`
      }
    });
  }

  // 3. BreadcrumbList Schema (on subpages)
  if (routeConfig.breadcrumbs && routeConfig.breadcrumbs.length > 1) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': routeConfig.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    });
  }

  // 4. Service Schema (for Catering and Custom Order)
  if (routeConfig.schemaType === 'Service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': routeConfig.title,
      'serviceType': routeConfig.canonical.includes('catering') ? 'Event Catering & Buffets' : 'Custom Cake Design & Baking',
      'provider': {
        '@id': `${SITE_METADATA.siteUrl}/#bakery`
      },
      'areaServed': {
        '@type': 'City',
        'name': 'Addis Ababa'
      },
      'description': routeConfig.description,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'ETB',
        'availability': 'https://schema.org/InStock'
      }
    });
  }

  return schemas;
}
