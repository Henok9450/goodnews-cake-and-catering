import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';

const defaultCakes = [
  {
    img: '/images/cakes/cake1.png',
    title: 'Beautiful Cake Design 1',
    description: 'A stunning vanilla cake with buttercream frosting and fresh fruit decorations.',
    ingredients: ['Vanilla sponge', 'Buttercream frosting', 'Fresh fruits', 'Edible flowers'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake2.png',
    title: 'Chocolate Delight',
    description: 'Rich chocolate cake with ganache filling and chocolate shavings.',
    ingredients: ['Chocolate sponge', 'Dark chocolate ganache', 'Chocolate shavings', 'Whipped cream'],
    size: '1.5 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/cake3.png',
    title: 'Red Velvet Elegance',
    description: 'Classic red velvet cake with cream cheese frosting and red velvet crumbs.',
    ingredients: ['Red velvet sponge', 'Cream cheese frosting', 'White chocolate', 'Red velvet crumbs'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake4.png',
    title: 'Wedding Special',
    description: 'Elegant multi-tier wedding cake with intricate piping and pearl decorations.',
    ingredients: ['Vanilla and chocolate layers', 'Swiss meringue buttercream', 'Edible pearls', 'Gold leaf'],
    size: 'Two-tier (6" & 8")',
    servings: '30-40 people'
  },
  {
    img: '/images/cakes/cake5.png',
    title: 'Fruit Fantasy',
    description: 'Light sponge cake loaded with seasonal fruits and whipped cream.',
    ingredients: ['Vanilla sponge', 'Fresh whipped cream', 'Seasonal fruits', 'Fruit glaze'],
    size: '1.5 kg',
    servings: '10-12 people'
  },
  {
    img: '/images/cakes/cake6.png',
    title: 'Caramel Dream',
    description: 'Moist caramel cake with salted caramel filling and caramel drizzle.',
    ingredients: ['Caramel sponge', 'Salted caramel filling', 'Caramel buttercream', 'Caramel sauce'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake7.png',
    title: 'Lemon Zest',
    description: 'Tangy lemon cake with lemon curd filling and lemon glaze.',
    ingredients: ['Lemon sponge', 'Lemon curd', 'Lemon buttercream', 'Candied lemon'],
    size: '1 kg',
    servings: '8-10 people'
  },
  {
    img: '/images/cakes/cake8.png',
    title: 'Birthday Special',
    description: 'Fun birthday cake with colorful sprinkles and personalized message.',
    ingredients: ['Choice of flavor', 'Buttercream frosting', 'Colorful sprinkles', 'Custom message'],
    size: '1.5 kg',
    servings: '12-15 people'
  },
  {
    img: '/images/cakes/cake9.png',
    title: 'Celebration Delight',
    description: 'Festive tiered party cake with edible decorations and custom messaging.',
    ingredients: ['Choice of flavor', 'Buttercream frosting', 'Colorful sprinkles', 'Custom message'],
    size: '1.5 kg',
    servings: '12-15 people'
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
          <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 border border-gray-100">
            <img
              src={cake.img}
              alt={cake.title}
              className="w-full max-h-[380px] object-contain rounded-xl"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900">{cake.title}</h2>
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
    getProducts({ category: 'cakes', status: 'published' })
      .then(prods => {
        if (isMounted && prods && prods.length > 0) {
          setLiveCakes(prods.map(p => ({
            id: p.id,
            title: p.name,
            img: p.featuredImage || (p.images && p.images[0]) || '/images/cakes/cake1.png',
            description: p.description,
            ingredients: p.ingredients || [],
            size: p.size || '1 kg',
            servings: p.servings || '8-10 people'
          })));
        }
      })
      .catch(err => console.warn('Using default cakes catalog:', err.message));

    return () => { isMounted = false; };
  }, []);

  const displayCakes = liveCakes.length > 0 ? liveCakes : defaultCakes;

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
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">Our Cake Gallery</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          Browse through our collection of beautifully crafted cakes. Each one is made with love, fresh ingredients, and attention to detail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCakes.map((cake, index) => (
            <div key={cake.id || index} className="card p-6 text-center flex flex-col justify-between hover:shadow-xl transition-shadow rounded-3xl border border-gray-100">
              <div className="w-full h-80 flex items-center justify-center rounded-2xl mb-4 overflow-hidden bg-gray-50/50">
                <img
                  src={cake.img}
                  alt={cake.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="320"
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
