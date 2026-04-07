import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

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
    { size: '0.5 kg Round', servings: '8-10 people', price: 'ETB 800' },
    { size: '1 kg Round', servings: '12-16 people', price: 'ETB 1100' },
    { size: '1.5 kg Round', servings: '20-25 people', price: 'ETB 1400' },
    { size: '2 kg Round', servings: '30-40 people', price: 'ETB 1800' },
    { size: '2.5 kg Tier', servings: '25-35 people', price: 'ETB 2200' },
    { size: '3.5 kg Tier', servings: '40-50 people', price: 'ETB 2800' },
    { size: 'Custom Size', servings: 'Contact for quote', price: 'ETB Custom' }
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
        price: calculatePrice(),
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
    return selectedSize ? selectedSize.price : 'Contact for quote';
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
      <div className="min-h-screen pt-20">
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
                    <p><strong>Estimated Price:</strong> {calculatePrice()}</p>
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
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Custom Cake Order</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Create your dream cake! Tell us about your vision and we'll bring it to life with our expert baking skills.
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cake Type *</label>
                    <select
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cake Size *</label>
                    <select
                      name="cakeSize"
                      value={formData.cakeSize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      {cakeSizes.map(size => (
                        <option key={size.size} value={size.size}>
                          {size.size} - {size.servings} ({size.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                    <select
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filling</label>
                    <select
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frosting Type *</label>
                    <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme or Occasion</label>
                  <input
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    placeholder="e.g., Tropical Beach, Winter Wonderland, Superhero Theme"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    placeholder="e.g., Pink and gold, Blue and silver, Rainbow colors"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message on Cake</label>
                  <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g., Happy Birthday Sarah!, Congratulations!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Allergies</label>
                  <textarea
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
                      <p><strong>Estimated Price:</strong> {calculatePrice()}</p>
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
      </div>
    </div>
  );
};

export default CustomOrder;
