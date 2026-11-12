import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { MessageCircle } from 'lucide-react';

const CustomOrder = () => {
  const [formData, setFormData] = useState({
    // Cake Details
    cakeType: '',
    cakeSize: '',
    servings: '',
    flavor: '',
    filling: '',
    frosting: '',

    // Design Preferences
    theme: '',
    colors: '',
    message: '',
    specialRequests: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const cakeTypes = [
    'Birthday Cake',
    'Wedding Cake',
    'Anniversary Cake',
    'Graduation Cake',
    'Baby Shower Cake',
    'Custom Celebration Cake',
    'Other'
  ];

  const cakeSizes = [
    { size: '0.5 kg Round', servings: '8-10 people' },
    { size: '1 kg Round', servings: '12-16 people' },
    { size: '1.5 kg Round', servings: '20-25 people' },
    { size: '2 kg Round', servings: '30-40 people' },
    { size: '2.5 kg Tier', servings: '25-35 people' },
    { size: '3.5 kg Tier', servings: '40-50 people' },
    { size: 'Custom Size', servings: 'Contact for quote' }
  ];

  const flavors = [
    'Vanilla',
    'Chocolate',
    'Red Velvet',
    'Lemon',
    'Carrot',
    'Marble',
    'Coconut',
    'Strawberry',
    'Custom Flavor'
  ];

  const fillings = [
    'Buttercream',
    'Chocolate Ganache',
    'Fruit Preserves',
    'Cream Cheese',
    'Lemon Curd',
    'Caramel',
    'Custard',
    'Whipped Cream',
    'No Filling'
  ];

  const frostings = [
    'Buttercream',
    'Cream Cheese',
    'Whipped Cream',
    'Fondant',
    'Chocolate Ganache',
    'Italian Meringue'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (e) => {
    // Prevent form submission when Enter is pressed on non-final steps
    if (e.key === 'Enter' && currentStep < 3) {
      e.preventDefault();
    }
  };

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only allow submission on the final step
    if (currentStep < 3) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const orderData = {
        cartId: Date.now(),
        orderType: 'Custom Cake',
        title: `Custom ${formData.cakeType || 'Cake'}`,
        price: 'Quote on Request',
        img: '/images/cakes/cake8.png', // Placeholder for custom cakes

        // Details
        cakeType: formData.cakeType,
        cakeSize: formData.cakeSize,
        flavor: formData.flavor,
        filling: formData.filling,
        frosting: formData.frosting,
        theme: formData.theme,
        colors: formData.colors,
        message: formData.message,
        specialRequests: formData.specialRequests,

        // Metadata
        image: window.location.origin + '/images/cakes/cake8.png',
        addedAt: new Date().toISOString()
      };

      addToCart(orderData);
      console.log('✅ Custom cake added to cart:', orderData);

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error adding custom cake to cart:', error);
      setIsSubmitting(false);
      setSubmissionError('Failed to add to cart. Please try again.');
    }
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculatePrice = () => {
    const selectedSize = cakeSizes.find(size => size.size === formData.cakeSize);
    return 'Quote on Request';
  };

  const resetForm = () => {
    setFormData({
      cakeType: '',
      cakeSize: '',
      servings: '',
      flavor: '',
      filling: '',
      frosting: '',
      theme: '',
      colors: '',
      message: '',
      specialRequests: ''
    });
    setCurrentStep(1);
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
                Your custom cake request has been added to your cart. You can continue shopping or proceed to checkout to request a formal quote.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-center">Request Summary</h3>
                <div className="space-y-3">
                  <div>
                    <p><strong>Cake Type:</strong> {formData.cakeType}</p>
                    <p><strong>Size:</strong> {formData.cakeSize}</p>
                    <p><strong>Flavor:</strong> {formData.flavor}</p>
                    </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="btn-primary"
                >
                  Create Another Request
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="btn-secondary"
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
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Custom Cake Studio in Addis Ababa
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Design your personalized celebration cake online. Select custom tiers, gourmet sponge flavors, fillings, frostings, and special inscription messages for weddings, birthdays, anniversaries, and graduations in Addis Ababa.
        </p>

        {submissionError && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {submissionError}
          </div>
        )}

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                  {step}
                </div>
                <span className="text-sm mt-2 text-gray-600">
                  {['Details', 'Design', 'Review'][step - 1]}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="max-w-4xl mx-auto">
          <div className="card p-8 mb-8">

            {/* Step 1: Cake Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Cake Details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="custom-cake-type" className="block text-sm font-medium text-gray-700 mb-2">Cake Type *</label>
                    <select
                      id="custom-cake-type"
                      name="cakeType"
                      value={formData.cakeType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Cake Type</option>
                      {cakeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="custom-cake-size" className="block text-sm font-medium text-gray-700 mb-2">Cake Size *</label>
                    <select
                      id="custom-cake-size"
                      name="cakeSize"
                      value={formData.cakeSize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      {cakeSizes.map(size => (
                        <option key={size.size} value={size.size}>
                          {size.size} - {size.servings}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="custom-flavor" className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                    <select
                      id="custom-flavor"
                      name="flavor"
                      value={formData.flavor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Flavor</option>
                      {flavors.map(flavor => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="custom-filling" className="block text-sm font-medium text-gray-700 mb-2">Filling</label>
                    <select
                      id="custom-filling"
                      name="filling"
                      value={formData.filling}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Filling (Optional)</option>
                      {fillings.map(filling => (
                        <option key={filling} value={filling}>{filling}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="custom-frosting" className="block text-sm font-medium text-gray-700 mb-2">Frosting Type *</label>
                    <select
                      id="custom-frosting"
                      name="frosting"
                      value={formData.frosting}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Frosting</option>
                      {frostings.map(frosting => (
                        <option key={frosting} value={frosting}>{frosting}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Design Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Design Preferences</h2>

                <div>
                  <label htmlFor="custom-theme" className="block text-sm font-medium text-gray-700 mb-2">Theme or Occasion</label>
                  <input
                    id="custom-theme"
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    placeholder="e.g., Tropical Beach, Winter Wonderland, Superhero Theme"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="custom-colors" className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    id="custom-colors"
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    placeholder="e.g., Pink and gold, Blue and silver, Rainbow colors"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="custom-message" className="block text-sm font-medium text-gray-700 mb-2">Message on Cake</label>
                  <input
                    id="custom-message"
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g., Happy Birthday Sarah!, Congratulations!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="custom-special-requests" className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Allergies</label>
                  <textarea
                    id="custom-special-requests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any specific design elements, dietary restrictions, or special instructions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review and Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cake Details</h3>
                    <div className="space-y-2">
                      <p><strong>Type:</strong> {formData.cakeType}</p>
                      <p><strong>Size:</strong> {formData.cakeSize}</p>
                      <p><strong>Flavor:</strong> {formData.flavor}</p>
                      <p><strong>Filling:</strong> {formData.filling || 'None'}</p>
                      <p><strong>Frosting:</strong> {formData.frosting}</p>
                      </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Design Preferences</h3>
                  <div className="space-y-2">
                    <p><strong>Theme:</strong> {formData.theme || 'Not specified'}</p>
                    <p><strong>Colors:</strong> {formData.colors || 'Not specified'}</p>
                    <p><strong>Message:</strong> {formData.message || 'None'}</p>
                    <p><strong>Special Requests:</strong> {formData.specialRequests || 'None'}</p>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-primary-700 space-y-1">
                    <li>• Final price may vary based on design complexity</li>
                    <li>• We'll contact you within 24 hours to confirm details</li>
                    <li>• Orders require at least 3 days notice</li>
                    <li>• 50% deposit required to secure your order</li>
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

            {currentStep < 3 ? (
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
                disabled={isSubmitting}
                className="btn-primary px-6 py-2 disabled:bg-primary-400"
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
            )}
          </div>
        </form>

        {/* Direct Telegram & WhatsApp Consultation Box */}
        <div className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 border border-gray-200 text-center shadow-xs">
          <h3 className="font-bold text-gray-900 text-base mb-1">
            Have a reference photo or special custom design idea?
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 max-w-lg mx-auto">
            Chat directly with our master bakers and send your inspiration images on Telegram or WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://t.me/goodnewscake?text=Hello%20GoodNews%20Cake,%20I'd%20like%20to%20discuss%20a%20custom%20cake%20design!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 shadow-xs transition-colors"
              title="Chat on Telegram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.04.36z" />
              </svg>
              <span>Consult on Telegram</span>
            </a>
            <a
              href="https://wa.me/251917559943?text=Hello%20GoodNews%20Cake,%20I'd%20like%20to%20discuss%20a%20custom%20cake%20design!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 shadow-xs transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consult on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
