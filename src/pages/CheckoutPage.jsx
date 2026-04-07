import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, CheckCircle, Cake, Receipt } from 'lucide-react';
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
    const isProcessingRef = React.useRef(false); // Immediate lock to prevent double-clicks

    console.log('🚀 NUCLEAR RESET VER 2.5 - READY AT 04:58');
    console.log('Path: src/pages/Cart.jsx');

    // Checkout Form State
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        eventDate: '',
        deliveryTime: '',
        address: '',
        orderNotes: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const processOrderCheckout = async (e) => {
        e.preventDefault();

        // 🛑 NUCLEAR LOCK: Prevent any second click from entering
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        alert('🚀 GoodNews Checkout Ver 2.4 - Starting...'); // Force visual confirmation
        setIsCheckingOut(true);

        try {
            // Generate a simple human-readable order number
            const orderNumber = `GN-${Math.floor(100000 + Math.random() * 900000)}`;

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
                
                let summary = `- ${item.title || item.orderType} (Price: ${item.price})`;
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
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                eventDate: formData.eventDate,
                deliveryTime: formData.deliveryTime,
                orderSummary: orderSummary,
                totalPrice: `ETB ${getCartTotal()}`,

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

                deliveryAddress: formData.address || '',
                deliveryNotes: formData.orderNotes || '',

                // Tracking & Metadata
                status: 'Received', // Initial status
                customerUid: user?.uid || 'guest',
                orderDate: new Date().toLocaleDateString(),
                orderTime: new Date().toLocaleTimeString(),
                createdAt: serverTimestamp()
            };

            // 1. Save to Firestore for Real-time Tracking & History
            console.log('💾 Saving order to Firestore...');
            const docRef = await addDoc(collection(db, 'orders'), fullOrderData);
            console.log('✅ Order saved with ID:', docRef.id);

            // 2. Send via existing email service (Version 2.4 - Detached)
            console.log('📧 Dispatching order email (Async)...');
            Promise.resolve().then(async () => {
                try {
                    const result = await emailService.sendOrder({
                        ...fullOrderData,
                        firestoreId: docRef.id
                    });
                    if (result && result.success) console.log('✅ Background Email Sent');
                    else console.warn('⚠️ Background Email Failed:', result?.error);
                } catch (e) {
                    console.warn('⚠️ Background Email Error:', e);
                }
            });

            // --- CRITICAL SUCCESS PATH ---
            console.log('🎉 Checkout complete!');
            setOrderId(orderNumber);
            clearCart();
            setIsSuccess(true);
        } catch (error) {
            console.error("CRITICAL Checkout Error:", error);
            alert("Checkout Error: " + error.message);
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
        <div className="container mx-auto px-4 py-8 pt-24">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.cartId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                            {/* Image Thumbnail */}
                            <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.img ? (
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
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
                                <p className="text-primary-600 font-medium mt-1">{item.price}</p>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromCart(item.cartId)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Remove item"
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

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>ETB {getCartTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Service Fee</span>
                                <span>ETB 0</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>ETB {getCartTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={processOrderCheckout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                                    <input
                                        type="time"
                                        name="deliveryTime"
                                        required
                                        value={formData.deliveryTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full address"
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                                <textarea
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
