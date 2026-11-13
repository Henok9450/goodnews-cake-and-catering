import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import OptimizedImage from '../components/common/OptimizedImage';
import SEOHead from '../components/common/SEOHead';
import { Share2, MessageCircle, Download } from 'lucide-react';

const defaultCakes = [
  {
    img: '/images/cakes/cake1.png',
    title: 'Romantic Proposal Silhouette Cake',
    description: 'A graceful single-tier ivory celebration cake decorated with edible gold pearls, two fluttering pink butterflies, and a black silhouette cutout of a marriage proposal.',
    ingredients: ['Vanilla velvet sponge', 'Smooth buttercream frosting', 'Edible gold pearls', 'Silhouette fondant cutout', 'Sugar butterflies'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake2.png',
    title: 'Blush Bridal Gown Celebration Cake',
    description: 'An exquisite two-tier soft blush pink cake embellished with silver pearls and a sculpted blonde bride figurine wearing a low-back wedding gown with a flowing fondant train.',
    ingredients: ['Almond sponge', 'Blush buttercream frosting', 'Silver sugar pearls', 'Hand-sculpted bride figurine', 'Fondant gown train'],
    size: 'Two-tier (2 kg)',
    servings: '18-22 people'
  },
  {
    img: '/images/cakes/cake3.png',
    title: 'Modern Floating Tier Wedding Cake',
    description: 'A sophisticated contemporary two-tier ivory celebration cake featuring a vertical golden hoop separator, gold-vein gilded edges, and handcrafted blush pink sugar roses.',
    ingredients: ['Vanilla bean sponge', 'Ivory smooth buttercream', 'Edible gold leaf trim', 'Handcrafted sugar roses', 'Sugar leaves'],
    size: 'Two-tier (2 kg)',
    servings: '18-22 people'
  },
  {
    img: '/images/cakes/cake4.png',
    title: 'Maternity & Baby Shower Celebration Cake',
    description: 'A heartfelt single-tier white textured buttercream cake featuring an expectant mother silhouette topper, framed by a cascading arch of pink and ivory fondant bubbles and silver pearls.',
    ingredients: ['Vanilla sponge', 'Whipped buttercream frosting', 'Fondant bubble spheres', 'Silver dragees', 'Maternity silhouette topper'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake5.png',
    title: 'Vintage Crimson Lambeth Ribbon Cake',
    description: 'A dramatic baroque Lambeth-style cake finished in rich crimson-red frosting, featuring ornate piped shell borders, side swags, and contrasting black satin ribbon bows.',
    ingredients: ['Rich chocolate sponge', 'Crimson buttercream', 'Lambeth piped swags', 'Black satin ribbon bows'],
    size: '1.2 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/cake6.png',
    title: 'Couture Low-Back Bridal Silhouette Cake',
    description: 'A stunning bridal celebration cake featuring an illustrated bride figurine in a low-back lace gown with a cascading tiered white petal skirt, golden waist corsage, and piped floral rim.',
    ingredients: ['Vanilla velvet sponge', 'White buttercream frosting', 'Fondant petal tiers', 'Gold luster dust', 'Handmade floral accents'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake7.png',
    title: 'Habesha Traditional Bridal & Milestone Cake',
    description: 'A meaningful Ethiopian celebration cake decorated with an Ethiopian maiden figurine in Habesha Kemis, floral wreath, gold pearls, and heart toppers scripted in Ge\'ez Amharic fidel.',
    ingredients: ['Spiced vanilla sponge', 'Whipped buttercream', 'Edible Habesha gown motif', 'Amharic fidel toppers', 'Gold sugar pearls'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake8.png',
    title: 'Romantic "LOVE" Anniversary Cake',
    description: 'A pristine white anniversary cake featuring bold sculpted red letters spelling "LOVE", red rosebuds, scattered red hearts, and "HAPPY ANNIVERSARY" lettering on the cake board.',
    ingredients: ['Red velvet & vanilla sponge', 'Smooth buttercream', 'Sculpted red fondant roses', 'Red fondant lettering', 'Silver dragees'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake9.png',
    title: 'Semi-Naked Cherry Chocolate Drip Cake',
    description: 'A rustic semi-naked chocolate layer cake coated in decadent dark chocolate ganache drip, topped with fresh dark cherries on the stem, edible pink blossom flowers, and delicate petals.',
    ingredients: ['Dark cocoa sponge', 'Vanilla buttercream crumb coat', 'Dark chocolate ganache drip', 'Fresh whole cherries', 'Edible flowers'],
    size: '1.2 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/wedding-cake-strawberry.png',
    title: 'Strawberry Pearl Wedding Sheet Cake',
    description: 'A luxurious rectangular wedding sheet cake adorned with abundant fresh strawberries, elegant pearl piping, and fluffy vanilla buttercream.',
    ingredients: ['Vanilla sponge', 'Fresh strawberries', 'Vanilla buttercream', 'Sugar pearls', 'Strawberry glaze'],
    size: 'Sheet cake (3 kg)',
    servings: '35-45 people'
  },
  {
    img: '/images/cakes/wedding-cake-grand.png',
    title: 'Silver Pearl Grand Wedding Cake',
    description: 'Grand rectangular celebration cake featuring crisp vertical piping textures, edible silver pearls, and celebratory sparkler accents.',
    ingredients: ['Velvet sponge', 'Swiss meringue buttercream', 'Edible silver pearls', 'White chocolate ganache'],
    size: 'Grand Sheet cake (4 kg)',
    servings: '50-60 people'
  },
  {
    img: '/images/cakes/two-tier-pearl-celebration.png',
    title: 'Golden Pearl Two-Tier Celebration Cake',
    description: 'Sophisticated two-tiered white buttercream cake decorated with shimmering pearls and artisan golden meringue rosettes.',
    ingredients: ['Vanilla & almond sponge', 'Whipped buttercream', 'Edible pearls', 'Golden meringue kisses'],
    size: 'Two-tier (2 kg)',
    servings: '20-25 people'
  },
  {
    img: '/images/cakes/kids-graduation.png',
    title: 'Kids 1st Grade Graduation Cake',
    description: 'Charming two-tier milestone cake crowned with a graduation cap, ABC alphabet blocks, chalkboard, and miniature school books.',
    ingredients: ['Funfetti sponge', 'Vanilla buttercream', 'Fondant chalkboard & toppers', 'Silver pearls'],
    size: 'Two-tier (2 kg)',
    servings: '20-25 people'
  },
  {
    img: '/images/cakes/1000018386_enhanced.png',
    title: 'Spider-Man Superhero Celebration Cake',
    description: 'Dynamic sky-blue buttercream children celebration cake with handcrafted Spider-Man edible sugar figures, web emblems, and festive confetti sprinkles.',
    ingredients: ['Chocolate sponge', 'Vanilla buttercream', 'Sugar toppers', 'Rainbow confetti'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/1000018385_enhanced.png',
    title: 'Mickey & Friends Jubilee Kids Cake',
    description: 'Joyful bright blue celebration cake adorned with Mickey Mouse and friends toppers, fluffy cloud piping, and edible colorful candies.',
    ingredients: ['Vanilla sponge', 'Cream cheese frosting', 'Sugar character cutouts', 'Crispy pearls'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/polar-bear-cake-mobile-1.webp',
    title: 'Winter Coconut Polar Bear Cake',
    description: 'Delightful fluffy shredded coconut bear celebration cake featuring chocolate sponge layers, sugar party hat, and dark chocolate features.',
    ingredients: ['Chocolate & vanilla layers', 'Shredded sweet coconut', 'Buttercream', 'Chocolate drops'],
    size: '1.5 kg',
    servings: '12-15 people'
  }
];

// Order Form Modal Component
const OrderFormModal = ({ cake, isOpen, onClose, orderType }) => {
  const [formData, setFormData] = useState({
    // Cake Specifications
    cakeType: cake?.title || '',
    cakeSize: cake?.size || '',
    cakeFlavor: '',
    cakeFilling: '',
    cakeFrosting: '',

    // Design Preferences
    cakeTheme: '',
    cakeColors: '',
    cakeMessage: '',

    // Special Requests
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Reset form when cake changes
  React.useEffect(() => {
    if (cake) {
      setFormData(prev => ({
        ...prev,
        cakeType: cake.title || '',
        cakeSize: cake.size || ''
      }));
    }
  }, [cake]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const orderData = {
        cartId: Date.now(), // Unique ID for cart item
        orderType: orderType === 'customize' ? 'Custom Cake' : `Standard Order: ${cake?.title || 'Unknown Cake'}`,

        // Item Basics
        title: cake?.title || (orderType === 'customize' ? 'Custom Cake' : 'Unknown Cake'),
        price: 'Quote on Request',
        img: cake?.img,

        // Cake Details
        cakeType: formData.cakeType,
        cakeSize: formData.cakeSize,
        flavor: formData.cakeFlavor,
        filling: formData.cakeFilling,
        frosting: formData.cakeFrosting,

        // Design
        theme: formData.cakeTheme,
        colors: formData.cakeColors,
        message: formData.cakeMessage,
        specialRequests: formData.specialRequests,

        // Metadata
        itemType: 'cake'
      };

      // Add the item to our global shopping cart
      addToCart(orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSubmissionError('Failed to add item to your bag. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cakeType: '',
      cakeSize: '',
      cakeFlavor: '',
      cakeFilling: '',
      cakeFrosting: '',
      cakeTheme: '',
      cakeColors: '',
      cakeMessage: '',
      specialRequests: ''
    });
    setIsSubmitted(false);
    setSubmissionError('');
    onClose();
  };

  // ESC key listener for accessibility
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Order customization dialog">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative custom-scrollbar shadow-2xl">
        <button
          onClick={resetForm}
          aria-label="Close order dialog"
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Item Added to Bag!</h3>
            <p className="text-gray-600 mb-6">
              Your cake customization has been added to your shopping bag. You can continue shopping or proceed to review your order.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetForm}
                className="btn-secondary"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  resetForm();
                  navigate('/cart');
                }}
                className="btn-primary"
              >
                View Bag & Order
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {orderType === 'customize' ? 'Customize Your Cake' : 'Order Cake'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {orderType === 'customize' 
                    ? 'Personalize your cake specifications and instructions' 
                    : 'Confirm your cake selection'}
                </p>
              </div>
            </div>

            {cake && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <img src={cake.img} alt={cake.title} className="w-16 h-16 object-cover rounded-xl bg-white border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{cake.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{cake.size} • {cake.servings}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cake.description}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gallery-cake-type" className="block text-xs font-bold text-gray-700 mb-1">Cake Type</label>
                  <input
                    id="gallery-cake-type"
                    type="text"
                    name="cakeType"
                    value={formData.cakeType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Birthday Cake"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gallery-cake-size" className="block text-xs font-bold text-gray-700 mb-1">Size</label>
                  <input
                    id="gallery-cake-size"
                    type="text"
                    name="cakeSize"
                    value={formData.cakeSize}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1.5 kg, Two-tier"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="gallery-cake-flavor" className="block text-xs font-bold text-gray-700 mb-1">Flavor</label>
                  <select
                    id="gallery-cake-flavor"
                    name="cakeFlavor"
                    value={formData.cakeFlavor}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 font-medium"
                    required
                  >
                    <option value="">Select Flavor</option>
                    <option value="vanilla">Vanilla</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="red-velvet">Red Velvet</option>
                    <option value="caramel">Caramel</option>
                    <option value="lemon">Lemon</option>
                    <option value="fruit">Mixed Fruit</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gallery-cake-filling" className="block text-xs font-bold text-gray-700 mb-1">Filling</label>
                  <select
                    id="gallery-cake-filling"
                    name="cakeFilling"
                    value={formData.cakeFilling}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    <option value="">Select Filling (Optional)</option>
                    <option value="buttercream">Buttercream</option>
                    <option value="chocolate-ganache">Chocolate Ganache</option>
                    <option value="cream-cheese">Cream Cheese</option>
                    <option value="fruit-compote">Fruit Compote</option>
                    <option value="caramel">Caramel</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gallery-cake-frosting" className="block text-xs font-bold text-gray-700 mb-1">Frosting</label>
                  <select
                    id="gallery-cake-frosting"
                    name="cakeFrosting"
                    value={formData.cakeFrosting}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 font-medium"
                    required
                  >
                    <option value="">Select Frosting</option>
                    <option value="buttercream">Buttercream</option>
                    <option value="whipped-cream">Whipped Cream</option>
                    <option value="cream-cheese">Cream Cheese</option>
                    <option value="chocolate-ganache">Chocolate Ganache</option>
                    <option value="fondant">Fondant</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="gallery-cake-message" className="block text-xs font-bold text-gray-700 mb-1">Message on Cake</label>
                <input
                  id="gallery-cake-message"
                  type="text"
                  name="cakeMessage"
                  value={formData.cakeMessage}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Happy Birthday Abebe!"
                />
              </div>

              <div>
                <label htmlFor="gallery-special-requests" className="block text-xs font-bold text-gray-700 mb-1">Special Requests / Dietary Notes</label>
                <textarea
                  id="gallery-special-requests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                  placeholder="Any dietary restrictions, specific decorations, or delivery notes"
                ></textarea>
              </div>

              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  {submissionError}
                </div>
              )}

              <div className="flex gap-4 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md"
                >
                  {isSubmitting ? 'Adding...' : 'Add to Bag'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Cake Details Modal Component
const CakeModal = ({ cake, isOpen, onClose, onOrder, onCustomize }) => {
  const [copied, setCopied] = useState(false);

  // ESC key listener for accessibility
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const handleDownloadPhoto = () => {
    if (!cake || !cake.img) return;
    const link = document.createElement('a');
    link.href = cake.img;
    const cleanTitle = (cake.title || 'Cake').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `GoodNews-Cake-${cleanTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !cake) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Cake details dialog">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative custom-scrollbar shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close cake details dialog"
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 border border-gray-100 h-96">
            <OptimizedImage
              src={cake.img}
              alt={cake.title}
              width="600"
              height="450"
              cardMode={false}
              priority={true}
              className="w-full max-h-[380px] object-contain rounded-xl"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{cake.title}</h2>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{cake.description}</p>
            </div>

            {cake.ingredients && cake.ingredients.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {cake.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-100 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Standard Size</p>
                <p className="font-bold text-gray-900">{cake.size || '1 kg'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Estimated Servings</p>
                <p className="font-bold text-gray-900">{cake.servings || '8-10 people'}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                className="btn-primary flex-1 py-3 rounded-xl font-bold text-xs"
                onClick={() => onOrder(cake)}
              >
                Quick Order
              </button>
              <button
                className="btn-secondary flex-1 py-3 rounded-xl font-bold text-xs"
                onClick={() => onCustomize(cake)}
              >
                Customize Design
              </button>
            </div>

            {/* Social Share, Save Photo & WhatsApp Consultation Row */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPhoto}
                  className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-800 font-semibold py-1.5 px-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
                  title="Download official watermarked photo"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary-600 font-medium py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Copy shareable link to this cake"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? '✓ Link Copied!' : 'Share Cake'}</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://t.me/goodnewscake?text=${encodeURIComponent(`Hello GoodNews Cake, I would like to order the "${cake.title}": ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-bold py-1.5 px-3 rounded-lg hover:bg-sky-50 transition-colors"
                  title="Order this cake on Telegram"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.04.36z" />
                  </svg>
                  <span>Order via Telegram</span>
                </a>
                <a
                  href={`https://wa.me/251917559943?text=${encodeURIComponent(`Hello GoodNews Cake, I would like to inquire about the "${cake.title}": ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold py-1.5 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
                  title="Inquire about this cake on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [selectedCake, setSelectedCake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderType, setOrderType] = useState('standard');
  const [liveCakes, setLiveCakes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getProducts({ category: 'cakes', status: 'published' }).catch(() => []),
      getDocs(query(collection(db, 'gallery_photos'), orderBy('createdAt', 'desc'))).catch(() => null)
    ])
      .then(([prods, gallerySnap]) => {
        if (!isMounted) return;
        const uploadedCakes = (gallerySnap && !gallerySnap.empty)
          ? gallerySnap.docs.map(d => {
              const data = d.data();
              return {
                id: d.id,
                title: data.caption || 'Celebration Cake',
                img: data.url || '/images/cakes/cake1.png',
                description: data.caption || 'Artisanal celebration cake crafted by GoodNews Cake & Catering.',
                ingredients: ['Vanilla Velvet Sponge', 'Buttercream Frosting', 'Signature Decor'],
                size: 'Custom Size',
                servings: '10-15 people',
                category: data.category || 'Celebration Cakes'
              };
            })
          : [];

        const productCakes = (prods && prods.length > 0)
          ? prods.map(p => ({
              id: p.id,
              title: p.name,
              img: p.featuredImage || (p.images && p.images[0]) || '/images/cakes/cake1.png',
              description: p.description,
              ingredients: p.ingredients || [],
              size: p.size || '1 kg',
              servings: p.servings || '8-10 people'
            }))
          : [];

        const combined = [...uploadedCakes, ...productCakes];
        if (combined.length > 0) {
          setLiveCakes(combined);
        }
      })
      .catch(err => console.warn('Using default cakes catalog:', err.message));

    return () => { isMounted = false; };
  }, []);

  const displayCakes = liveCakes.length > 0 ? liveCakes : defaultCakes;

  // Helper to convert cake title to URL slug
  const toSlug = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Deep linking: read ?cake=... from URL on mount/update
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cakeSlug = params.get('cake');
    if (cakeSlug && displayCakes.length > 0) {
      const match = displayCakes.find(c => toSlug(c.title) === cakeSlug);
      if (match) {
        setSelectedCake(match);
        setIsModalOpen(true);
      }
    }
  }, [displayCakes]);

  const handleViewDetails = (cake) => {
    setSelectedCake(cake);
    setIsModalOpen(true);
    const slug = toSlug(cake.title);
    window.history.replaceState({ cake: slug }, '', `${window.location.pathname}?cake=${slug}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCake(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleOrder = (cake) => {
    setSelectedCake(cake);
    setOrderType('standard');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCustomize = (cake) => {
    setSelectedCake(cake);
    setOrderType('customize');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setSelectedCake(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36">
      {/* Product-level dynamic SEO head when modal is open */}
      {selectedCake && isModalOpen && (
        <SEOHead
          customTitle={`${selectedCake.title} | GoodNews Cake Addis Ababa`}
          customDescription={selectedCake.description}
          customImage={selectedCake.img.startsWith('http') ? selectedCake.img : `https://goodnews-cake-and-catering.vercel.app${selectedCake.img}`}
          customCanonical={`https://goodnews-cake-and-catering.vercel.app/gallery?cake=${toSlug(selectedCake.title)}`}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Artisanal Cake Gallery in Addis Ababa
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Explore handcrafted celebration cakes in Addis Ababa, Ethiopia. From multi-tiered wedding cakes and Habesha traditional bridal designs to whimsical children's birthday cakes and rich chocolate drips, every cake is baked fresh to order using premium natural ingredients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCakes.map((cake, index) => (
            <div key={cake.id || index} className="card p-6 text-center flex flex-col justify-between hover:shadow-xl transition-shadow rounded-3xl border border-gray-100">
              <div className="w-full h-80 flex items-center justify-center rounded-2xl mb-4 overflow-hidden bg-gray-50/50">
                <OptimizedImage
                  src={cake.img}
                  alt={cake.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="320"
                  cardMode={true}
                  priority={index < 3}
                  className="w-full h-full object-contain rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(cake)}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">{cake.title}</h3>
                <p className="text-gray-500 text-xs mb-4">{cake.size} • {cake.servings}</p>
              </div>
              <button
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs"
                onClick={() => handleViewDetails(cake)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <CakeModal
        cake={selectedCake}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
        onCustomize={handleCustomize}
      />

      <OrderFormModal
        cake={selectedCake}
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        orderType={orderType}
      />
    </div>
  );
};

export default Gallery;
