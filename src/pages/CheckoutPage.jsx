import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, CheckCircle, Cake, Receipt, AlertCircle } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { emailService } from '../services/emailService';

const CheckoutPage = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const isProcessingRef = React.useRef(false); // Immediate lock to prevent double-clicks
    const formMountedAtRef = React.useRef(Date.now()); // Anti-bot submission speed check

    // Checkout Form State with session draft restoration
    const [formData, setFormData] = useState(() => {
        try {
            const savedDraft = sessionStorage.getItem('checkout_draft_data');
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                return {
                    name: parsed.name || user?.displayName || '',
                    email: parsed.email || user?.email || '',
                    phone: parsed.phone || '',
                    eventDate: parsed.eventDate || '',
                    deliveryTime: parsed.deliveryTime || '',
                    address: parsed.address || '',
                    orderNotes: parsed.orderNotes || '',
                    companyUrl: ''
                };
            }
        } catch (e) {
            // ignore storage read exceptions
        }
        return {
            name: user?.displayName || '',
            email: user?.email || '',
            phone: '',
            eventDate: '',
            deliveryTime: '',
            address: '',
            orderNotes: '',
            companyUrl: '' // Honeypot anti-bot trap
        };
    });

    const handleInputChange = (e) => {
        const nextData = { ...formData, [e.target.name]: e.target.value };
        setFormData(nextData);
        try {
            const { companyUrl, ...cleanDraft } = nextData;
            sessionStorage.setItem('checkout_draft_data', JSON.stringify(cleanDraft));
        } catch (err) {
            // ignore storage write errors
        }
    };

    const processOrderCheckout = async (e) => {
        e.preventDefault();

        // 🛑 NUCLEAR LOCK: Prevent any second click from entering
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        setIsCheckingOut(true);
        setErrorMessage('');

        // 1. Offline connection check
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setErrorMessage("You appear to be offline. Please reconnect to the internet and try again. Your cart items have been preserved.");
            setIsCheckingOut(false);
            isProcessingRef.current = false;
            return;
        }

        // 2. Anti-bot honeypot evaluation
        if (formData.companyUrl) {
            console.warn('Bot submission blocked via honeypot');
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsCheckingOut(false);
            isProcessingRef.current = false;
            setIsSuccess(true);
            return;
        }

        // 3. Anti-bot rapid programmatic submission check (< 1.2 seconds)
        if (Date.now() - formMountedAtRef.current < 1200) {
            setErrorMessage("Submission occurred unusually quickly. Please verify your order details and click Place Order once more.");
            setIsCheckingOut(false);
            isProcessingRef.current = false;
            return;
        }

        // 4. Rate-limiting check (prevent multiple rapid orders within 15 seconds)
        const lastOrderTime = sessionStorage.getItem('last_order_timestamp');
        if (lastOrderTime && Date.now() - Number(lastOrderTime) < 15000) {
            setErrorMessage("An order submission was recently received. Please wait a moment before submitting another order.");
            setIsCheckingOut(false);
            isProcessingRef.current = false;
            return;
        }

        try {
            // Generate a simple human-readable order number
            const orderNumber = `GN-${Math.floor(100000 + Math.random() * 900000)}`;

            // Sanitize customer inputs to prevent script injection and oversized field payloads
            const cleanName = String(formData.name || '').replace(/[<>]/g, '').trim().slice(0, 100);
            const cleanEmail = String(formData.email || '').replace(/[<>]/g, '').trim().slice(0, 100);
            const cleanPhone = String(formData.phone || '').replace(/[<>]/g, '').trim().slice(0, 30);
            const cleanAddress = String(formData.address || '').replace(/[<>]/g, '').trim().slice(0, 300);
            const cleanNotes = String(formData.orderNotes || '').replace(/[<>]/g, '').trim().slice(0, 500);

            // Prepare the bulk order data for email summary
            const orderSummary = cartItems.map(item => {
                const details = [];
                if (item.quantity) details.push(`Qty: ${item.quantity}`);
                if (item.cakeSize) details.push(`Size: ${item.cakeSize}`);
                
                // Collect any flavor/filling/frosting info
                const flavorInfo = item.flavor || item.cookieFlavor || item.cupcakeFlavor;
                if (flavorInfo) details.push(`Flavor: ${flavorInfo}`);
                if (item.filling) details.push(`Filling: ${item.filling}`);
                if (item.frosting) details.push(`Frosting: ${item.frosting}`);
                
                let summary = `- ${item.title || item.orderType} `;
                if (details.length > 0) summary += `\n  Details: ${details.join(', ')}`;
                
                const msg = item.message || item.cookieMessage || item.cupcakeMessage;
                if (msg) summary += `\n  | Msg: ${msg}`;
                
                const special = item.specialRequests || item.special;
                if (special) summary += `\n  | Special: ${special}`;
                
                return summary;
            }).join('\n');

            const fullOrderData = {
                orderNumber: orderNumber,
                orderType: 'Bulk Web Order (Shopping Cart)',
                name: cleanName,
                customerName: cleanName,
                email: cleanEmail,
                customerEmail: cleanEmail || 'N/A',
                phone: cleanPhone,
                customerPhone: cleanPhone,
                eventDate: formData.eventDate,
                deliveryTime: formData.deliveryTime,
                orderSummary: orderSummary,
                totalPrice: getCartTotal() > 0 ? `ETB ${getCartTotal()}` : 'Quote on Request',

                // Detailed Breakdown
                items: cartItems.map(item => ({
                    id: item.cartId || Date.now(),
                    title: item.title || item.orderType || 'Unnamed Item',
                    price: item.price || '0',
                    details: {
                        quantity: item.quantity || 1,
                        size: item.cakeSize || null,
                        flavor: item.flavor || item.cookieFlavor || item.cupcakeFlavor || null,
                        filling: item.filling || null,
                        frosting: item.frosting || null,
                        theme: item.theme || null,
                        colors: item.colors || null,
                        message: item.message || item.cookieMessage || item.cupcakeMessage || null,
                        special: item.specialRequests || item.special || null
                    }
                })),

                deliveryAddress: cleanAddress,
                deliveryNotes: cleanNotes,

                // Tracking & Metadata
                status: 'Received', // Initial status
                customerUid: user?.uid || 'guest',
                orderDate: new Date().toLocaleDateString(),
                orderTime: new Date().toLocaleTimeString(),
                createdAt: serverTimestamp()
            };

            // 1. Dispatch order notification email in background
            console.log('📧 Dispatching order email notification...');
            const emailPromise = emailService.sendOrder({
                ...fullOrderData
            }).catch(e => console.warn('⚠️ Email notification notice:', e));

            // 2. Save to Firestore for Real-time Admin Tracking (BLOCKING & CRITICAL)
            console.log('💾 Saving order to Firestore...');
            const docRef = await addDoc(collection(db, 'orders'), fullOrderData);
            const docId = docRef.id;
            console.log('✅ Order saved with ID:', docId);

            // Wait for email dispatch
            try {
                await emailPromise;
            } catch (emailErr) {
                console.warn('⚠️ Email notification notice (order record secured):', emailErr);
            }

            // --- CRITICAL SUCCESS PATH ---
            console.log('🎉 Checkout complete!');
            try {
                sessionStorage.removeItem('checkout_draft_data');
                sessionStorage.setItem('last_order_timestamp', Date.now().toString());
            } catch (err) {}
            setOrderId(orderNumber);
            clearCart();
            setIsSuccess(true);
        } catch (error) {
            console.error("CRITICAL Checkout Error:", error);
            setErrorMessage("Order submission failed: " + (error.message || 'Please check your connection and try again.') + ". Your cart items have been preserved.");
        } finally {
            setIsCheckingOut(false);
            isProcessingRef.current = false;
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
                <div className="bg-green-50 p-8 rounded-2xl shadow-sm border border-green-100">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg inline-block mb-6 font-mono font-bold text-lg">
                        Order #: {orderId}
                    </div>
                    <p className="text-gray-600 mb-8 text-lg">
                        Thank you for your order, {formData.name}. We have received your request and will contact you shortly at {formData.phone} to confirm details and payment.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(`/track/${orderId}`)}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Receipt className="w-4 h-4" />
                            <span>Track Order</span>
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 font-semibold inline-flex items-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added any sweet treats yet.</p>
                <button
                    onClick={() => navigate('/gallery')}
                    className="btn-primary"
                >
                    Browse Cakes
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-28 sm:pt-32 lg:pt-36">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.cartId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                            {/* Image Thumbnail */}
                            <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.img ? (
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        width="96"
                                        height="96"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Cake className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* Item Details */}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg text-gray-900">{item.title || item.orderType}</h3>
                                {item.cakeSize && <p className="text-sm text-gray-500">Size: {item.cakeSize}</p>}
                                {item.flavor && <p className="text-sm text-gray-500">Flavor: {item.flavor}</p>}
                                </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromCart(item.cartId)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Remove item"
                                aria-label={`Remove ${item.title || item.orderType || 'item'} from cart`}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Checkout Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                                <div>
                                    <p className="font-semibold">Notice</p>
                                    <p>{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Total Items</span>
                                <span className="font-medium">{cartItems.length}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Pricing</span>
                                <span className="text-primary-600 font-semibold">Quote on Request</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Final pricing and payment instructions will be provided after we review your order details.
                            </p>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={processOrderCheckout} className="space-y-4">
                            {/* Anti-bot Honeypot field (hidden from genuine users) */}
                            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                                <label htmlFor="checkout-company-url">Company Website</label>
                                <input
                                    type="text"
                                    id="checkout-company-url"
                                    name="companyUrl"
                                    value={formData.companyUrl || ''}
                                    onChange={handleInputChange}
                                    tabIndex="-1"
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="checkout-name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="checkout-phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    id="checkout-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="checkout-event-date" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                    <input
                                        type="date"
                                        id="checkout-event-date"
                                        name="eventDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="checkout-delivery-time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                                    <input
                                        type="time"
                                        id="checkout-delivery-time"
                                        name="deliveryTime"
                                        required
                                        value={formData.deliveryTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                <textarea
                                    id="checkout-address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full delivery address"
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="checkout-notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                                <textarea
                                    id="checkout-notes"
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    placeholder="Any specific instructions for your order?"
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isCheckingOut}
                                className="w-full btn-primary py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCheckingOut ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
