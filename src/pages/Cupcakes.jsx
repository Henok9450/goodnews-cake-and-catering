import { getProducts } from '../services/productService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import OptimizedImage from '../components/common/OptimizedImage';
import { Download } from 'lucide-react';

const cupcakes = [
  {
    img: '/images/cupcakes/cupcake1.png',
    title: 'Cream-Filled Chocolate Confetti Cupcakes',
    description: 'Tender dark chocolate cupcakes with a surprise vanilla marshmallow-cream center, coated in chocolate icing and dense rainbow nonpareil sprinkles.',
    ingredients: ['Dark cocoa sponge', 'Vanilla marshmallow-cream filling', 'Chocolate fudge icing', 'Rainbow nonpareil sprinkles'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake2.png',
    title: 'Easter Bunny Sprinkled Cupcakes',
    description: 'Playful golden sponge cupcakes topped with a rounded vanilla frosting dome rolled in white sugar sprinkles, marshmallow bunny ears, and pink candy accents.',
    ingredients: ['Golden sponge', 'Vanilla buttercream', 'Crisp white sprinkles', 'Marshmallow bunny ears', 'Jelly bean accents'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake3.png',
    title: 'Fresh Strawberry Buttercream Swirl Cupcakes',
    description: 'Golden vanilla cupcakes baked in crimson fluted liners, crowned with towering swirls of strawberry buttercream and garnished with fresh ripe strawberry slices.',
    ingredients: ['Vanilla sponge', 'Real strawberry buttercream', 'Fresh ripe strawberries', 'Strawberry glaze'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake4.png',
    title: 'Spring Farmyard Animal Cupcake Assortment',
    description: 'Delightful chocolate cupcakes whimsically decorated as spring farmyard friends: yellow marshmallow baby chicks, mini-marshmallow lambs, and digging bunny paws.',
    ingredients: ['Moist chocolate sponge', 'Miniature marshmallows', 'Vanilla buttercream', 'Fondant animal faces', 'Pastel candy accents'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake5.png',
    title: 'Fudge Swirl Chocolate Cupcake with Pastel Sprinkles',
    description: 'Moist dark chocolate cupcake in a plum liner, piped with a generous swirl of silky milk chocolate frosting and topped with colorful pastel sugar confetti.',
    ingredients: ['Dark cocoa sponge', 'Silky milk chocolate frosting', 'Pastel sugar confetti', 'Pure vanilla extract'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake6.png',
    title: 'Funfetti Birthday Cupcakes with Vanilla Swirl',
    description: 'Celebration golden cupcakes baked with rainbow sprinkles inside, topped with a tall spiral of whipped vanilla buttercream and showered with rainbow jimmies.',
    ingredients: ['Confetti sprinkle sponge', 'Whipped vanilla buttercream', 'Rainbow sugar jimmies', 'Pure vanilla'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake7.png',
    title: 'Spiderweb Chocolate Halloween Cupcakes',
    description: 'Spooky dark cocoa cupcakes glazed in porcelain-white royal icing with an intricate dark chocolate feather-dragged spiderweb pattern.',
    ingredients: ['Dark chocolate sponge', 'Vanilla royal glaze', 'Chocolate feathering', 'Dutch cocoa powder'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake8.jpg',
    title: 'Salted Caramel Toffee & Mocha Cupcakes',
    description: 'Rich dark chocolate cupcakes crowned with velvety espresso toffee buttercream, sea-salted caramel cubes, and crunchy toffee pearls.',
    ingredients: ['Dark cocoa sponge', 'Espresso toffee buttercream', 'Salted caramel cubes', 'Sea salt'],
    size: 'Standard cupcake',
    servings: '1 person per cupcake'
  },
  {
    img: '/images/cupcakes/cupcake9.png',
    title: 'Classic Vanilla Cloud Cupcakes',
    description: 'Fluffy chocolate cupcakes piped with towering spirals of rich vanilla cream cheese frosting on a baker golden rack.',
    ingredients: ['Fudge chocolate sponge', 'Vanilla cream cheese frosting', 'Vanilla extract'],
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
        price: 'Quote on Request',
        img: cupcake?.img,

        // Item Details
        cupcakeType: formData.cupcakeType,
        quantity: formData.quantity,
        cupcakeFlavor: formData.cupcakeFlavor,
        frostingType: formData.frostingType,
        toppings: formData.toppings,
        estimatedPrice: 'Quote on Request',

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
                  <label htmlFor="cupcake-type" className="block text-sm font-medium text-gray-700 mb-2">Cupcake Type</label>
                  <input
                    id="cupcake-type"
                    type="text"
                    name="cupcakeType"
                    value={formData.cupcakeType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Birthday Cupcakes, Wedding Cupcakes, etc."
                  />
                </div>

                <div>
                  <label htmlFor="cupcake-quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <select
                    id="cupcake-quantity"
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
                  <label htmlFor="cupcake-flavor" className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                  <select
                    id="cupcake-flavor"
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
                  <label htmlFor="cupcake-frosting" className="block text-sm font-medium text-gray-700 mb-2">Frosting Type *</label>
                  <select
                    id="cupcake-frosting"
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
                  <label htmlFor="cupcake-toppings" className="block text-sm font-medium text-gray-700 mb-2">Toppings</label>
                  <select
                    id="cupcake-toppings"
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
                  <label htmlFor="cupcake-theme" className="block text-sm font-medium text-gray-700 mb-2">Theme/Design</label>
                  <input
                    id="cupcake-theme"
                    type="text"
                    name="cupcakeTheme"
                    value={formData.cupcakeTheme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Floral, Modern, Vintage, Character, etc."
                  />
                </div>

                <div>
                  <label htmlFor="cupcake-colors" className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    id="cupcake-colors"
                    type="text"
                    name="cupcakeColors"
                    value={formData.cupcakeColors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Pink and gold, Blue and white, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="cupcake-message" className="block text-sm font-medium text-gray-700 mb-2">Custom Message/Toppers</label>
                  <input
                    id="cupcake-message"
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
              <label htmlFor="cupcake-special-requests" className="sr-only">Special Requests & Notes</label>
              <textarea
                id="cupcake-special-requests"
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
  const handleDownloadPhoto = () => {
    if (!cupcake || !cupcake.img) return;
    const link = document.createElement('a');
    link.href = cupcake.img;
    const cleanTitle = (cupcake.title || 'Cupcake').toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
                src={cupcake.img}
                alt={cupcake.title}
                width="600"
                height="600"
                cardMode={false}
                priority={true}
                className="w-full h-auto object-contain rounded-lg max-h-80"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{cupcake.title}</h2>
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

const Cupcakes = () => {
  const [liveCupcakes, setLiveCupcakes] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    getProducts({ category: 'cupcakes', status: 'published' })
      .then(prods => {
        if (isMounted && prods && prods.length > 0) {
          setLiveCupcakes(prods.map(p => ({
            id: p.id,
            title: p.name,
            img: p.featuredImage || (p.images && p.images[0]) || '/images/cupcakes/cupcake1.png',
            description: p.description,
            ingredients: p.ingredients || [],
            size: p.size || 'Standard cupcake',
            servings: p.servings || '1 person per cupcake'
          })));
        }
      })
      .catch(e => console.warn('Using default cupcakes:', e.message));

    return () => { isMounted = false; };
  }, []);

  const displayCupcakes = liveCupcakes.length > 0 ? liveCupcakes : cupcakes;
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
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Gourmet Handcrafted Cupcakes in Addis Ababa
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Indulge in freshly baked artisanal cupcakes in Addis Ababa. From rich chocolate fudge swirls and salted caramel to whimsical children's celebration boxes and funfetti party sets, baked fresh daily with premium natural ingredients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCupcakes.map((cupcake, index) => (
            <div key={index} className="card p-6 text-center flex flex-col">
              <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                <OptimizedImage
                  src={cupcake.img}
                  alt={cupcake.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="384"
                  cardMode={true}
                  priority={index < 3}
                  className="w-full h-full object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleViewDetails(cupcake)}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cupcake.title}</h3>
              <p className="text-gray-600 mb-4">{cupcake.size} • {cupcake.servings}</p>
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
