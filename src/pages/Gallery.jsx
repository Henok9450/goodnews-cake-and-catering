import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// import { emailService } from '../services/emailService'; // No longer needed directly here
const cakes = [
  {
    img: '/images/cakes/cake1.png',
    title: 'Beautiful Cake Design 1',
    price: 'ETB1300',
    description: 'A stunning vanilla cake with buttercream frosting and fresh fruit decorations.',
    ingredients: ['Vanilla sponge', 'Buttercream frosting', 'Fresh fruits', 'Edible flowers'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake2.png',
    title: 'Chocolate Delight',
    price: 'ETB1500',
    description: 'Rich chocolate cake with ganache filling and chocolate shavings.',
    ingredients: ['Chocolate sponge', 'Dark chocolate ganache', 'Chocolate shavings', 'Whipped cream'],
    size: '1.5 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/cake3.png',
    title: 'Red Velvet Elegance',
    price: 'ETB1800',
    description: 'Classic red velvet cake with cream cheese frosting and red velvet crumbs.',
    ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'White chocolate', 'Red velvet crumbs'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake4.png',
    title: 'Wedding Special',
    price: 'ETB2800',
    description: 'Elegant multi-tier wedding cake with intricate piping and pearl decorations.',
    ingredients: ['Vanilla and chocolate layers', 'Swiss meringue buttercream', 'Edible pearls', 'Gold leaf'],
    size: 'Two-tier (6" & 8")',
    servings: '30-40 people'
  },
  {
    img: '/images/cakes/cake5.png',
    title: 'Fruit Fantasy',
    price: 'ETB1400',
    description: 'Light sponge cake loaded with seasonal fruits and whipped cream.',
    ingredients: ['Vanilla sponge', 'Fresh whipped cream', 'Seasonal fruits', 'Fruit glaze'],
    size: '1.5 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/cake6.png',
    title: 'Caramel Dream',
    price: 'ETB1300',
    description: 'Moist caramel cake with salted caramel filling and caramel drizzle.',
    ingredients: ['Caramel sponge', 'Salted caramel filling', 'Caramel buttercream', 'Caramel sauce'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake7.png',
    title: 'Lemon Zest',
    price: 'ETB1300',
    description: 'Tangy lemon cake with lemon curd filling and lemon glaze.',
    ingredients: ['Lemon sponge', 'Lemon curd', 'Lemon buttercream', 'Candied lemon'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake8.png',
    title: 'Birthday Special',
    price: 'ETB2100',
    description: 'Fun birthday cake with colorful sprinkles and personalized message.',
    ingredients: ['Choice of flavor', 'Buttercream frosting', 'Colorful sprinkles', 'Custom message'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake9.png',
    title: 'Birthday Special',
    price: 'ETB2100',
    description: 'Fun birthday cake with colorful sprinkles and personalized message.',
    ingredients: ['Choice of flavor', 'Buttercream frosting', 'Colorful sprinkles', 'Custom message'],
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

  const cakeFlavors = [
    'Vanilla',
    'Chocolate',
    'Red Velvet',
    'Lemon',
    'Carrot',
    'Marble',
    'Coffee',
    'Coconut',
    'Other (specify in notes)'
  ];

  const cakeFillings = [
    'Buttercream',
    'Chocolate Ganache',
    'Cream Cheese',
    'Fruit Preserves',
    'Lemon Curd',
    'Caramel',
    'Whipped Cream',
    'Custard',
    'Other (specify in notes)'
  ];

  const cakeFrostings = [
    'Buttercream',
    'Cream Cheese',
    'Chocolate Ganache',
    'Whipped Cream',
    'Fondant',
    'Swiss Meringue',
    'Italian Meringue',
    'Other (specify in notes)'
  ];

  const cakeSizes = [
    '0.5 kg (8-10 servings)',
    '1 kg (12-16 servings)',
    '1.5 kg (20-25 servings)',
    '2 kg (25-30 servings)',
    'Sheet cake (24-48 servings)',
    'Multi-tier (custom servings)',
    'Other (specify in notes)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const { addToCart } = useCart(); // Access cart context

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
        price: cake?.price || 'Contact for quote',
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
        image: window.location.origin + (cake?.img || ''),
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);

      console.log('✅ Gallery item added to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      cakeType: cake?.title || '',
      cakeSize: cake?.size || '',
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
              "{cake?.title}" has been added to your cart. You can continue shopping or proceed to checkout.
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
              {orderType === 'customize' ? 'Customize Cake Order' : 'Order This Cake'}
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

          {/* Cake Summary */}
          {cake && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img src={cake.img} alt={cake.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{cake.title}</h3>
                  <p className="text-primary-600 font-semibold">{cake.price}</p>
                  <p className="text-sm text-gray-600">{cake.size} • {cake.servings}</p>
                  <p className="text-sm text-gray-600 mt-1">{cake.description}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Cake Specifications */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🎂 Cake Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cake Type</label>
                  <input
                    type="text"
                    name="cakeType"
                    value={formData.cakeType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Birthday Cake, Wedding Cake, etc."
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filling</label>
                  <select
                    name="cakeFilling"
                    value={formData.cakeFilling}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Filling</option>
                    {cakeFillings.map(filling => (
                      <option key={filling} value={filling}>{filling}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frosting *</label>
                  <select
                    name="cakeFrosting"
                    value={formData.cakeFrosting}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Frosting</option>
                    {cakeFrostings.map(frosting => (
                      <option key={frosting} value={frosting}>{frosting}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Design Preferences */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🎨 Design Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme/Design</label>
                  <input
                    type="text"
                    name="cakeTheme"
                    value={formData.cakeTheme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Floral, Modern, Vintage, Character, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    type="text"
                    name="cakeColors"
                    value={formData.cakeColors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Pink and gold, Blue and white, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message on Cake</label>
                  <input
                    type="text"
                    name="cakeMessage"
                    value={formData.cakeMessage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What should we write on the cake?"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">💫 Special Requests & Notes</h3>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any dietary restrictions, allergies, specific design elements, reference images, or other special requirements..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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

// Add CSS for section cards
const sectionCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb'
};

// Original CakeModal Component (updated with order buttons)
const CakeModal = ({ cake, isOpen, onClose, onOrder, onCustomize }) => {
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
                src={cake.img}
                alt={cake.title}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{cake.title}</h2>
              <p className="text-2xl font-semibold text-primary-600">{cake.price}</p>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{cake.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {cake.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Size</h4>
                  <p className="text-gray-600">{cake.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Servings</h4>
                  <p className="text-gray-600">{cake.servings}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="btn-primary w-full"
                  onClick={() => onOrder(cake)}
                >
                  Order This Cake
                </button>
                <button
                  className="btn-secondary w-full mt-2"
                  onClick={() => onCustomize(cake)}
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

const Gallery = () => {
  const [selectedCake, setSelectedCake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderType, setOrderType] = useState('standard'); // 'standard' or 'customize'

  const handleViewDetails = (cake) => {
    setSelectedCake(cake);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCake(null);
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
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Our Cake Gallery</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Browse through our collection of beautifully crafted cakes. Each one is made with love and attention to detail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cakes.map((cake, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <img
                  src={cake.img}
                  alt={cake.title}
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(cake)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cake.title}</h3>
              <p className="text-gray-600 mb-4">Starting from {cake.price}</p>
              <button
                className="btn-primary w-full"
                onClick={() => handleViewDetails(cake)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cake Details Modal */}
      <CakeModal
        cake={selectedCake}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
        onCustomize={handleCustomize}
      />

      {/* Order Form Modal */}
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
