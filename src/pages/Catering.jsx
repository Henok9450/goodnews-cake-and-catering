import { getServices } from '../services/serviceService';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import OptimizedImage from '../components/common/OptimizedImage';
import SEOHead from '../components/common/SEOHead';
import { Share2, MessageCircle, Download } from 'lucide-react';

const cateringItems = [
  {
    id: 1,
    img: '/images/catering/catering1.png',
    title: 'Grand Continental Dessert & Pastry Banquet Table',
    description: 'A lavish multi-tiered dessert buffet presentation featuring woven strawberry basket cake, glazed fresh fruit tarts, golden croissants, fruit danishes, and gourmet confections.',
    serves: '40-75 people',
    category: 'desserts'
  },
  {
    id: 2,
    img: '/images/catering/catering2.png',
    title: 'Elegant Wedding & Celebration Dessert Table Display',
    description: 'Sophisticated dessert display centered around a floral-topped semi-naked celebration cake, flanked by tall taper candles, mini cupcake risers, brownie towers, and dessert shooter parfaits.',
    serves: '30-60 people',
    category: 'desserts'
  },
  {
    id: 3,
    img: '/images/catering/catering3.png',
    title: 'Modern Minimalist Plinth Pastry & Fruit Display',
    description: 'Contemporary stepped white plinth buffet presentation showcasing flaky golden croissants, piped cream tartlets, French macaron tower, and fresh seasonal berry bowls.',
    serves: '20-35 people',
    category: 'breakfast'
  },
  {
    id: 4,
    img: '/images/catering/catering4.png',
    title: 'Executive Brunch & Cocktail Pastry Spread',
    description: 'A vibrant catering spread featuring colorful stemmed cocktail goblets, glazed morning donuts, raspberry waffle bites, lemon curd tarts, mini cupcakes, and fresh sliced fruit platters.',
    serves: '25-40 people',
    category: 'breakfast'
  },
  {
    id: 5,
    img: '/images/catering/catering5.png',
    title: 'Executive Grand Banquet Buffet & Savory Table',
    description: 'Luxurious banquet table presentation with tiered savory hors doeuvres, gourmet meatballs, delicate tartlets, fresh floral centerpieces, and glowing brass candelabras.',
    serves: '40-80 people',
    category: 'lunch'
  },
  {
    id: 6,
    img: '/images/catering/catering6.png',
    title: 'Royal Golden Tiered Dessert & Petit Four Buffet',
    description: 'Spectacular gold geometric arch dessert buffet featuring layers of gourmet dessert shooters, golden artisan cake pops, mini fruit tartlets, and pastry bite platters.',
    serves: '60-120 people',
    category: 'desserts'
  },
  {
    id: 7,
    img: '/images/catering/catering7.png',
    title: 'Tiered Mini Cupcake & Dessert Shot Catering Station',
    description: 'Modern stepped white presentation featuring fresh raspberry-topped mini cupcakes, layered mousse shooters, artisan chocolate truffles, and sweet confection bowls.',
    serves: '30-50 people',
    category: 'desserts'
  },
  {
    id: 8,
    img: '/images/catering/catering8.png',
    title: 'Baby Shower & Milestone Celebration Plinth Setup',
    description: 'Thematic celebration setup with pastel balloon arch garland, welcome easel board, and golden pedestal tables curated for baby showers and christenings.',
    serves: '25-50 people',
    category: 'desserts'
  },
  {
    id: 9,
    img: '/images/catering/wedding-catering.png',
    title: 'Wedding & Event Catering Box Package',
    description: 'Organized pyramid banquet display of individual sanitized gourmet meal boxes with fresh seasonal fruit platters, ideal for receptions and celebrations.',
    serves: '50-100+ guests',
    category: 'lunch'
  }
];

const Catering = () => {
  const [liveServices, setLiveServices] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    getServices()
      .then(servs => {
        if (isMounted && servs && servs.length > 0) {
          setLiveServices(servs.map(s => ({
            id: s.id,
            img: s.coverImage || (s.images && s.images[0]) || '/images/catering/catering1.png',
            title: s.title,
            description: s.description,
            serves: s.serves || '10-15 people',
            category: s.category || 'desserts'
          })));
        }
      })
      .catch(e => console.warn('Using default catering items:', e.message));

    return () => { isMounted = false; };
  }, []);

  const displayCateringItems = liveServices.length > 0 ? liveServices : cateringItems;
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageTitle, setCurrentImageTitle] = useState('');
  const [formData, setFormData] = useState({
    // Event Context
    eventType: '',
    guestCount: '',

    // Order Details
    selectedItems: [],
    specialRequests: '',

    // Catering Specifics
    setupRequired: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Data for catering items - using the same image display logic as Gallery
  

  const eventTypes = [
    'Corporate Event',
    'Wedding',
    'Birthday Party',
    'Baby Shower',
    'Graduation',
    'Anniversary',
    'Holiday Party',
    'Other'
  ];

  // Slug generator
  const toSlug = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const [copied, setCopied] = useState(false);

  // Deep linking: read ?package=... from URL on mount/update
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pkgSlug = params.get('package');
    if (pkgSlug && displayCateringItems.length > 0) {
      const match = displayCateringItems.find(p => toSlug(p.title) === pkgSlug);
      if (match) {
        setCurrentImage(match.img);
        setCurrentImageTitle(match.title);
        setSelectedItem(match);
        setShowImageModal(true);
      }
    }
  }, [displayCateringItems]);

  // Function to handle viewing image in modal
  const handleViewImage = (img, title, item = null) => {
    setCurrentImage(img);
    setCurrentImageTitle(title);
    setSelectedItem(item);
    setShowImageModal(true);
    const slug = toSlug(title);
    window.history.replaceState({ package: slug }, '', `${window.location.pathname}?package=${slug}`);
  };

  // Function to close image modal
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setCurrentImage('');
    setCurrentImageTitle('');
    setSelectedItem(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const handleDownloadPhoto = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    const cleanTitle = (currentImageTitle || 'Catering').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `GoodNews-Catering-${cleanTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowForm(true);
    // Add the selected item to the form data
    if (!formData.selectedItems.some(selected => selected.id === item.id)) {
      setFormData(prev => ({
        ...prev,
        selectedItems: [...prev.selectedItems, { ...item, quantity: 1 }]
      }));
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    }));
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(item => item.id !== itemId)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep < 2) {
      e.preventDefault();
    }
  };

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentStep < 2) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Format selected items for email/display
      const formattedItems = formData.selectedItems.map(item =>
        `${item.title} - Quantity: ${item.quantity}`
      ).join('\n');

      const orderData = {
        cartId: Date.now(),
        orderType: 'Catering Order',
        title: `Catering: ${formData.eventType || 'Event'} (${formData.guestCount || '0'} guests)`,
        price: 'Quote on Request',
        img: formData.selectedItems.length > 0 ? formData.selectedItems[0].img : '/images/catering/catering1.png',

        eventType: formData.eventType,
        guestCount: formData.guestCount,

        // Custom field for cart display/email
        orderSummary: `Items:\n${formattedItems}`,

        selectedItems: formData.selectedItems,
        specialRequests: formData.specialRequests,
        setupRequired: formData.setupRequired ? 'Yes' : 'No',

        image: formData.selectedItems.length > 0 ? (window.location.origin + formData.selectedItems[0].img) : '',
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);
      console.log('✅ Catering order added to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding catering order to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotal = () => {
    return 'Quote on Request';
  };

  const resetForm = () => {
    setFormData({
      eventType: '',
      guestCount: '',
      selectedItems: [],
      specialRequests: '',
      setupRequired: false
    });
    setCurrentStep(1);
    setShowForm(false);
    setSelectedItem(null);
    setIsSubmitted(false);
    setSubmissionError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Added to Cart!</h2>
              <p className="text-gray-600 mb-6">
                Your catering request has been added to your cart. You can continue shopping or proceed to checkout to request a formal quote.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-center">Request Summary</h3>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Event Type:</strong> {formData.eventType}</p>
                      <p><strong>Guest Count:</strong> {formData.guestCount}</p>
                    </div>
                  </div>
                  <div>
                    <strong>Selected Items:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {formData.selectedItems.map((item, index) => (
                        <li key={index}>{item.title} (Qty: {item.quantity})</li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Pricing:</strong> Quote provided upon confirmation</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 font-semibold"
                >
                  Create Another Request
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="btn-primary px-6 py-2 font-semibold"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36">
      {/* Package & Image Detail Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Catering package details">
          {/* Dynamic SEO Head when catering package is viewed */}
          <SEOHead
            customTitle={`${currentImageTitle} | GoodNews Catering Addis Ababa`}
            customDescription={selectedItem?.description || 'Premium event catering package by GoodNews Cake & Catering in Addis Ababa.'}
            customImage={currentImage.startsWith('http') ? currentImage : `https://goodnews-cake-and-catering.vercel.app${currentImage}`}
            customCanonical={`https://goodnews-cake-and-catering.vercel.app/catering?package=${toSlug(currentImageTitle)}`}
          />

          <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] w-full overflow-y-auto p-6 relative custom-scrollbar shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{currentImageTitle}</h3>
              <button
                onClick={handleCloseImageModal}
                aria-label="Close catering details"
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="flex justify-center max-h-[60vh] h-80 sm:h-96 rounded-2xl bg-gray-50 overflow-hidden mb-4 border border-gray-100">
              <OptimizedImage
                src={currentImage}
                alt={currentImageTitle}
                width="800"
                height="600"
                cardMode={false}
                priority={true}
                className="max-w-full max-h-[60vh] object-contain rounded-xl"
              />
            </div>

            {selectedItem?.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {selectedItem.description}
              </p>
            )}

            {/* Social Share & WhatsApp Consultation Row */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
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
                  title="Copy shareable link to this catering package"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? '✓ Link Copied!' : 'Share Package'}</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://t.me/goodnewscake?text=${encodeURIComponent(`Hello GoodNews Cake, I would like to inquire about the "${currentImageTitle}" catering package: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-bold py-1.5 px-3 rounded-lg hover:bg-sky-50 transition-colors"
                  title="Inquire about this catering package on Telegram"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.04.36z" />
                  </svg>
                  <span>Inquire on Telegram</span>
                </a>
                <a
                  href={`https://wa.me/251917559943?text=${encodeURIComponent(`Hello GoodNews Cake, I would like to inquire about the "${currentImageTitle}" catering package: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold py-1.5 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
                  title="Inquire about this catering package on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <button
                  onClick={handleCloseImageModal}
                  className="btn-secondary py-1.5 px-4 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Catering Services in Addis Ababa
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Elevate your celebration with premium event catering, dessert table buffets, and morning breakfast spreads in Addis Ababa. From luxury wedding banquets and corporate conferences to birthday celebrations and intimate cocktail gatherings.
        </p>

        {!showForm ? (
          <>
            {/* Using the same image logic as Gallery component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayCateringItems.map((item, index) => (
                <div key={item.id} className="card p-6 text-center flex flex-col">
                  {/* Same image container logic as Gallery */}
                  <div className="w-full h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden relative group">
                    <OptimizedImage
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="384"
                      cardMode={true}
                      priority={index < 3}
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* View Details Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleViewImage(item.img, item.title, item)}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Serves: {item.serves}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex gap-2">
                      <button
                        className="btn-primary flex-1"
                        onClick={() => handleItemSelect(item)}
                      >
                        Add to Order
                      </button>
                      <button
                        onClick={() => handleViewImage(item.img, item.title, item)}
                        className="btn-secondary px-4"
                        title="View larger image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto card p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Custom Catering Requests</h3>
              <p className="text-gray-600 mb-6">
                Don't see what you're looking for? We can create custom catering packages tailored to your specific needs.
              </p>
              <button
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Start Custom Order
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2].map(step => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                      {step}
                    </div>
                    <span className="text-sm mt-2 text-gray-600">
                      {['Selection', 'Review'][step - 1]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="card p-8 mb-8">
              {/* Step 1: Menu Selection & Event Context */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Menu Selection</h2>

                  <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
                    <div>
                      <label htmlFor="catering-event-type" className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                      <select
                        id="catering-event-type"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Event Type</option>
                        {eventTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="catering-guest-count" className="block text-sm font-medium text-gray-700 mb-2">Estimated Guest Count</label>
                      <input
                        id="catering-guest-count"
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="e.g. 50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {formData.selectedItems.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Selected Items</h3>
                      {formData.selectedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded cursor-pointer"
                              onClick={() => handleViewImage(item.img, item.title)}>
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.title}`}
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.title}`}
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove ${item.title} from package`}
                              onClick={() => removeItem(item.id)}
                              className="ml-4 text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No items selected yet.</p>
                  )}

                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-secondary w-full"
                    >
                      Browse More Items
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <label htmlFor="catering-setup-required" className="flex items-center cursor-pointer">
                      <input
                        id="catering-setup-required"
                        type="checkbox"
                        name="setupRequired"
                        checked={formData.setupRequired}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require setup service at venue (additional fee may apply)</span>
                    </label>

                    <div>
                      <label htmlFor="catering-special-requests" className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Dietary Restrictions</label>
                      <textarea
                        id="catering-special-requests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Any specific dietary requirements, allergies, or special instructions..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review and Submit */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Review Your Catering Order</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                      <div className="space-y-2">
                        <p><strong>Event Type:</strong> {formData.eventType || 'N/A'}</p>
                        <p><strong>Guest Count:</strong> {formData.guestCount || 'N/A'}</p>
                        <p><strong>Setup Required:</strong> {formData.setupRequired ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      {formData.selectedItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">{item.title} × {item.quantity}</p>
                            <p className="text-sm text-gray-600">{item.serves}</p>
                          </div>
                          </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t-2">
                        <p className="text-lg font-bold">Estimated Total:</p>
                        <p className="text-lg font-bold text-primary-600">Quote on Request</p>
                      </div>
                    </div>
                  </div>

                  {formData.specialRequests && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                      <p className="text-gray-600">{formData.specialRequests}</p>
                    </div>
                  )}

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-800 mb-2">Important Notes</h4>
                    <ul className="text-sm text-primary-700 space-y-1">
                      <li>• Final price may vary based on specific requirements</li>
                      <li>• We'll contact you within 24 hours to confirm details</li>
                      <li>• Orders require at least 48 hours notice</li>
                      <li>• 50% deposit required to secure your order</li>
                      <li>• Delivery fees may apply based on location</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between max-w-4xl mx-auto">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg ${currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Previous
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-6 py-2"
                >
                  Review Order
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || formData.selectedItems.length === 0}
                  className="btn-primary px-6 py-2 disabled:bg-primary-400 disabled:cursor-not-allowed"
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
                    'Submit Catering Order'
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div >
  );
};

export default Catering;
