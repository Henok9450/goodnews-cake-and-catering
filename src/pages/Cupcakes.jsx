import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// import { emailService } from '../services/emailService';

const cupcakes = [
  {
    img: '/images/cupcakes/cupcake1.png',
    title: 'Vanilla Dream',
    price: 'ETB150',
    description: 'Classic vanilla cupcakes with creamy buttercream frosting and sprinkles.',
    ingredients: ['Vanilla sponge', 'Buttercream frosting', 'Colorful sprinkles', 'Vanilla extract'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake2.png',
    title: 'Chocolate Heaven',
    price: 'ETB160',
    description: 'Rich chocolate cupcakes with chocolate ganache and chocolate curls.',
    ingredients: ['Chocolate sponge', 'Dark chocolate ganache', 'Chocolate curls', 'Cocoa powder'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake3.png',
    title: 'Red Velvet Bliss',
    price: 'ETB180',
    description: 'Moist red velvet cupcakes with cream cheese frosting and red velvet crumbs.',
    ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'Red velvet crumbs', 'Buttermilk'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake4.png',
    title: 'Lemon Zest',
    price: 'ETB170',
    description: 'Tangy lemon cupcakes with lemon buttercream and candied lemon peel.',
    ingredients: ['Lemon sponge', 'Lemon buttercream', 'Candied lemon', 'Lemon zest'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake5.png',
    title: 'Caramel Delight',
    price: 'ETB175',
    description: 'Caramel-infused cupcakes with salted caramel frosting and caramel drizzle.',
    ingredients: ['Caramel sponge', 'Salted caramel frosting', 'Caramel sauce', 'Sea salt'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake6.png',
    title: 'Strawberry Swirl',
    price: 'ETB165',
    description: 'Fresh strawberry cupcakes with strawberry buttercream and fresh berry.',
    ingredients: ['Strawberry sponge', 'Strawberry buttercream', 'Fresh strawberry', 'Strawberry puree'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake7.png',
    title: 'Cookies & Cream',
    price: 'ETB170',
    description: 'Chocolate cupcakes with cookies and cream frosting and cookie crumbs.',
    ingredients: ['Chocolate sponge', 'Oreo buttercream', 'Crushed cookies', 'Vanilla extract'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake8.jpg',
    title: 'Birthday Special',
    price: 'ETB200',
    description: 'Colorful birthday cupcakes with rainbow sprinkles and festive toppings.',
    ingredients: ['Vanilla or chocolate sponge', 'Buttercream frosting', 'Rainbow sprinkles', 'Edible glitter'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake9.png',
    title: 'Coconut Paradise',
    price: 'ETB180',
    description: 'Tropical coconut cupcakes with coconut frosting and toasted coconut flakes.',
    ingredients: ['Coconut sponge', 'Coconut buttercream', 'Toasted coconut', 'Coconut milk'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  }
];

// Order Form Modal Component for Cupcakes
const CupcakeOrderFormModal = ({ cupcake, isOpen, onClose, orderType }) => {
  const [formData, setFormData] = useState({
    // Cupcake Specifications
    cupcakeType: cupcake?.title || '',
    quantity: '',
    cupcakeFlavor: '',
    frostingType: '',
    toppings: '',

    // Design Preferences
    cupcakeTheme: '',
    cupcakeColors: '',
    cupcakeMessage: '',

    // Special Requests
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const cupcakeFlavors = [
    'Vanilla',
    'Chocolate',
    'Red Velvet',
    'Lemon',
    'Strawberry',
    'Caramel',
    'Coconut',
    'Coffee',
    'Funfetti',
    'Other (specify in notes)'
  ];

  const frostingTypes = [
    'Buttercream',
    'Cream Cheese',
    'Chocolate Ganache',
    'Whipped Cream',
    'Cream Cheese Frosting',
    'Italian Meringue',
    'Swiss Meringue',
    'Fondant',
    'Other (specify in notes)'
  ];

  const toppings = [
    'Sprinkles',
    'Fresh Fruits',
    'Chocolate Shavings',
    'Edible Flowers',
    'Cookie Crumbs',
    'Nuts',
    'Caramel Drizzle',
    'Coconut Flakes',
    'Gold Dust',
    'Custom Toppers',
    'Other (specify in notes)'
  ];

  const quantities = [
    '6 cupcakes',
    '12 cupcakes',
    '18 cupcakes',
    '24 cupcakes',
    '36 cupcakes',
    '48 cupcakes',
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
        orderType: orderType === 'customize' ? 'Custom Cupcake Order' : `Standard Cupcake Order: ${cupcake?.title || 'Unknown Cupcake'}`,
        title: cupcake?.title || (orderType === 'customize' ? 'Custom Cupcake Order' : 'Unknown Cupcake'),
        price: cupcake?.price || 'Contact for quote',
        img: cupcake?.img,

        // Item Details
        cupcakeType: formData.cupcakeType,
        quantity: formData.quantity,
        cupcakeFlavor: formData.cupcakeFlavor,
        frostingType: formData.frostingType,
        toppings: formData.toppings,
        estimatedPrice: cupcake?.price || 'Contact for quote',

        // Design
        theme: formData.cupcakeTheme,
        colors: formData.cupcakeColors,
        message: formData.cupcakeMessage,

        // Special Requests
        specialRequests: formData.specialRequests,

        // Metadata
        image: window.location.origin + (cupcake?.img || ''),
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);
      console.log('✅ Cupcake added to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding cupcake to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      cupcakeType: cupcake?.title || '',
      quantity: '',
      cupcakeFlavor: '',
      frostingType: '',
      toppings: '',
      cupcakeTheme: '',
      cupcakeColors: '',
      cupcakeMessage: '',
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
              "{cupcake?.title}" has been added to your cart. You can continue shopping or proceed to checkout.
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
              {orderType === 'customize' ? 'Customize Cupcake Order' : 'Order These Cupcakes'}
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

          {/* Cupcake Summary */}
          {cupcake && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img src={cupcake.img} alt={cupcake.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{cupcake.title}</h3>
                  <p className="text-primary-600 font-semibold">{cupcake.price} per cupcake</p>
                  <p className="text-sm text-gray-600">{cupcake.size} • {cupcake.servings}</p>
                  <p className="text-sm text-gray-600 mt-1">{cupcake.description}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Cupcake Specifications */}
            <div className="section-card">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🧁 Cupcake Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cupcake Type</label>
                  <input
                    type="text"
                    name="cupcakeType"
                    value={formData.cupcakeType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Birthday Cupcakes, Wedding Cupcakes, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Quantity</option>
                    {quantities.map(quantity => (
                      <option key={quantity} value={quantity}>{quantity}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                  <select
                    name="cupcakeFlavor"
                    value={formData.cupcakeFlavor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Flavor</option>
                    {cupcakeFlavors.map(flavor => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Toppings</label>
                  <select
                    name="toppings"
                    value={formData.toppings}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <h3 className="text-lg font-semibold mb-4 text-primary-600">🎨 Design Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme/Design</label>
                  <input
                    type="text"
                    name="cupcakeTheme"
                    value={formData.cupcakeTheme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Floral, Modern, Vintage, Character, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    type="text"
                    name="cupcakeColors"
                    value={formData.cupcakeColors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Pink and gold, Blue and white, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message/Toppers</label>
                  <input
                    type="text"
                    name="cupcakeMessage"
                    value={formData.cupcakeMessage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any custom messages for toppers or special decorations?"
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

// Cupcake Modal Component
const CupcakeModal = ({ cupcake, isOpen, onClose, onOrder, onCustomize }) => {
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
                src={cupcake.img}
                alt={cupcake.title}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{cupcake.title}</h2>
              <p className="text-2xl font-semibold text-primary-600">{cupcake.price} per cupcake</p>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{cupcake.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {cupcake.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Size</h4>
                  <p className="text-gray-600">{cupcake.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Servings</h4>
                  <p className="text-gray-600">{cupcake.servings}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="btn-primary w-full"
                  onClick={() => onOrder(cupcake)}
                >
                  Order These Cupcakes
                </button>
                <button
                  className="btn-secondary w-full mt-2"
                  onClick={() => onCustomize(cupcake)}
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

const Cupcakes = () => {
  const [selectedCupcake, setSelectedCupcake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderType, setOrderType] = useState('standard'); // 'standard' or 'customize'

  const handleViewDetails = (cupcake) => {
    setSelectedCupcake(cupcake);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCupcake(null);
  };

  const handleOrder = (cupcake) => {
    setSelectedCupcake(cupcake);
    setOrderType('standard');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCustomize = (cupcake) => {
    setSelectedCupcake(cupcake);
    setOrderType('customize');
    setIsModalOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setSelectedCupcake(null);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Our Cupcake Collection</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our delightful assortment of beautifully decorated cupcakes. Perfect for any occasion, each cupcake is crafted with premium ingredients and artistic flair.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cupcakes.map((cupcake, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <img
                  src={cupcake.img}
                  alt={cupcake.title}
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(cupcake)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cupcake.title}</h3>
              <p className="text-gray-600 mb-4">Starting from {cupcake.price}</p>
              <button
                className="btn-primary w-full"
                onClick={() => handleViewDetails(cupcake)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cupcake Details Modal */}
      <CupcakeModal
        cupcake={selectedCupcake}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
        onCustomize={handleCustomize}
      />

      {/* Order Form Modal */}
      <CupcakeOrderFormModal
        cupcake={selectedCupcake}
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        orderType={orderType}
      />
    </div>
  );
};

export default Cupcakes;  
