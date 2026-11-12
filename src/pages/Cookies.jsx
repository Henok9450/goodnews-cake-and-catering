import { getProducts } from '../services/productService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import OptimizedImage from '../components/common/OptimizedImage';
import { Download } from 'lucide-react';

const cookies = [
  {
    img: '/images/cookies/cookie1.png',
    title: 'Warm Brown Butter Chocolate Chip Cookies',
    description: 'Golden brown, crispy-edged cookies with soft chewy centers, bursting with melted chocolate chips, served warm with a fresh glass of milk.',
    ingredients: ['Brown butter', 'Semi-sweet chocolate chips', 'Brown sugar', 'Vanilla extract', 'Flour', 'Sea salt'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie2.png',
    title: 'Fudgy Double Chocolate Chunk Cookies',
    description: 'Decadent dark Dutch cocoa cookies loaded with molten dark chocolate chunks and a rich, gooey chocolate fudge center.',
    ingredients: ['Dutch cocoa powder', 'Dark chocolate chunks', 'Creamery butter', 'Cane sugar', 'Flour', 'Vanilla'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie3.png',
    title: 'Rustic Cinnamon Oatmeal Raisin Cookies',
    description: 'Hearty rolled-oat bakery cookies packed with plump sweet raisins, warm aromatic cinnamon, and a delicate dusting of confectioners\' sugar.',
    ingredients: ['Rolled oats', 'Plump raisins', 'Ground cinnamon', 'Brown sugar', 'Creamery butter', 'Flour'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie4.png',
    title: 'Holiday Decorated Sugar Cookie Collection',
    description: 'Hand-decorated artisanal holiday butter sugar cookies topped with colorful royal icing in Christmas tree, snowflake, stocking, and ornament designs.',
    ingredients: ['Pure butter sugar cookie', 'Artisan royal icing', 'Sugar pearls', 'Festive edible shimmer'],
    size: 'Assorted holiday shapes',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie5.png',
    title: 'Classic Criss-Cross Peanut Butter Cookies',
    description: 'Rich and tender roasted peanut butter cookies baked with the timeless fork-pressed criss-cross pattern, featuring soft melt-in-your-mouth centers.',
    ingredients: ['Roasted peanut butter', 'Creamery butter', 'Cane sugar', 'Brown sugar', 'Flour', 'Vanilla'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie6.png',
    title: 'Cinnamon Sugar Cloud Snickerdoodles',
    description: 'Pillowy-soft, fresh-from-the-oven cookies generously rolled in sweet aromatic cinnamon sugar with classic crackled tops.',
    ingredients: ['Creamery butter', 'Cinnamon sugar coating', 'Flour', 'Cream of tartar', 'Cane sugar', 'Eggs'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie7.png',
    title: 'White Chocolate Macadamia Nut Cookies',
    description: 'Chewy golden butter cookies loaded with rich, creamy white chocolate puddles and slow-roasted Hawaiian macadamia nuts.',
    ingredients: ['White chocolate chunks', 'Toasted macadamia nuts', 'Brown sugar', 'Creamery butter', 'Flour', 'Vanilla'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie8.png',
    title: 'Festive Red Velvet Snow Crinkle Cookies',
    description: 'Vibrant crimson red velvet cookies with fudgy chocolate centers, rolled in powdered confectioners\' sugar that creates snowy crackled fissures as they bake.',
    ingredients: ['Red velvet cocoa dough', 'Confectioners sugar coating', 'Cream cheese touch', 'Vanilla', 'Flour'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  },
  {
    img: '/images/cookies/cookie9.png',
    title: 'Zesty Iced Lemon Glaze Cookies',
    description: 'Tender citrus butter cookies finished with a dripping sweet-tart lemon glaze and freshly grated fragrant lemon zest.',
    ingredients: ['Fresh lemon zest', 'Lemon juice glaze', 'Creamery butter', 'Flour', 'Sugar', 'Vanilla'],
    size: '3-inch diameter',
    servings: '12 cookies per batch'
  }
];

// Order Form Modal Component for Cookies
const CookieOrderFormModal = ({ cookie, isOpen, onClose, orderType }) => {
    const [formData, setFormData] = useState({
        // Cookie Specifications
        cookieType: cookie?.title || '',
        quantity: '',
        cookieFlavor: '',
        icingType: '',
        toppings: '',

        // Design Preferences
        cookieTheme: '',
        cookieColors: '',
        cookieMessage: '',

        // Special Requests
        specialRequests: ''
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const cookieFlavors = [
    'Vanilla',
    'Chocolate',
    'Sugar Cookie',
    'Gingerbread',
    'Lemon',
    'Peanut Butter',
    'Oatmeal',
    'Red Velvet',
    'Snickerdoodle',
    'Other (specify in notes)'
  ];

  const icingTypes = [
    'Royal Icing',
    'Buttercream',
    'Cream Cheese Frosting',
    'Chocolate Ganache',
    'Glaze',
    'Fondant',
    'No Icing',
    'Other (specify in notes)'
  ];

  const toppings = [
    'Sprinkles',
    'Edible Glitter',
    'Chocolate Drizzle',
    'Nuts',
    'Coconut Flakes',
    'Candy Pieces',
    'Sea Salt',
    'Colored Sugar',
    'Custom Decorations',
    'Other (specify in notes)'
  ];

  const quantities = [
    '12 cookies',
    '24 cookies',
    '36 cookies',
    '48 cookies',
    '72 cookies',
    '96 cookies',
    'Custom quantity (specify in notes)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const orderData = {
        cartId: Date.now(),
        orderType: orderType === 'customize' ? 'Custom Cookie Order' : `Standard Cookie Order: ${cookie?.title || 'Unknown Cookie'}`,
        title: cookie?.title || (orderType === 'customize' ? 'Custom Cookie Order' : 'Unknown Cookie'),
        price: 'Quote on Request',
        img: cookie?.img,

        // Item Details
        cookieType: formData.cookieType,
        quantity: formData.quantity,
        cookieFlavor: formData.cookieFlavor,
        icingType: formData.icingType,
        toppings: formData.toppings,
        estimatedPrice: 'Quote on Request',

        // Design
        theme: formData.cookieTheme,
        colors: formData.cookieColors,
        message: formData.cookieMessage,

        // Special Requests
        specialRequests: formData.specialRequests,

        // Metadata
        image: window.location.origin + (cookie?.img || ''),
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);
      console.log('Added cookie to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding cookie to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      cookieType: cookie?.title || '',
      quantity: '',
      cookieFlavor: '',
      icingType: '',
      toppings: '',
      cookieTheme: '',
      cookieColors: '',
      cookieMessage: '',
      specialRequests: ''
    });
    setIsSubmitted(false);
    setSubmissionError('');
    onClose();
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Added to Cart!</h2>
            <p className="text-gray-600 mb-6">
              "{cookie?.title}" has been added to your cart. You can continue shopping or proceed to checkout.
            </p>
            <div className="flex gap-4">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 font-semibold"
              >
                Continue
              </button>
              <button
                onClick={() => window.location.href = '/cart'}
                className="flex-1 btn-primary font-semibold"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {orderType === 'customize' ? 'Customize Cookie Order' : 'Order These Cookies'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cookie Summary */}
          {cookie && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img src={cookie.img} alt={cookie.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{cookie.title}</h3>
                  <p className="text-sm text-gray-600">{cookie.size} • {cookie.servings}</p>
                  <p className="text-sm text-gray-600 mt-1">{cookie.description}</p>
                </div>
              </div>
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cookie Specifications */}
              <div className="section-card">
                <h3 className="text-lg font-semibold mb-4 text-amber-600">🍪 Cookie Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cookie-type" className="block text-sm font-medium text-gray-700 mb-2">Cookie Type</label>
                    <input
                      id="cookie-type"
                      type="text"
                      name="cookieType"
                      value={formData.cookieType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Holiday Cookies, Wedding Cookies, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="cookie-quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                    <select
                      id="cookie-quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Quantity</option>
                      {quantities.map(quantity => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cookie-flavor" className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                    <select
                      id="cookie-flavor"
                      name="cookieFlavor"
                      value={formData.cookieFlavor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Flavor</option>
                      {cookieFlavors.map(flavor => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cookie-icing" className="block text-sm font-medium text-gray-700 mb-2">Icing Type *</label>
                    <select
                      id="cookie-icing"
                      name="icingType"
                      value={formData.icingType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Icing</option>
                      {icingTypes.map(icing => (
                        <option key={icing} value={icing}>{icing}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cookie-toppings" className="block text-sm font-medium text-gray-700 mb-2">Toppings</label>
                    <select
                      id="cookie-toppings"
                      name="toppings"
                      value={formData.toppings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Toppings</option>
                      {toppings.map(topping => (
                        <option key={topping} value={topping}>{topping}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Design Preferences */}
              <div className="section-card">
                <h3 className="text-lg font-semibold mb-4 text-amber-600">🎨 Design Preferences</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cookie-theme" className="block text-sm font-medium text-gray-700 mb-2">Theme/Design</label>
                    <input
                      id="cookie-theme"
                      type="text"
                      name="cookieTheme"
                      value={formData.cookieTheme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Floral, Geometric, Character, Holiday, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="cookie-colors" className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                    <input
                      id="cookie-colors"
                      type="text"
                      name="cookieColors"
                      value={formData.cookieColors}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Pastel colors, Gold and white, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="cookie-message" className="block text-sm font-medium text-gray-700 mb-2">Custom Message/Design</label>
                    <input
                      id="cookie-message"
                      type="text"
                      name="cookieMessage"
                      value={formData.cookieMessage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Any custom messages, names, or specific design elements?"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="section-card">
                <h3 className="text-lg font-semibold mb-4 text-amber-600">💫 Special Requests & Notes</h3>
                <label htmlFor="cookie-special-requests" className="sr-only">Special Requests & Notes</label>
                <textarea
                  id="cookie-special-requests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any dietary restrictions, allergies, specific design elements, reference images, or other special requirements..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

            {submissionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{submissionError}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary disabled:bg-amber-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Cookie Modal Component
const CookieModal = ({ cookie, isOpen, onClose, onOrder, onCustomize }) => {
  const handleDownloadPhoto = () => {
    if (!cookie || !cookie.img) return;
    const link = document.createElement('a');
    link.href = cookie.img;
    const cleanTitle = (cookie.title || 'Cookie').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `GoodNews-${cleanTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Image Section */}
            <div className="flex items-center justify-center h-80">
              <OptimizedImage
                src={cookie.img}
                alt={cookie.title}
                width="600"
                height="600"
                cardMode={false}
                priority={true}
                className="w-full h-auto object-contain rounded-lg max-h-80"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{cookie.title}</h2>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{cookie.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {cookie.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Size</h4>
                  <p className="text-gray-600">{cookie.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Servings</h4>
                  <p className="text-gray-600">{cookie.servings}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="btn-primary w-full"
                  onClick={() => onOrder(cookie)}
                >
                  Order These Cookies
                </button>
                <button
                  className="btn-secondary w-full mt-2"
                  onClick={() => onCustomize(cookie)}
                >
                  Customize Order
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPhoto}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                  title="Download official watermarked photo"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Watermarked Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cookies = () => {
  const [liveCookies, setLiveCookies] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    getProducts({ category: 'cookies', status: 'published' })
      .then(prods => {
        if (isMounted && prods && prods.length > 0) {
          setLiveCookies(prods.map(p => ({
            id: p.id,
            title: p.name,
            img: p.featuredImage || (p.images && p.images[0]) || '/images/cookies/cookie1.png',
            description: p.description,
            ingredients: p.ingredients || [],
            size: p.size || '3-inch diameter',
            servings: p.servings || '12 cookies per batch'
          })));
        }
      })
      .catch(e => console.warn('Using default cookies:', e.message));

    return () => { isMounted = false; };
  }, []);

  const displayCookies = liveCookies.length > 0 ? liveCookies : cookies;
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderType, setOrderType] = useState('standard'); // 'standard' or 'customize'

  const handleViewDetails = (cookie) => {
    setSelectedCookie(cookie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCookie(null);
  };

  const handleOrder = (cookie) => {
    setSelectedCookie(cookie);
    setOrderType('standard');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCustomize = (cookie) => {
    setSelectedCookie(cookie);
    setOrderType('customize');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setSelectedCookie(null);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Fresh Artisanal Cookies in Addis Ababa
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Freshly baked artisanal cookies in Addis Ababa, Ethiopia. From rich chunky chocolate chip and buttery golden crumbles to decorated celebration gift boxes, baked daily with natural butter and fine cocoa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCookies.map((cookie, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <OptimizedImage
                  src={cookie.img}
                  alt={cookie.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="384"
                  cardMode={true}
                  priority={index < 3}
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(cookie)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cookie.title}</h3>
              <p className="text-gray-600 mb-4">{cookie.size} • {cookie.servings}</p>
              <button
                className="btn-primary w-full"
                onClick={() => handleViewDetails(cookie)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cookie Details Modal */}
      <CookieModal
        cookie={selectedCookie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
        onCustomize={handleCustomize}
      />

      {/* Order Form Modal */}
      <CookieOrderFormModal
        cookie={selectedCookie}
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        orderType={orderType}
      />
    </div>
  );
};

export default Cookies;
