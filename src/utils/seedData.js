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
        name: 'Romantic Proposal Silhouette Cake',
        slug: 'romantic-proposal-silhouette-cake',
        category: 'cakes',
        description: 'A graceful single-tier ivory celebration cake decorated with edible gold pearls, two fluttering pink butterflies, and a black silhouette cutout of a marriage proposal.',
        ingredients: ['Vanilla velvet sponge', 'Smooth buttercream frosting', 'Edible gold pearls', 'Silhouette fondant cutout', 'Sugar butterflies'],
        size: '1 kg',
        sizes: ['1 kg', '1.5 kg', '2 kg'],
        servings: '8-10 people',
        featuredImage: '/images/cakes/cake1.png',
        images: ['/images/cakes/cake1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Blush Bridal Gown Celebration Cake',
        slug: 'blush-bridal-gown-celebration-cake',
        category: 'cakes',
        description: 'An exquisite two-tier soft blush pink cake embellished with silver pearls and a sculpted blonde bride figurine wearing a low-back wedding gown with a flowing fondant train.',
        ingredients: ['Almond sponge', 'Blush buttercream frosting', 'Silver sugar pearls', 'Hand-sculpted bride figurine', 'Fondant gown train'],
        size: 'Two-tier (2 kg)',
        sizes: ['Two-tier (2 kg)', 'Three-tier (3.5 kg)'],
        servings: '18-22 people',
        featuredImage: '/images/cakes/cake2.png',
        images: ['/images/cakes/cake2.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Modern Floating Tier Wedding Cake',
        slug: 'modern-floating-tier-wedding-cake',
        category: 'cakes',
        description: 'A sophisticated contemporary two-tier ivory celebration cake featuring a vertical golden hoop separator, gold-vein gilded edges, and handcrafted blush pink sugar roses.',
        ingredients: ['Vanilla bean sponge', 'Ivory smooth buttercream', 'Edible gold leaf trim', 'Handcrafted sugar roses', 'Sugar leaves'],
        size: 'Two-tier (2 kg)',
        sizes: ['Two-tier (2 kg)', 'Three-tier (3.5 kg)'],
        servings: '18-22 people',
        featuredImage: '/images/cakes/cake3.png',
        images: ['/images/cakes/cake3.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Maternity & Baby Shower Celebration Cake',
        slug: 'maternity-baby-shower-celebration-cake',
        category: 'cakes',
        description: 'A heartfelt single-tier white textured buttercream cake featuring an expectant mother silhouette topper, framed by a cascading arch of pink and ivory fondant bubbles and silver pearls.',
        ingredients: ['Vanilla sponge', 'Whipped buttercream frosting', 'Fondant bubble spheres', 'Silver dragees', 'Maternity silhouette topper'],
        size: '1.5 kg',
        sizes: ['1.5 kg', '2 kg'],
        servings: '12-15 people',
        featuredImage: '/images/cakes/cake4.png',
        images: ['/images/cakes/cake4.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Vintage Crimson Lambeth Ribbon Cake',
        slug: 'vintage-crimson-lambeth-ribbon-cake',
        category: 'cakes',
        description: 'A dramatic baroque Lambeth-style cake finished in rich crimson-red frosting, featuring ornate piped shell borders, side swags, and contrasting black satin ribbon bows.',
        ingredients: ['Rich chocolate sponge', 'Crimson buttercream', 'Lambeth piped swags', 'Black satin ribbon bows'],
        size: '1.2 kg',
        sizes: ['1.2 kg', '2 kg'],
        servings: '10-12 people',
        featuredImage: '/images/cakes/cake5.png',
        images: ['/images/cakes/cake5.png'],
        status: 'published'
    },
    {
        name: 'Couture Low-Back Bridal Silhouette Cake',
        slug: 'couture-low-back-bridal-silhouette-cake',
        category: 'cakes',
        description: 'A stunning bridal celebration cake featuring an illustrated bride figurine in a low-back lace gown with a cascading tiered white petal skirt, golden waist corsage, and piped floral rim.',
        ingredients: ['Vanilla velvet sponge', 'White buttercream frosting', 'Fondant petal tiers', 'Gold luster dust', 'Handmade floral accents'],
        size: '1.5 kg',
        sizes: ['1.5 kg', '2 kg'],
        servings: '12-15 people',
        featuredImage: '/images/cakes/cake6.png',
        images: ['/images/cakes/cake6.png'],
        status: 'published'
    },
    {
        name: 'Habesha Traditional Bridal & Milestone Cake',
        slug: 'habesha-traditional-bridal-milestone-cake',
        category: 'cakes',
        description: 'A meaningful Ethiopian celebration cake decorated with an Ethiopian maiden figurine in Habesha Kemis, floral wreath, gold pearls, and heart toppers scripted in Ge\'ez Amharic fidel.',
        ingredients: ['Spiced vanilla sponge', 'Whipped buttercream', 'Edible Habesha gown motif', 'Amharic fidel toppers', 'Gold sugar pearls'],
        size: '1.5 kg',
        sizes: ['1.5 kg', '2 kg'],
        servings: '12-15 people',
        featuredImage: '/images/cakes/cake7.png',
        images: ['/images/cakes/cake7.png'],
        status: 'published'
    },
    {
        name: 'Romantic "LOVE" Anniversary Cake',
        slug: 'romantic-love-anniversary-cake',
        category: 'cakes',
        description: 'A pristine white anniversary cake featuring bold sculpted red letters spelling "LOVE", red rosebuds, scattered red hearts, and "HAPPY ANNIVERSARY" lettering on the cake board.',
        ingredients: ['Red velvet & vanilla sponge', 'Smooth buttercream', 'Sculpted red fondant roses', 'Red fondant lettering', 'Silver dragees'],
        size: '1.5 kg',
        sizes: ['1.5 kg', '2 kg'],
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
        name: 'Cream-Filled Chocolate Confetti Cupcakes',
        slug: 'cream-filled-chocolate-confetti-cupcakes',
        category: 'cupcakes',
        description: 'Tender dark chocolate cupcakes with a surprise vanilla marshmallow-cream center, coated in chocolate icing and dense rainbow nonpareil sprinkles.',
        ingredients: ['Dark cocoa sponge', 'Vanilla marshmallow-cream filling', 'Chocolate fudge icing', 'Rainbow nonpareil sprinkles'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake1.png',
        images: ['/images/cupcakes/cupcake1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Easter Bunny Sprinkled Cupcakes',
        slug: 'easter-bunny-sprinkled-cupcakes',
        category: 'cupcakes',
        description: 'Playful golden sponge cupcakes topped with a rounded vanilla frosting dome rolled in white sugar sprinkles, marshmallow bunny ears, and pink candy accents.',
        ingredients: ['Golden sponge', 'Vanilla buttercream', 'Crisp white sprinkles', 'Marshmallow bunny ears', 'Jelly bean accents'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake2.png',
        images: ['/images/cupcakes/cupcake2.png'],
        status: 'published'
    },
    {
        name: 'Fresh Strawberry Buttercream Swirl Cupcakes',
        slug: 'fresh-strawberry-buttercream-swirl-cupcakes',
        category: 'cupcakes',
        description: 'Golden vanilla cupcakes baked in crimson fluted liners, crowned with towering swirls of strawberry buttercream and garnished with fresh ripe strawberry slices.',
        ingredients: ['Vanilla sponge', 'Real strawberry buttercream', 'Fresh ripe strawberries', 'Strawberry glaze'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake3.png',
        images: ['/images/cupcakes/cupcake3.png'],
        status: 'published'
    },
    {
        name: 'Spring Farmyard Animal Cupcake Assortment',
        slug: 'spring-farmyard-animal-cupcake-assortment',
        category: 'cupcakes',
        description: 'Delightful chocolate cupcakes whimsically decorated as spring farmyard friends: yellow marshmallow baby chicks, mini-marshmallow lambs, and digging bunny paws.',
        ingredients: ['Moist chocolate sponge', 'Miniature marshmallows', 'Vanilla buttercream', 'Fondant animal faces', 'Pastel candy accents'],
        size: 'Standard cupcake',
        servings: '1 person per cupcake',
        featuredImage: '/images/cupcakes/cupcake4.png',
        images: ['/images/cupcakes/cupcake4.png'],
        status: 'published'
    },

    // --- COOKIES ---
    {
        name: 'Warm Brown Butter Chocolate Chip Cookies',
        slug: 'warm-brown-butter-chocolate-chip-cookies',
        category: 'cookies',
        description: 'Golden brown, crispy-edged cookies with soft chewy centers, bursting with melted chocolate chips, served warm with a fresh glass of milk.',
        ingredients: ['Brown butter', 'Semi-sweet chocolate chips', 'Brown sugar', 'Vanilla extract', 'Flour', 'Sea salt'],
        size: '3-inch diameter',
        servings: '12 cookies per batch',
        featuredImage: '/images/cookies/cookie1.png',
        images: ['/images/cookies/cookie1.png'],
        isFeatured: true,
        status: 'published'
    },
    {
        name: 'Fudgy Double Chocolate Chunk Cookies',
        slug: 'fudgy-double-chocolate-chunk-cookies',
        category: 'cookies',
        description: 'Decadent dark Dutch cocoa cookies loaded with molten dark chocolate chunks and a rich, gooey chocolate fudge center.',
        ingredients: ['Dutch cocoa powder', 'Dark chocolate chunks', 'Creamery butter', 'Cane sugar', 'Flour', 'Vanilla'],
        size: '3-inch diameter',
        servings: '12 cookies per batch',
        featuredImage: '/images/cookies/cookie2.png',
        images: ['/images/cookies/cookie2.png'],
        status: 'published'
    },
    {
        name: 'Rustic Cinnamon Oatmeal Raisin Cookies',
        slug: 'rustic-cinnamon-oatmeal-raisin-cookies',
        category: 'cookies',
        description: 'Hearty rolled-oat bakery cookies packed with plump sweet raisins, warm aromatic cinnamon, and a delicate dusting of confectioners\' sugar.',
        ingredients: ['Rolled oats', 'Plump raisins', 'Ground cinnamon', 'Brown sugar', 'Creamery butter', 'Flour'],
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
        title: 'Grand Continental Dessert & Pastry Banquet Table',
        slug: 'grand-continental-dessert-and-pastry-banquet-table',
        category: 'Catering',
        description: 'A lavish multi-tiered dessert buffet presentation featuring woven strawberry basket cake, glazed fresh fruit tarts, golden croissants, fruit danishes, and gourmet confections.',
        serves: '40-75 people',
        coverImage: '/images/catering/catering1.png',
        images: ['/images/catering/catering1.png'],
        pricingType: 'quote',
        features: ['Freshly baked morning of event', 'Multi-tiered wrought-iron banquet display', 'Includes fresh fruit tarts & artisan pastries'],
        isFeatured: true,
        status: 'published'
    },
    {
        title: 'Elegant Wedding & Celebration Dessert Table Display',
        slug: 'elegant-wedding-and-celebration-dessert-table-display',
        category: 'Catering',
        description: 'Sophisticated dessert display centered around a floral-topped semi-naked celebration cake, flanked by tall taper candles, mini cupcake risers, brownie towers, and dessert shooter parfaits.',
        serves: '30-60 people',
        coverImage: '/images/catering/catering2.png',
        images: ['/images/catering/catering2.png'],
        pricingType: 'quote',
        features: ['Bite-sized luxury presentation', 'Fresh floral and candle styling', 'Curated brownie, parfait, and cupcake risers'],
        isFeatured: true,
        status: 'published'
    },
    {
        title: 'Modern Minimalist Plinth Pastry & Fruit Display',
        slug: 'modern-minimalist-plinth-pastry-and-fruit-display',
        category: 'Catering',
        description: 'Contemporary stepped white plinth buffet presentation showcasing flaky golden croissants, piped cream tartlets, French macaron tower, and fresh seasonal berry bowls.',
        serves: '20-35 people',
        coverImage: '/images/catering/catering3.png',
        images: ['/images/catering/catering3.png'],
        pricingType: 'quote',
        features: ['Clean geometric white plinth risers', 'French macarons and butter croissants', 'Fresh seasonal berry and fruit bowls'],
        isFeatured: false,
        status: 'published'
    },
    {
        title: 'Executive Brunch & Cocktail Pastry Spread',
        slug: 'executive-brunch-and-cocktail-pastry-spread',
        category: 'Catering',
        description: 'A vibrant catering spread featuring colorful stemmed cocktail goblets, glazed morning donuts, raspberry waffle bites, lemon curd tarts, mini cupcakes, and fresh sliced fruit platters.',
        serves: '25-40 people',
        coverImage: '/images/catering/catering4.png',
        images: ['/images/catering/catering4.png'],
        pricingType: 'quote',
        features: ['Stemmed cocktail/mocktail service included', 'Mini waffle bites & morning donuts', 'Fresh sliced tropical fruit platters'],
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

export const INITIAL_ORDERS = [
    {
        id: 'order-gn-1001',
        orderNumber: 'GN-202611-1001',
        orderType: 'Custom Wedding Cake Order',
        name: 'Selamawit Tadesse',
        customerName: 'Selamawit Tadesse',
        email: 'selamawit.t@gmail.com',
        customerEmail: 'selamawit.t@gmail.com',
        phone: '+251 911 234 567',
        customerPhone: '+251 911 234 567',
        deliveryAddress: 'Bole Medhanealem, Atlas area, House #402, Addis Ababa',
        address: 'Bole Medhanealem, Atlas area, House #402, Addis Ababa',
        eventDate: '2026-11-15',
        deliveryTime: '2:00 PM',
        orderSummary: 'Modern Floating Tier Wedding Cake (Two-tier, Vanilla & Almond)',
        totalPrice: 'ETB 4,500',
        orderStatus: 'Confirmed',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentReference: 'CBE-BIRR-98437291',
        customerUid: 'guest',
        orderDate: '11/10/2026',
        orderTime: '10:30 AM',
        items: [
            {
                id: 'item-1001',
                title: 'Modern Floating Tier Wedding Cake',
                price: 'ETB 4,500',
                details: {
                    quantity: 1,
                    size: 'Two-tier (2 kg)',
                    flavor: 'Vanilla Bean & Almond Velvet',
                    filling: 'White Chocolate Ganache',
                    frosting: 'Ivory Smooth Buttercream',
                    message: 'Congratulations Selam & Dawit',
                    special: 'Deliver in air-conditioned vehicle. Call wedding coordinator on arrival.'
                }
            }
        ],
        statusHistory: [
            { status: 'Pending', timestamp: '2026-11-10T07:30:00.000Z', note: 'Order submitted via website', changedBy: 'System' },
            { status: 'Confirmed', timestamp: '2026-11-10T08:15:00.000Z', note: 'Deposit verified via CBE Birr', changedBy: 'Admin' }
        ]
    },
    {
        id: 'order-gn-1002',
        orderNumber: 'GN-202611-1002',
        orderType: 'Birthday Celebration Cake',
        name: 'Yonas Birhanu',
        customerName: 'Yonas Birhanu',
        email: 'yonas.birhanu@gmail.com',
        customerEmail: 'yonas.birhanu@gmail.com',
        phone: '+251 912 345 678',
        customerPhone: '+251 912 345 678',
        deliveryAddress: 'Kazanchis, UNECA area, Grand Palace Apts, Addis Ababa',
        address: 'Kazanchis, UNECA area, Grand Palace Apts, Addis Ababa',
        eventDate: '2026-11-18',
        deliveryTime: '11:30 AM',
        orderSummary: 'Romantic Proposal Silhouette Cake (1.5 kg, Chocolate Fudge)',
        totalPrice: 'ETB 2,800',
        orderStatus: 'Preparing',
        status: 'Preparing',
        paymentStatus: 'Paid',
        paymentReference: 'TELEBIRR-82746194',
        customerUid: 'guest',
        orderDate: '11/11/2026',
        orderTime: '02:15 PM',
        items: [
            {
                id: 'item-1002',
                title: 'Romantic Proposal Silhouette Cake',
                price: 'ETB 2,800',
                details: {
                    quantity: 1,
                    size: '1.5 kg',
                    flavor: 'Rich Chocolate Fudge',
                    frosting: 'Smooth Buttercream',
                    message: 'Happy 30th Birthday Aster!',
                    special: 'Add extra edible gold pearls around the base'
                }
            }
        ],
        statusHistory: [
            { status: 'Pending', timestamp: '2026-11-11T11:15:00.000Z', note: 'Order submitted online', changedBy: 'System' },
            { status: 'Confirmed', timestamp: '2026-11-11T11:45:00.000Z', note: 'Payment confirmed via Telebirr', changedBy: 'Admin' },
            { status: 'Preparing', timestamp: '2026-11-12T06:00:00.000Z', note: 'Cake base baked, decorating in progress', changedBy: 'Bakery Chef' }
        ]
    },
    {
        id: 'order-gn-1003',
        orderNumber: 'GN-202611-1003',
        orderType: 'Holiday Celebration & Pastry Batch',
        name: 'Bethlehem Haile',
        customerName: 'Bethlehem Haile',
        email: 'bethlehem.haile@yahoo.com',
        customerEmail: 'bethlehem.haile@yahoo.com',
        phone: '+251 922 456 789',
        customerPhone: '+251 922 456 789',
        deliveryAddress: 'CMC Michael, Sunshine Real Estate, Villa 12, Addis Ababa',
        address: 'CMC Michael, Sunshine Real Estate, Villa 12, Addis Ababa',
        eventDate: '2026-11-20',
        deliveryTime: '3:00 PM',
        orderSummary: 'Enkutatash Golden Honey Cake + Dozen Chocolate Cupcakes',
        totalPrice: 'ETB 4,400',
        orderStatus: 'Pending',
        status: 'Pending',
        paymentStatus: 'Pending',
        paymentReference: null,
        customerUid: 'guest',
        orderDate: '11/12/2026',
        orderTime: '09:00 AM',
        items: [
            {
                id: 'item-1003a',
                title: 'Enkutatash Golden Honey Cake (Ethiopian New Year)',
                price: 'ETB 3,200',
                details: {
                    quantity: 1,
                    size: '1.5 kg round cake',
                    flavor: 'Teff Honey & Vanilla',
                    frosting: 'Golden Honey Buttercream',
                    message: 'Melkam Beal!'
                }
            },
            {
                id: 'item-1003b',
                title: 'Cream-Filled Chocolate Confetti Cupcakes (Dozen)',
                price: 'ETB 1,200',
                details: {
                    quantity: 12,
                    flavor: 'Dark Cocoa with Marshmallow Cream'
                }
            }
        ],
        statusHistory: [
            { status: 'Pending', timestamp: '2026-11-12T06:00:00.000Z', note: 'New customer order awaiting review', changedBy: 'System' }
        ]
    },
    {
        id: 'order-gn-1004',
        orderNumber: 'GN-202611-1004',
        orderType: 'Corporate Catering Service',
        name: 'Dawit Alemayehu',
        customerName: 'Dawit Alemayehu',
        email: 'dawit.alemayehu@corp-events.et',
        customerEmail: 'dawit.alemayehu@corp-events.et',
        phone: '+251 930 567 890',
        customerPhone: '+251 930 567 890',
        deliveryAddress: 'Sarbet, Old Airport Commercial Center, 3rd Floor, Addis Ababa',
        address: 'Sarbet, Old Airport Commercial Center, 3rd Floor, Addis Ababa',
        eventDate: '2026-11-22',
        deliveryTime: '10:00 AM',
        orderSummary: 'Corporate Pastry & Dessert Catering Platter (Serves 40-50)',
        totalPrice: 'ETB 8,500',
        orderStatus: 'Confirmed',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentReference: 'ZEMEN-TRF-440291',
        customerUid: 'guest',
        orderDate: '11/08/2026',
        orderTime: '04:30 PM',
        items: [
            {
                id: 'item-1004',
                title: 'Corporate Pastry & Dessert Catering Platter',
                price: 'ETB 8,500',
                details: {
                    serves: '40-50 people',
                    features: 'Assorted fruit tarts, chocolate eclairs, savory mini quiches'
                }
            }
        ],
        statusHistory: [
            { status: 'Pending', timestamp: '2026-11-08T13:30:00.000Z', note: 'Corporate quote accepted', changedBy: 'System' },
            { status: 'Confirmed', timestamp: '2026-11-09T08:00:00.000Z', note: 'Bank transfer verified from Zemen Bank', changedBy: 'Admin' }
        ]
    },
    {
        id: 'order-gn-1005',
        orderNumber: 'GN-202611-1005',
        orderType: 'Anniversary Cake Order',
        name: 'Rahel Bekele',
        customerName: 'Rahel Bekele',
        email: 'rahel.bekele@outlook.com',
        customerEmail: 'rahel.bekele@outlook.com',
        phone: '+251 913 678 901',
        customerPhone: '+251 913 678 901',
        deliveryAddress: 'Piazza, Cunningham St, House #88, Addis Ababa',
        address: 'Piazza, Cunningham St, House #88, Addis Ababa',
        eventDate: '2026-11-10',
        deliveryTime: '1:00 PM',
        orderSummary: 'Romantic "LOVE" Anniversary Cake (1.5 kg, Red Velvet)',
        totalPrice: 'ETB 3,500',
        orderStatus: 'Delivered / Completed',
        status: 'Delivered / Completed',
        paymentStatus: 'Paid',
        paymentReference: 'TELEBIRR-10928374',
        customerUid: 'guest',
        orderDate: '11/05/2026',
        orderTime: '11:00 AM',
        items: [
            {
                id: 'item-1005',
                title: 'Romantic "LOVE" Anniversary Cake',
                price: 'ETB 3,500',
                details: {
                    quantity: 1,
                    size: '1.5 kg',
                    flavor: 'Red Velvet Sponge & Cream Cheese',
                    message: 'Happy 10th Anniversary!'
                }
            }
        ],
        statusHistory: [
            { status: 'Pending', timestamp: '2026-11-05T08:00:00.000Z', note: 'Order placed', changedBy: 'System' },
            { status: 'Confirmed', timestamp: '2026-11-05T09:00:00.000Z', note: 'Confirmed with customer', changedBy: 'Admin' },
            { status: 'Delivered / Completed', timestamp: '2026-11-10T10:30:00.000Z', note: 'Hand-delivered to Piazza location. Customer delighted!', changedBy: 'Courier' }
        ]
    }
];

/**
 * Seed initial data into Firestore if collections are empty or force requested.
 * Uses deterministic document slugs with { merge: true } for idempotent writes.
 * @param {boolean} force - Whether to force re-seeding
 */
export const seedDatabaseIfEmpty = async (force = false) => {
    try {
        console.log('🌱 Checking Firestore database status...');
        let productsSnap;
        try {
            productsSnap = await getDocs(collection(db, 'products'));
            if (!productsSnap.empty && !force) {
                console.log(`ℹ️ Products collection already contains ${productsSnap.size} records. Skipping seed.`);
                return { seeded: false, count: productsSnap.size };
            }
        } catch (checkErr) {
            console.warn('Initial product check notice:', checkErr.message);
        }

        console.log('🚀 Seeding initial categories...');
        let catCount = 0;
        for (const cat of INITIAL_CATEGORIES) {
            try {
                await setDoc(doc(db, 'categories', cat.slug), {
                    ...cat,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                catCount++;
            } catch (err) {
                console.warn(`Category ${cat.slug} seed notice:`, err.message);
            }
        }

        console.log('🚀 Seeding initial products...');
        let prodCount = 0;
        for (const prod of INITIAL_PRODUCTS) {
            try {
                await setDoc(doc(db, 'products', prod.slug), {
                    ...prod,
                    isCustomizable: true,
                    isMadeToOrder: true,
                    stockQuantity: 10,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                prodCount++;
            } catch (err) {
                console.warn(`Product ${prod.slug} seed notice:`, err.message);
            }
        }

        console.log('🚀 Seeding initial catering services...');
        let servCount = 0;
        for (const serv of INITIAL_SERVICES) {
            try {
                await setDoc(doc(db, 'services', serv.slug), {
                    ...serv,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                servCount++;
            } catch (err) {
                console.warn(`Service ${serv.slug} seed notice:`, err.message);
            }
        }

        console.log('🚀 Seeding initial orders...');
        let orderCount = 0;
        for (const order of INITIAL_ORDERS) {
            try {
                await setDoc(doc(db, 'orders', order.id), {
                    ...order,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                orderCount++;
            } catch (err) {
                console.warn(`Order ${order.orderNumber} seed notice:`, err.message);
            }
        }

        console.log('🚀 Seeding CMS content...');
        try {
            await setDoc(doc(db, 'website_content', 'homepage'), {
                ...INITIAL_CMS_CONTENT.homepage,
                updatedAt: serverTimestamp()
            }, { merge: true });
            await setDoc(doc(db, 'website_content', 'contact'), {
                ...INITIAL_CMS_CONTENT.contact,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (cmsErr) {
            console.warn('CMS seed notice:', cmsErr.message);
        }

        console.log(`✅ Initial database seed completed: ${prodCount} products, ${catCount} categories, ${servCount} services, ${orderCount} orders.`);
        return { 
            seeded: true, 
            productsCount: prodCount || INITIAL_PRODUCTS.length,
            categoriesCount: catCount || INITIAL_CATEGORIES.length,
            servicesCount: servCount || INITIAL_SERVICES.length,
            ordersCount: orderCount || INITIAL_ORDERS.length
        };
    } catch (error) {
        console.error('❌ Failed to seed initial database:', error);
        throw error;
    }
};
