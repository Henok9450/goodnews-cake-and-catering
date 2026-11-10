import { getProducts } from '../services/productService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// import { emailService } from '../services/emailService';

const seasonalItems = [
  {
    img: '/images/seasonal/enkutatash-real.jpg',
    title: 'Enkutatash Golden Honey Cake (Ethiopian New Year)',
    description: 'A handcrafted Ethiopian New Year celebration cake frosted in golden honey buttercream, garnished with fresh hand-picked yellow Adey Abeba blossoms, real dripping raw honeycomb, and delicate edible gold leaf.',
    ingredients: ['Vanilla sponge', 'Teff-infused honey buttercream', 'Fresh Adey Abeba flowers', 'Raw honeycomb', 'Ethiopian honey drizzle'],
    size: '1.5 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/habesha-wedding-melse.jpg',
    title: 'Habesha Traditional Wedding & Melse Cake',
    description: 'An elegant two-tier ivory celebration cake honoring Ethiopian wedding and Melse traditions with intricate hand-piped Habesha Kemis Tibeb geometric embroidery borders in red, yellow, and green, accented with sugar garden roses.',
    ingredients: ['Velvet almond sponge', 'Vanilla bean buttercream', 'Hand-piped edible Tibeb embroidery', 'Sugar roses', 'Gold leaf'],
    size: 'Two-tier (3.5 kg)',
    servings: '35-45 people'
  },
  {
    img: '/images/seasonal/fasika-easter-real.jpg',
    title: 'Fasika Ethiopian Easter Celebration Cake',
    description: 'A pristine artisanal two-tier celebration cake celebrating Fasika and the joyful breaking of the Great Lent (Hudadi/Abiy Tsom). Features a hand-piped golden Ethiopian Orthodox cross, fresh spring blossoms, and gold leaf on rich buttercream.',
    ingredients: ['Cardamom vanilla sponge', 'Whipped buttercream', 'Handmade gold Orthodox cross', 'Spring edible flowers', 'Gold leaf'],
    size: 'Two-tier (3 kg)',
    servings: '30-40 people'
  },
  {
    img: '/images/seasonal/gena-celebration.png',
    title: 'YeGenna Traditional Christmas Fruit Cake',
    description: 'Celebrate Ethiopian Christmas (Genna) with our rich traditional fruit cake, bursting with sun-ripened raisins, dates, spices, and local honey, crowned with festive red and green holiday piped rosettes.',
    ingredients: ['Spiced fruit cake', 'Ethiopian honey soak', 'Vanilla bean frosting', 'Cranberries', 'Festive rosettes'],
    size: '1.5 kg round cake',
    servings: '14-18 people'
  },
  {
    img: '/images/seasonal/Timket1.png',
    title: 'Timket Epiphany Sacred Blessing Cake',
    description: 'Inspired by the sacred water blessings of Timket (Epiphany), featuring pure blue-and-white marbled ocean watercolor frosting and handcrafted cream peaks symbolizing renewal and purity.',
    ingredients: ['Lemon sponge', 'Elderflower buttercream', 'Blue watercolor glaze', 'Whipped meringue swirls'],
    size: '1.2 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/meskel.png',
    title: 'Meskel Blossom Flower Cake',
    description: 'Bright golden celebration cake honoring the Demera festival and the yellow Meskel flower season, with tropical fruit compote and warm spices.',
    ingredients: ['Spice sponge', 'Cream cheese frosting', 'Caramel drizzle', 'Adey Abeba flower motif'],
    size: '1.5 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/graduation-success.png',
    title: 'Graduation & Milestone Success Cake',
    description: 'A decadent dark chocolate celebration cake with artisan chocolate ganache and hand-piped Congratulations script in ivory white chocolate, ideal for university and college graduations in Ethiopia.',
    ingredients: ['Dark chocolate sponge', 'Fudge ganache filling', 'Gold shimmer dust', 'White chocolate lettering'],
    size: '1.5 kg round cake',
    servings: '14-18 people'
  },
  {
    img: '/images/seasonal/kids-graduation.png',
    title: 'Kids 1st Grade Milestone Graduation Cake',
    description: 'A festive two-tier graduation cake celebrating young learners with mortarboard cap, ABC blocks, chalkboard, and silver sugar pearls.',
    ingredients: ['Funfetti sponge', 'Whipped vanilla buttercream', 'Fondant toppers', 'Edible pearls'],
    size: 'Two-tier (2 kg)',
    servings: '20-25 people'
  },
  {
    img: '/images/seasonal/valentine-heart.png',
    title: 'Valentine Romance Heart Cake',
    description: 'Romantic heart-shaped cake layered with velvety red velvet sponge, smooth cream cheese frosting, and chocolate ganache for Valentine celebrations in Addis Ababa.',
    ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'Chocolate ganache', 'Edible roses'],
    size: 'Heart-shaped cake (1.2 kg)',
    servings: '10-12 people'
  },
  {
    img: '/images/seasonal/vegan.png',
    title: 'Ethiopian Orthodox Fasting (Tsom) Vegan Cake',
    description: 'A 100% plant-based vegan cake crafted specifically for Ethiopian Orthodox fasting seasons (Hudadi, Tsome Nebiyat, Filseta) with roasted Ethiopian coffee, almond milk, and rich cocoa.',
    ingredients: ['Coffee-infused sponge', 'Almond milk cream', 'Organic coconut frosting', 'Cocoa dust'],
    size: '1.5 kg round cake',
    servings: '14-16 people'
  }
];

// Order Form Modal Component for Seasonal Items
const SeasonalOrderFormModal = ({ seasonalItem, isOpen, onClose, orderType }) => {
  const [formData, setFormData] = useState({
    // Seasonal Item Specifications
    seasonalItemType: seasonalItem?.title || '',
    cakeSize: '',
    cakeFlavor: '',
    frostingType: '',
    fillingType: '',

    // Design Preferences
    seasonalTheme: '',
    cakeColors: '',
    cakeMessage: '',
    specialDecorations: '',

    // Special Requests
    dietaryRequirements: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const cakeSizes = [
    '0.5 kg (8-10 servings)',
    '1 kg (12-16 servings)',
    '1.5 kg (16-20 servings)',
    '2 kg (20-25 servings)',
    'Sheet cake (24-30 servings)',
    'Custom size (specify in notes)'
  ];

  const cakeFlavors = [
    'Vanilla',
    'Chocolate',
    'Red Velvet',
    'Lemon',
    'Strawberry',
    'Carrot',
    'Spice',
    'Fruit Cake',
    'Marble',
    'Coconut',
    'Other (specify in notes)'
  ];

  const frostingTypes = [
    'Buttercream',
    'Cream Cheese',
    'Chocolate Ganache',
    'Whipped Cream',
    'Fondant',
    'Royal Icing',
    'Italian Meringue',
    'Swiss Meringue',
    'Other (specify in notes)'
  ];

  const fillingTypes = [
    'None',
    'Fruit Compote',
    'Chocolate Ganache',
    'Lemon Curd',
    'Caramel',
    'Cream Cheese',
    'Raspberry Jam',
    'Buttercream',
    'Multiple Layers',
    'Other (specify in notes)'
  ];

  const seasonalThemes = [
    'Winter/Holiday',
    'Spring Floral',
    'Summer Tropical',
    'Autumn/Harvest',
    'Christmas',
    'Valentine\'s Day',
    'Easter',
    'Halloween',
    'Birthday',
    'Wedding',
    'Custom Theme'
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
        orderType: orderType === 'customize' ? 'Custom Seasonal Order' : `Standard Seasonal Order: ${seasonalItem?.title || 'Unknown Item'}`,
        title: seasonalItem?.title || (orderType === 'customize' ? 'Custom Seasonal Order' : 'Unknown Item'),
        price: 'Quote on Request',
        img: seasonalItem?.img,

        // Item Details
        seasonalItemType: formData.seasonalItemType,
        cakeSize: formData.cakeSize,
        cakeFlavor: formData.cakeFlavor,
        frostingType: formData.frostingType,
        fillingType: formData.fillingType,
        estimatedPrice: 'Quote on Request',

        // Design
        seasonalTheme: formData.seasonalTheme,
        colors: formData.cakeColors,
        message: formData.cakeMessage,
        specialDecorations: formData.specialDecorations,

        // Special Requests
        dietaryRequirements: formData.dietaryRequirements,
        specialRequests: formData.specialRequests,

        // Metadata
        image: window.location.origin + (seasonalItem?.img || ''),
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);
      console.log('✅ Seasonal item added to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding seasonal item to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      seasonalItemType: seasonalItem?.title || '',
      cakeSize: '',
      cakeFlavor: '',
      frostingType: '',
      fillingType: '',
      seasonalTheme: '',
      cakeColors: '',
      cakeMessage: '',
      specialDecorations: '',
      dietaryRequirements: '',
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
              "{seasonalItem?.title}" has been added to your cart. You can continue shopping or proceed to checkout.
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
              {orderType === 'customize' ? 'Customize Seasonal Order' : 'Order This Seasonal Item'}
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

          {/* Seasonal Item Summary */}
          {seasonalItem && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img src={seasonalItem.img} alt={seasonalItem.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{seasonalItem.title}</h3>
                  <p className="text-sm text-gray-600">{seasonalItem.size} • {seasonalItem.servings}</p>
                  <p className="text-sm text-gray-600 mt-1">{seasonalItem.description}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Seasonal Item Specifications */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🎂 Cake Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seasonal Item Type</label>
                  <input
                    type="text"
                    name="seasonalItemType"
                    value={formData.seasonalItemType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Christmas Cake, Easter Special, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cake Size *</label>
                  <select
                    name="cakeSize"
                    value={formData.cakeSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Cake Size</option>
                    {cakeSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cake Flavor *</label>
                  <select
                    name="cakeFlavor"
                    value={formData.cakeFlavor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Flavor</option>
                    {cakeFlavors.map(flavor => (
                      <option key={flavor} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frosting Type *</label>
                  <select
                    name="frostingType"
                    value={formData.frostingType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Frosting</option>
                    {frostingTypes.map(frosting => (
                      <option key={frosting} value={frosting}>{frosting}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filling Type</label>
                  <select
                    name="fillingType"
                    value={formData.fillingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Filling</option>
                    {fillingTypes.map(filling => (
                      <option key={filling} value={filling}>{filling}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seasonal Theme *</label>
                  <select
                    name="seasonalTheme"
                    value={formData.seasonalTheme}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Theme</option>
                    {seasonalThemes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Design Preferences */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🎨 Design & Customization</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    type="text"
                    name="cakeColors"
                    value={formData.cakeColors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Red and green, Pastel colors, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cake Message</label>
                  <input
                    type="text"
                    name="cakeMessage"
                    value={formData.cakeMessage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Text to be written on the cake"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Decorations</label>
                  <input
                    type="text"
                    name="specialDecorations"
                    value={formData.specialDecorations}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Specific decorations, toppers, or design elements"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">💫 Special Requirements</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Requirements</label>
                  <input
                    type="text"
                    name="dietaryRequirements"
                    value={formData.dietaryRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Gluten-free, Vegan, Nut-free, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests & Notes</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any specific design references, allergies, timing requirements, or other special instructions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}

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
                className="flex-1 btn-primary disabled:bg-primary-400 disabled:cursor-not-allowed"
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

// Seasonal Modal Component
const SeasonalModal = ({ seasonalItem, isOpen, onClose, onOrder, onCustomize }) => {
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
            <div className="flex items-center justify-center">
              <img
                src={seasonalItem.img}
                alt={seasonalItem.title}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{seasonalItem.title}</h2>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{seasonalItem.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {seasonalItem.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Size</h4>
                  <p className="text-gray-600">{seasonalItem.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Servings</h4>
                  <p className="text-gray-600">{seasonalItem.servings}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="btn-primary w-full"
                  onClick={() => onOrder(seasonalItem)}
                >
                  Order This Seasonal Item
                </button>
                <button
                  className="btn-secondary w-full mt-2"
                  onClick={() => onCustomize(seasonalItem)}
                >
                  Customize Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Seasonal = () => {
  const [liveSeasonal, setLiveSeasonal] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    getProducts({ category: 'seasonal', status: 'published' })
      .then(prods => {
        if (isMounted && prods && prods.length > 0) {
          setLiveSeasonal(prods.map(p => ({
            id: p.id,
            title: p.name,
            img: p.featuredImage || (p.images && p.images[0]) || '/images/seasonal/enkutatash.png',
            description: p.description,
            ingredients: p.ingredients || [],
            size: p.size || '1 kg round cake',
            servings: p.servings || '12-16 people'
          })));
        }
      })
      .catch(e => console.warn('Using default seasonal items:', e.message));

    return () => { isMounted = false; };
  }, []);

  const displaySeasonal = liveSeasonal.length > 0 ? liveSeasonal : seasonalItems;
  const [selectedSeasonalItem, setSelectedSeasonalItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderType, setOrderType] = useState('standard'); // 'standard' or 'customize'

  const handleViewDetails = (seasonalItem) => {
    setSelectedSeasonalItem(seasonalItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeasonalItem(null);
  };

  const handleOrder = (seasonalItem) => {
    setSelectedSeasonalItem(seasonalItem);
    setOrderType('standard');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCustomize = (seasonalItem) => {
    setSelectedSeasonalItem(seasonalItem);
    setOrderType('customize');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setSelectedSeasonalItem(null);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Seasonal Specialties</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Celebrate every season with our specially crafted cakes and desserts. From winter wonderlands to summer sunshine, we create memorable treats for every occasion throughout the year.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySeasonal.map((seasonalItem, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <img
                  src={seasonalItem.img}
                  alt={seasonalItem.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(seasonalItem)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{seasonalItem.title}</h3>
              <p className="text-gray-600 mb-4">{seasonalItem.size} • {seasonalItem.servings}</p>
              <button
                className="btn-primary w-full"
                onClick={() => handleViewDetails(seasonalItem)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Details Modal */}
      <SeasonalModal
        seasonalItem={selectedSeasonalItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
        onCustomize={handleCustomize}
      />

      {/* Order Form Modal */}
      <SeasonalOrderFormModal
        seasonalItem={selectedSeasonalItem}
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        orderType={orderType}
      />
    </div>
  );
};

export default Seasonal;
