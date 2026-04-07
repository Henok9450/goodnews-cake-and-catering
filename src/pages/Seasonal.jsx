import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// import { emailService } from '../services/emailService';

const seasonalItems = [
  {
    img: '/images/seasonal/enkutatash.png',
    title: 'Golden New Year Honey Cake Flavor',
    price: 'ETB2,500',
    description: 'A golden cake celebrating the freshness of the new year, sweetened with local honey and decorated with yellow adey abeba flowers a symbol of renewal and joy',
    ingredients: ['Vanilla sponge', 'Peppermint buttercream', 'White chocolate snowflakes', 'Edible glitter'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/timket.png',
    title: 'Timket Blue Waterfall Cake Flavor',
    price: 'ETB2,800',
    description: ' Inspired by the sacred water blessings of Timket, this cake features blue-and-white marbled frosting, symbolizing purity and renewal. Light, elegant, and perfect for family gatherings.',
    ingredients: ['Lemon sponge', 'Elderflower buttercream', 'Edible flowers', 'Lemon curd filling'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/fun.png',
    title: ' Addis Delight Cake Flavor',
    price: 'ETB2,700',
    description: 'A fun, colorful cake for birthdays and family celebrations fluffy sponge layers with whipped strawberry cream and bright decorations.',
    ingredients: ['Vanilla sponge', 'Mixed berry compote', 'Coconut buttercream', 'Fresh berries'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/meskel.png',
    title: 'Meskel Blossom Cake Flavor',
    price: 'ETB2,900',
    description: 'This bright yellow cake honors the Meskel flower season, with tropical fruit filling and a buttercream cross design on top. Perfect for gatherings and church celebrations.',
    ingredients: ['Spice sponge', 'Cream cheese frosting', 'Caramel drizzle', 'Cinnamon spices'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/celebratory.png',
    title: 'Christmas Special',
    price: 'ETB3,200',
    description: 'Rich fruit cake with marzipan and royal icing, perfect for Christmas celebrations.',
    ingredients: ['Rich fruit cake', 'Marzipan layer', 'Royal icing', 'Festive decorations'],
    size: '1.5 kg round cake',
    servings: '16-20 people'
  },
  {
    img: '/images/seasonal/valentine-heart.png',
    title: 'Valentine Heart',
    price: 'ETB2,600',
    description: 'Romantic heart-shaped cake with red velvet and cream cheese frosting.',
    ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'Chocolate ganache', 'Edible roses'],
    size: 'Heart-shaped cake',
    servings: '10-12 people'
  },
  {
    img: '/images/seasonal/easter.png',
    title: 'Fasika Celebration Cake',
    price: 'ETB2,400',
    description: 'White buttercream base with gold crosses and pastel flowers.',
    ingredients: ['Lemon sponge', 'Vanilla buttercream', 'Pastel colors', 'Easter egg decorations'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/traditional.png',
    title: 'YeGenna Fruit Delight Flavor',
    price: 'ETB2,800',
    description: 'Celebrate Genna with a traditional-style fruit cake, bursting with raisins, dates, and a hint of Ethiopian honey. Finished with smooth vanilla frosting and festive red-and-green decorations.',
    ingredients: ['Chocolate orange sponge', 'Orange buttercream', 'Black cocoa decorations', 'Spooky toppers'],
    size: '1 kg round cake',
    servings: '12-16 people'
  },
  {
    img: '/images/seasonal/vegan.png',
    title: ' Vegan Coffee Almond Cake Flavor',
    price: 'ETB3,500',
    description: 'A delicious plant-based cake for fasting periods — made with Ethiopian coffee, almond milk, and coconut oil frosting. Light, aromatic, and satisfying.',
    ingredients: ['Champagne sponge', 'Champagne buttercream', 'Gold leaf', 'Edible glitter'],
    size: '1.5 kg round cake',
    servings: '16-20 people'
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
        price: seasonalItem?.price || 'Contact for quote',
        img: seasonalItem?.img,

        // Item Details
        seasonalItemType: formData.seasonalItemType,
        cakeSize: formData.cakeSize,
        cakeFlavor: formData.cakeFlavor,
        frostingType: formData.frostingType,
        fillingType: formData.fillingType,
        estimatedPrice: seasonalItem?.price || 'Contact for quote',

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
                  <p className="text-primary-600 font-semibold">{seasonalItem.price}</p>
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
              <p className="text-2xl font-semibold text-primary-600">{seasonalItem.price}</p>

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
          {seasonalItems.map((seasonalItem, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <img
                  src={seasonalItem.img}
                  alt={seasonalItem.title}
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(seasonalItem)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{seasonalItem.title}</h3>
              <p className="text-gray-600 mb-4">Starting from {seasonalItem.price}</p>
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
