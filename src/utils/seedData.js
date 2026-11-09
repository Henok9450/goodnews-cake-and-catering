import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const INITIAL_CATEGORIES = [
    {
        name: 'Cakes',
        slug: 'cakes',
        description: 'Artisanal handcrafted celebration, birthday, and wedding cakes.',
        image: '/images/cakes/cake1.png',
        displayOrder: 1,
        isActive: true
    },
    {
        name: 'Cupcakes',
        slug: 'cupcakes',
        description: 'Single-portion gourmet cupcakes in classic and signature flavors.',
        image: '/images/cupcakes/cupcake1.png',
        displayOrder: 2,
        isActive: true
    },
    {
        name: 'Cookies',
        slug: 'cookies',
        description: 'Freshly baked artisan cookies sold by batch.',
        image: '/images/cookies/cookie1.png',
        displayOrder: 3,
        isActive: true
    },
    {
        name: 'Seasonal Items',
        slug: 'seasonal',
        description: 'Festive holiday and seasonal creations celebrating Ethiopian holidays and special occasions.',
        image: '/images/seasonal/enkutatash.png',
        displayOrder: 4,
        isActive: true
    }
];

export const INITIAL_PRODUCTS = [
    // --- CAKES ---
    {
        name: 'Beautiful Cake Design 1',
        slug: 'beautiful-cake-design-1',
        category: 'cakes',
        description: 'A stunning vanilla cake with buttercream frosting and fresh fruit decorations.',
        ingredients: ['Vanilla sponge', 'Buttercream frosting', 'Fresh fruits', 'Edible flowers'],
        size: '1 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '8-10 people',
        featuredImage: '/images/cakes/cake1.png',
        images: ['/images/cakes/cake1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Chocolate Delight',
        slug: 'chocolate-delight',
        category: 'cakes',
        description: 'Rich chocolate cake with ganache filling and chocolate shavings.',
        ingredients: ['Chocolate sponge', 'Dark chocolate ganache', 'Chocolate shavings', 'Whipped cream'],
        size: '1.5 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '10-12 people',
        featuredImage: '/images/cakes/cake2.png',
        images: ['/images/cakes/cake2.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Red Velvet Elegance',
        slug: 'red-velvet-elegance',
        category: 'cakes',
        description: 'Classic red velvet cake with cream cheese frosting and red velvet crumbs.',
        ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'White chocolate', 'Red velvet crumbs'],
        size: '1 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '8-10 people',
        featuredImage: '/images/cakes/cake3.png',
        images: ['/images/cakes/cake3.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Wedding Special',
        slug: 'wedding-special',
        category: 'cakes',
        description: 'Elegant multi-tier wedding cake with intricate piping and pearl decorations.',
        ingredients: ['Vanilla and chocolate layers', 'Swiss meringue buttercream', 'Edible pearls', 'Gold leaf'],
        size: 'Two-tier (6" & 8")',
        sizes: ['Two-tier', 'Three-tier'],
        servings: '30-40 people',
        featuredImage: '/images/cakes/cake4.png',
        images: ['/images/cakes/cake4.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Fruit Fantasy',
        slug: 'fruit-fantasy',
        category: 'cakes',
        description: 'Light sponge cake loaded with seasonal fruits and whipped cream.',
        ingredients: ['Vanilla sponge', 'Fresh whipped cream', 'Seasonal fruits', 'Fruit glaze'],
        size: '1.5 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '10-12 people',
        featuredImage: '/images/cakes/cake5.png',
        images: ['/images/cakes/cake5.png'],
        status: 'published'
    },
    {
        name: 'Caramel Dream',
        slug: 'caramel-dream',
        category: 'cakes',
        description: 'Moist caramel cake with salted caramel filling and caramel drizzle.',
        ingredients: ['Caramel sponge', 'Salted caramel filling', 'Caramel buttercream', 'Caramel sauce'],
        size: '1 kg',
        sizes: ['1 kg', '1.5 kg'],
        servings: '8-10 people',
        featuredImage: '/images/cakes/cake6.png',
        images: ['/images/cakes/cake6.png'],
        status: 'published'
    },
    {
        name: 'Lemon Zest',
        slug: 'lemon-zest',
        category: 'cakes',
        description: 'Tangy lemon cake with lemon curd filling and lemon glaze.',
        ingredients: ['Lemon sponge', 'Lemon curd', 'Lemon buttercream', 'Candied lemon'],
        size: '1 kg',
        sizes: ['1 kg', '1.5 kg'],
        servings: '8-10 people',
        featuredImage: '/images/cakes/cake7.png',
        images: ['/images/cakes/cake7.png'],
        status: 'published'
    },
    {
        name: 'Birthday Special',
        slug: 'birthday-special',
        category: 'cakes',
        description: 'Fun birthday cake with colorful sprinkles and personalized message.',
        ingredients: ['Choice of flavor', 'Buttercream frosting', 'Colorful sprinkles', 'Custom message'],
        size: '1.5 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '12-15 people',
        featuredImage: '/images/cakes/cake8.png',
        images: ['/images/cakes/cake8.png'],
        status: 'published'
    },
    {
        name: 'Strawberry Pearl Wedding Sheet Cake',
        slug: 'strawberry-pearl-wedding-sheet-cake',
        category: 'cakes',
        description: 'A luxurious rectangular wedding sheet cake adorned with abundant fresh strawberries, elegant pearl piping, and fluffy vanilla buttercream.',
        ingredients: ['Vanilla sponge', 'Fresh strawberries', 'Vanilla buttercream', 'Sugar pearls', 'Strawberry glaze'],
        size: 'Sheet cake (3 kg)',
        sizes: ['Sheet cake (3 kg)', 'Grand Sheet cake (5 kg)'],
        servings: '35-45 people',
        featuredImage: '/images/cakes/wedding-cake-strawberry.png',
        images: ['/images/cakes/wedding-cake-strawberry.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Silver Pearl Grand Wedding Cake',
        slug: 'silver-pearl-grand-wedding-cake',
        category: 'cakes',
        description: 'Grand rectangular celebration cake featuring crisp vertical piping textures, edible silver pearls, and celebratory sparkler accents.',
        ingredients: ['Velvet sponge', 'Swiss meringue buttercream', 'Edible silver pearls', 'White chocolate ganache'],
        size: 'Grand Sheet cake (4 kg)',
        sizes: ['Grand Sheet cake (4 kg)', 'Two-tier grand'],
        servings: '50-60 people',
        featuredImage: '/images/cakes/wedding-cake-grand.png',
        images: ['/images/cakes/wedding-cake-grand.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Golden Pearl Two-Tier Celebration Cake',
        slug: 'golden-pearl-two-tier-celebration-cake',
        category: 'cakes',
        description: 'Sophisticated two-tiered white buttercream cake decorated with shimmering pearls and artisan golden meringue rosettes.',
        ingredients: ['Vanilla & almond sponge', 'Whipped buttercream', 'Edible pearls', 'Golden meringue kisses'],
        size: 'Two-tier (2 kg)',
        sizes: ['Two-tier (2 kg)', 'Three-tier (3.5 kg)'],
        servings: '20-25 people',
        featuredImage: '/images/cakes/two-tier-pearl-celebration.png',
        images: ['/images/cakes/two-tier-pearl-celebration.png'],
        isFeatured: true,
        status: 'published'
    },

    // --- CUPCAKES ---
    {
        name: 'Vanilla Dream Cupcakes',
        slug: 'vanilla-dream-cupcakes',
        category: 'cupcakes',
        description: 'Classic vanilla cupcakes with creamy buttercream frosting and sprinkles.',
        ingredients: ['Vanilla sponge', 'Buttercream frosting', 'Colorful sprinkles', 'Vanilla extract'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake1.png',
        images: ['/images/cupcakes/cupcake1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Chocolate Heaven Cupcakes',
        slug: 'chocolate-heaven-cupcakes',
        category: 'cupcakes',
        description: 'Rich chocolate cupcakes with chocolate ganache and chocolate curls.',
        ingredients: ['Chocolate sponge', 'Dark chocolate ganache', 'Chocolate curls', 'Cocoa powder'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake2.png',
        images: ['/images/cupcakes/cupcake2.png'],
        status: 'published'
    },
    {
        name: 'Red Velvet Bliss Cupcakes',
        slug: 'red-velvet-bliss-cupcakes',
        category: 'cupcakes',
        description: 'Moist red velvet cupcakes with cream cheese frosting and red velvet crumbs.',
        ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'Red velvet crumbs', 'Buttermilk'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake3.png',
        images: ['/images/cupcakes/cupcake3.png'],
        status: 'published'
    },
    {
        name: 'Lemon Zest Cupcakes',
        slug: 'lemon-zest-cupcakes',
        category: 'cupcakes',
        description: 'Tangy lemon cupcakes with lemon buttercream and candied lemon peel.',
        ingredients: ['Lemon sponge', 'Lemon buttercream', 'Candied lemon', 'Lemon zest'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake4.png',
        images: ['/images/cupcakes/cupcake4.png'],
        status: 'published'
    },

    // --- COOKIES ---
    {
        name: 'Classic Chocolate Chip Cookies',
        slug: 'classic-chocolate-chip-cookies',
        category: 'cookies',
        description: 'Buttery cookies loaded with rich chocolate chips for the perfect classic treat.',
        ingredients: ['All-purpose flour', 'Butter', 'Brown sugar', 'Chocolate chips', 'Vanilla extract'],
        size: '3-inch diameter',
        servings: '12 cookies per batch',
        featuredImage: '/images/cookies/cookie1.png',
        images: ['/images/cookies/cookie1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Double Chocolate Cookies',
        slug: 'double-chocolate-cookies',
        category: 'cookies',
        description: 'Rich chocolate cookies with double the chocolate goodness and soft centers.',
        ingredients: ['Cocoa powder', 'Butter', 'Sugar', 'Chocolate chunks', 'Eggs', 'Flour'],
        size: '3-inch diameter',
        servings: '12 cookies per batch',
        featuredImage: '/images/cookies/cookie2.png',
        images: ['/images/cookies/cookie2.png'],
        status: 'published'
    },
    {
        name: 'Oatmeal Raisin Cookies',
        slug: 'oatmeal-raisin-cookies',
        category: 'cookies',
        description: 'Hearty oatmeal cookies with plump raisins and warm cinnamon spice.',
        ingredients: ['Rolled oats', 'Butter', 'Brown sugar', 'Raisins', 'Cinnamon', 'Flour'],
        size: '3-inch diameter',
        servings: '12 cookies per batch',
        featuredImage: '/images/cookies/cookie3.png',
        images: ['/images/cookies/cookie3.png'],
        status: 'published'
    },

    // --- SEASONAL ---
    {
        name: 'Enkutatash Golden Honey Cake (Ethiopian New Year)',
        slug: 'enkutatash-golden-honey-cake',
        category: 'seasonal',
        description: 'A handcrafted Ethiopian New Year celebration cake frosted in golden honey buttercream, garnished with fresh hand-picked yellow Adey Abeba blossoms, real dripping raw honeycomb, and delicate edible gold leaf.',
        ingredients: ['Vanilla sponge', 'Teff-infused honey buttercream', 'Fresh Adey Abeba flowers', 'Raw honeycomb', 'Ethiopian honey drizzle'],
        size: '1.5 kg round cake',
        sizes: ['1 kg', '1.5 kg round cake', '2.5 kg'],
        servings: '12-16 people',
        featuredImage: '/images/seasonal/enkutatash-real.jpg',
        images: ['/images/seasonal/enkutatash-real.jpg'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Habesha Traditional Wedding & Melse Cake',
        slug: 'habesha-traditional-wedding-melse-cake',
        category: 'seasonal',
        description: 'An elegant two-tier ivory celebration cake honoring Ethiopian wedding and Melse traditions with intricate hand-piped Habesha Kemis Tibeb geometric embroidery borders in red, yellow, and green, accented with sugar garden roses.',
        ingredients: ['Velvet almond sponge', 'Vanilla bean buttercream', 'Hand-piped edible Tibeb embroidery', 'Sugar roses', 'Gold leaf'],
        size: 'Two-tier (3.5 kg)',
        sizes: ['Two-tier (3.5 kg)', 'Three-tier (5 kg)'],
        servings: '35-45 people',
        featuredImage: '/images/seasonal/habesha-wedding-melse.jpg',
        images: ['/images/seasonal/habesha-wedding-melse.jpg'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Fasika Ethiopian Easter Celebration Cake',
        slug: 'fasika-ethiopian-easter-celebration-cake',
        category: 'seasonal',
        description: 'A pristine artisanal two-tier celebration cake celebrating Fasika and the joyful breaking of the Great Lent (Hudadi/Abiy Tsom). Features a hand-piped golden Ethiopian Orthodox cross, fresh spring blossoms, and gold leaf on rich buttercream.',
        ingredients: ['Cardamom vanilla sponge', 'Whipped buttercream', 'Handmade gold Orthodox cross', 'Spring edible flowers', 'Gold leaf'],
        size: 'Two-tier (3 kg)',
        sizes: ['Two-tier (3 kg)', 'Three-tier (4.5 kg)'],
        servings: '30-40 people',
        featuredImage: '/images/seasonal/fasika-easter-real.jpg',
        images: ['/images/seasonal/fasika-easter-real.jpg'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'YeGenna Traditional Christmas Fruit Cake',
        slug: 'yegenna-traditional-christmas-fruit-cake',
        category: 'seasonal',
        description: 'Celebrate Ethiopian Christmas (Genna) with our rich traditional fruit cake, bursting with sun-ripened raisins, dates, spices, and local honey, crowned with festive red and green holiday piped rosettes.',
        ingredients: ['Spiced fruit cake', 'Ethiopian honey soak', 'Vanilla bean frosting', 'Cranberries', 'Festive rosettes'],
        size: '1.5 kg round cake',
        sizes: ['1 kg', '1.5 kg round cake', '2.5 kg'],
        servings: '14-18 people',
        featuredImage: '/images/seasonal/gena-celebration.png',
        images: ['/images/seasonal/gena-celebration.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Timket Epiphany Sacred Blessing Cake',
        slug: 'timket-epiphany-sacred-blessing-cake',
        category: 'seasonal',
        description: 'Inspired by the sacred water blessings of Timket (Epiphany), featuring pure blue-and-white marbled ocean watercolor frosting and handcrafted cream peaks symbolizing renewal and purity.',
        ingredients: ['Lemon sponge', 'Elderflower buttercream', 'Blue watercolor glaze', 'Whipped meringue swirls'],
        size: '1.2 kg round cake',
        sizes: ['1.2 kg round cake', '2 kg'],
        servings: '12-16 people',
        featuredImage: '/images/seasonal/Timket1.png',
        images: ['/images/seasonal/Timket1.png'],
        status: 'published'
    },
    {
        name: 'Meskel Blossom Flower Cake',
        slug: 'meskel-blossom-flower-cake',
        category: 'seasonal',
        description: 'Bright golden celebration cake honoring the Demera festival and the yellow Meskel flower season, with tropical fruit compote and warm spices.',
        ingredients: ['Spice sponge', 'Cream cheese frosting', 'Caramel drizzle', 'Adey Abeba flower motif'],
        size: '1.5 kg round cake',
        sizes: ['1 kg', '1.5 kg round cake', '2 kg'],
        servings: '12-16 people',
        featuredImage: '/images/seasonal/meskel.png',
        images: ['/images/seasonal/meskel.png'],
        status: 'published'
    },
    {
        name: 'Graduation & Milestone Success Cake',
        slug: 'graduation-and-milestone-success-cake',
        category: 'seasonal',
        description: 'A decadent dark chocolate celebration cake with artisan chocolate ganache and hand-piped Congratulations script in ivory white chocolate, ideal for university and college graduations in Ethiopia.',
        ingredients: ['Dark chocolate sponge', 'Fudge ganache filling', 'Gold shimmer dust', 'White chocolate lettering'],
        size: '1.5 kg round cake',
        sizes: ['1.5 kg round cake', '2.5 kg'],
        servings: '14-18 people',
        featuredImage: '/images/seasonal/graduation-success.png',
        images: ['/images/seasonal/graduation-success.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Kids 1st Grade Milestone Graduation Cake',
        slug: 'kids-1st-grade-graduation-milestone-cake',
        category: 'seasonal',
        description: 'A festive two-tier graduation cake celebrating young learners with mortarboard cap, ABC blocks, chalkboard, and silver sugar pearls.',
        ingredients: ['Funfetti sponge', 'Whipped vanilla buttercream', 'Fondant toppers', 'Edible pearls'],
        size: '2 kg two-tier cake',
        sizes: ['1.5 kg', '2 kg two-tier cake', '3 kg'],
        servings: '20-25 people',
        featuredImage: '/images/seasonal/kids-graduation.png',
        images: ['/images/seasonal/kids-graduation.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Valentine Romance Heart Cake',
        slug: 'valentine-romance-heart-cake',
        category: 'seasonal',
        description: 'Romantic heart-shaped cake layered with velvety red velvet sponge, smooth cream cheese frosting, and chocolate ganache for Valentine celebrations in Addis Ababa.',
        ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'Chocolate ganache', 'Edible roses'],
        size: 'Heart-shaped cake (1.2 kg)',
        sizes: ['Heart-shaped cake (1.2 kg)', 'Large Heart (2 kg)'],
        servings: '10-12 people',
        featuredImage: '/images/seasonal/valentine-heart.png',
        images: ['/images/seasonal/valentine-heart.png'],
        status: 'published'
    },
    {
        name: 'Ethiopian Orthodox Fasting (Tsom) Vegan Cake',
        slug: 'ethiopian-orthodox-fasting-tsom-vegan-cake',
        category: 'seasonal',
        description: 'A 100% plant-based vegan cake crafted specifically for Ethiopian Orthodox fasting seasons (Hudadi, Tsome Nebiyat, Filseta) with roasted Ethiopian coffee, almond milk, and rich cocoa.',
        ingredients: ['Coffee-infused sponge', 'Almond milk cream', 'Organic coconut frosting', 'Cocoa dust'],
        size: '1.5 kg round cake',
        sizes: ['1 kg', '1.5 kg round cake', '2.5 kg'],
        servings: '14-16 people',
        featuredImage: '/images/seasonal/vegan.png',
        images: ['/images/seasonal/vegan.png'],
        status: 'published'
    }];

export const INITIAL_SERVICES = [
    {
        title: 'Assorted Cupcake Platter',
        slug: 'assorted-cupcake-platter',
        category: 'Catering',
        description: 'A delightful selection of our most popular cupcakes, perfect for any gathering. Includes chocolate, vanilla, red velvet, and lemon flavors.',
        serves: '12-15 people',
        coverImage: '/images/catering/catering1.png',
        images: ['/images/catering/catering1.png'],
        pricingType: 'quote',
        features: ['Freshly baked morning of event', 'Customizable flavor choices', 'Elegant display box included'],
        isFeatured: true,
        status: 'published'
    },
    {
        title: 'Mini Dessert Shots',
        slug: 'mini-dessert-shots',
        category: 'Catering',
        description: 'Elegant and portion-controlled dessert shots. Choose from tiramisu, strawberry cheesecake, or chocolate mousse.',
        serves: '15-20 shots',
        coverImage: '/images/catering/catering2.png',
        images: ['/images/catering/catering2.png'],
        pricingType: 'quote',
        features: ['Bite-sized luxury presentation', 'Mini spoons included', '3 flavor varieties'],
        isFeatured: true,
        status: 'published'
    },
    {
        title: 'Gourmet Brownie & Bar Box',
        slug: 'gourmet-brownie-bar-box',
        category: 'Catering',
        description: 'A rich assortment of fudgy brownies and decadent dessert bars, including caramel, nuts, and chocolate chips.',
        serves: '10-12 people',
        coverImage: '/images/catering/catering3.png',
        images: ['/images/catering/catering3.png'],
        pricingType: 'quote',
        features: ['Fudgy center with crisp tops', 'Nut-free options available'],
        isFeatured: false,
        status: 'published'
    },
    {
        title: 'Mixed Pastry Basket',
        slug: 'mixed-pastry-basket',
        category: 'Catering',
        description: 'An elegant selection of croissants, danishes, and scones, ideal for corporate brunches or morning events.',
        serves: '8-10 people',
        coverImage: '/images/catering/catering4.png',
        images: ['/images/catering/catering4.png'],
        pricingType: 'quote',
        features: ['Perfect for morning corporate events', 'Jam and butter accompaniments'],
        isFeatured: false,
        status: 'published'
    },
    {
        title: 'Wedding & Event Catering Box Package',
        slug: 'wedding-and-event-catering-box-package',
        category: 'Catering',
        description: 'Organized pyramid banquet display of individual gourmet meal boxes with fresh seasonal fruit platters, ideal for receptions and celebrations.',
        serves: '50-100+ guests',
        coverImage: '/images/catering/wedding-catering.png',
        images: ['/images/catering/wedding-catering.png'],
        pricingType: 'quote',
        features: ['Individual sanitized event meal packaging', 'Custom curated banquet menu', 'Fresh seasonal fruit platters included'],
        isFeatured: true,
        status: 'published'
    }
];

export const INITIAL_CMS_CONTENT = {
    homepage: {
        heroBadge: 'Where Every Bite Brings Joy',
        heroTitle: "Celebrate Life's Sweet Moments",
        heroSubtitle: 'Handcrafted cakes for every occasion. From birthdays to weddings, we bake happiness into every slice. Because every good news deserves a sweet celebration!',
        primaryCtaText: 'Order a Custom Cake',
        primaryCtaLink: '/custom-order',
        secondaryCtaText: 'Explore Our Cakes',
        secondaryCtaLink: '/gallery'
    },
    contact: {
        phone: '+251 917 559 943',
        whatsapp: '+251 917 559 943',
        email: 'goodnewscake@gmail.com',
        address: 'Addis Ababa, Ethiopia',
        operatingHours: 'Open Today: 8:00 AM - 6:00 PM',
        deliveryInfo: 'Fast & safe delivery across all sub-cities in Addis Ababa'
    }
};

/**
 * Seed initial data into Firestore if collections are empty
 * @param {boolean} force - Whether to force re-seeding
 */
export const seedDatabaseIfEmpty = async (force = false) => {
    try {
        console.log('🌱 Checking Firestore database status...');
        const productsSnap = await getDocs(collection(db, 'products'));

        if (!productsSnap.empty && !force) {
            console.log(`ℹ️ Products collection already contains ${productsSnap.size} records. Skipping seed.`);
            return { seeded: false, count: productsSnap.size };
        }

        console.log('🚀 Seeding initial categories...');
        for (const cat of INITIAL_CATEGORIES) {
            await addDoc(collection(db, 'categories'), {
                ...cat,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        console.log('🚀 Seeding initial products...');
        for (const prod of INITIAL_PRODUCTS) {
            await addDoc(collection(db, 'products'), {
                ...prod,
                isCustomizable: true,
                isMadeToOrder: true,
                stockQuantity: 10,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        console.log('🚀 Seeding initial catering services...');
        for (const serv of INITIAL_SERVICES) {
            await addDoc(collection(db, 'services'), {
                ...serv,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        console.log('🚀 Seeding CMS content...');
        await setDoc(doc(db, 'website_content', 'homepage'), {
            ...INITIAL_CMS_CONTENT.homepage,
            updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, 'website_content', 'contact'), {
            ...INITIAL_CMS_CONTENT.contact,
            updatedAt: serverTimestamp()
        });

        console.log('✅ Initial database seed completed successfully!');
        return { seeded: true, productsCount: INITIAL_PRODUCTS.length };
    } catch (error) {
        console.error('❌ Failed to seed initial database:', error);
        throw error;
    }
};
