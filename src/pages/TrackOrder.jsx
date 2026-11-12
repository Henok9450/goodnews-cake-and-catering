import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
    Search, 
    Package, 
    Clock, 
    CheckCircle, 
    Truck, 
    Utensils, 
    ShieldCheck, 
    Calendar, 
    Sparkles, 
    Flame, 
    AlertCircle, 
    XCircle,
    CalendarClock
} from 'lucide-react';
import { calculateOrderStatus, getFreshnessAssurance, getStatusBadgeStyle } from '../utils/statusUtils';

const TrackOrder = () => {
    const { orderNumber: urlOrderNumber } = useParams();
    const navigate = useNavigate();
    const [searchNumber, setSearchNumber] = useState(urlOrderNumber || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(!!urlOrderNumber);
    const [error, setError] = useState('');

    const statusSteps = [
        { status: 'Received', icon: Clock, label: 'Order Received', desc: 'Order details reviewed' },
        { status: 'Confirmed', icon: ShieldCheck, label: 'Confirmed', desc: 'Production slot secured' },
        { status: 'Scheduled for Preparation', icon: CalendarClock, label: 'Scheduled', desc: 'Fresh prep scheduled' },
        { status: 'Preparation Started', icon: Sparkles, label: 'Prep Started', desc: 'Fresh ingredients weighed' },
        { status: 'Baking', icon: Flame, label: 'Fresh Baking', desc: 'Freshly baking in oven' },
        { status: 'Decorating', icon: Package, label: 'Decorating', desc: 'Artisanal icing & styling' },
        { status: 'Ready', icon: CheckCircle, label: 'Ready', desc: 'Quality checked & packaged' },
        { status: 'Out for Delivery', icon: Truck, label: 'Out for Delivery', desc: 'Carefully in transit' }
    ];

    useEffect(() => {
        if (urlOrderNumber) {
            trackOrder(urlOrderNumber);
        }
    }, [urlOrderNumber]);

    const trackOrder = (num) => {
        setLoading(true);
        setError('');
        
        try {
            const q = query(collection(db, 'orders'), where('orderNumber', '==', num.toUpperCase().trim()));
            
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    setOrder(querySnapshot.docs[0].data());
                } else {
                    setOrder(null);
                    setError('Order not found. Please check the order number and try again.');
                }
                setLoading(false);
            }, (err) => {
                console.error("Tracking error:", err);
                setError('Failed to fetch order status. Please try again.');
                setLoading(false);
            });

            return unsubscribe;
        } catch (err) {
            setError('Invalid order number format.');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchNumber.trim()) {
            navigate(`/track/${searchNumber.toUpperCase().trim()}`);
        }
    };

    const getCurrentStatusIndex = (currentStatus) => {
        if (!currentStatus) return 0;
        switch (currentStatus) {
            case 'Received':
            case 'Pending':
            case 'Order Received':
                return 0;
            case 'Confirmed':
            case 'Order Confirmed':
                return 1;
            case 'Scheduled':
            case 'Scheduled for Preparation':
                return 2;
            case 'Preparing':
            case 'Preparation Started':
                return 3;
            case 'Baking':
                return 4;
            case 'Decorating':
                return 5;
            case 'Ready':
            case 'Ready for Delivery':
            case 'Ready for Pickup':
                return 6;
            case 'Out for Delivery':
                return 7;
            case 'Delivered':
            case 'Completed':
                return 8; // Past last step, all marked complete
            default:
                return 0;
        }
    };

    const currentStatus = order ? calculateOrderStatus(order) : '';
    const currentIndex = order ? getCurrentStatusIndex(currentStatus) : -1;
    const isCancelled = currentStatus === 'Cancelled';
    const isDelivered = currentStatus === 'Delivered';

    return (
        <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36 bg-gray-50 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2 inline-block">
                        Real-Time Bakery Tracker
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Live Order & Freshness Status
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                        Track your handcrafted cake through every step of its journey from fresh ingredient preparation to your doorstep.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <label htmlFor="track-order-number" className="sr-only">Order Number</label>
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                                id="track-order-number"
                                type="text"
                                value={searchNumber}
                                onChange={(e) => setSearchNumber(e.target.value)}
                                placeholder="e.g. GN-202611-1001"
                                aria-label="Enter order tracking number"
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none uppercase font-mono text-sm tracking-wider"
                            />
                        </div>
                        <button type="submit" className="btn-primary py-3 px-8 rounded-xl font-bold text-sm tracking-wide shadow-sm">
                            Track Order
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-600 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-sm font-semibold text-gray-500">Retrieving live bakery status...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center max-w-xl mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="font-bold text-sm">{error}</p>
                    </div>
                ) : order ? (
                    <div className="space-y-6 animate-fadeIn">
                        
                        {/* Prominent Expected Delivery & Freshness Header Banner */}
                        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-800">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-700/60">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary-400">
                                            Order #{order.orderNumber || order.id}
                                        </span>
                                        <span className={getStatusBadgeStyle(order, currentStatus)}>
                                            {currentStatus}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        {isDelivered 
                                            ? 'Delivered Successfully!' 
                                            : isCancelled 
                                            ? 'Order Cancelled' 
                                            : `Expected Delivery: ${order.eventDate || order.deliveryDate || 'Scheduled'}`}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary-400 shrink-0" />
                                        <span>Event Date: <strong>{order.eventDate || order.deliveryDate || 'To be confirmed'}</strong></span>
                                        {order.deliveryTime && <span>at <strong>{order.deliveryTime} (Addis Ababa Time)</strong></span>}
                                    </p>
                                </div>
                                <div className="text-left md:text-right bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
                                    <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                                    <p className="text-xl sm:text-2xl font-extrabold text-white">{order.totalPrice || 'Quote on Request'}</p>
                                    <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                                        Payment: {order.paymentStatus || 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Freshness Assurance Callout */}
                            <div className="mt-5 flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10">
                                <Sparkles className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-primary-300">
                                        Freshness & Preparation Assurance
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-200 mt-0.5 leading-relaxed">
                                        {getFreshnessAssurance(order, currentStatus)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Milestone Tracker (Hidden if Cancelled) */}
                        {!isCancelled && (
                            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                                        Production & Delivery Timeline
                                    </h3>
                                    <span className="text-xs font-bold text-gray-500">
                                        {isDelivered 
                                            ? 'Complete (100%)' 
                                            : `Stage ${Math.min(currentIndex + 1, statusSteps.length)} of ${statusSteps.length}`}
                                    </span>
                                </div>

                                {/* Responsive Stepper */}
                                <div className="relative">
                                    {/* Desktop Connector Line */}
                                    <div className="hidden lg:block absolute left-4 right-4 top-6 h-1 bg-gray-100 z-0">
                                        <div 
                                            className="bg-primary-600 h-full transition-all duration-700 ease-out"
                                            style={{ 
                                                width: `${isDelivered ? 100 : Math.max(0, Math.min(100, (currentIndex / (statusSteps.length - 1)) * 100))}%` 
                                            }}
                                        ></div>
                                    </div>

                                    {/* Steps Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 sm:gap-6 relative z-10">
                                        {statusSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isPassed = isDelivered || index < currentIndex;
                                            const isCurrent = !isDelivered && index === currentIndex;

                                            return (
                                                <div 
                                                    key={step.status} 
                                                    className={`flex lg:flex-col items-center lg:items-center text-left lg:text-center gap-3 p-3 lg:p-1 rounded-xl transition-all ${
                                                        isCurrent ? 'bg-primary-50/70 border border-primary-200/80 shadow-2xs' : ''
                                                    }`}
                                                >
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                                        isPassed 
                                                            ? 'bg-emerald-600 text-white shadow-xs' 
                                                            : isCurrent 
                                                            ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-md scale-105' 
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`font-bold text-xs leading-tight ${
                                                            isCurrent ? 'text-primary-900 font-extrabold' : isPassed ? 'text-gray-900' : 'text-gray-400'
                                                        }`}>
                                                            {step.label}
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight line-clamp-2">
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cancellation Notice Card */}
                        {isCancelled && (
                            <div className="bg-red-50 p-6 sm:p-8 rounded-2xl border border-red-200 text-center space-y-2">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-red-900">Order Has Been Cancelled</h3>
                                <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">
                                    This order is no longer in active production. If you have questions or require a refund, please contact our support desk directly.
                                </p>
                            </div>
                        )}

                        {/* Order Details Summary */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
                            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-5">Order Items & Customizations</h3>
                            <div className="space-y-3.5 divide-y divide-gray-100">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-start pt-3.5 first:pt-0">
                                        <div className="pr-4">
                                            <p className="font-bold text-xs sm:text-sm text-gray-900">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.details?.quantity && `Qty: ${item.details.quantity} • `}
                                                {item.details?.size && `Size: ${item.details.size} • `}
                                                {item.details?.flavor && `Flavor: ${item.details.flavor}`}
                                            </p>
                                            {item.details?.message && (
                                                <p className="text-[11px] text-primary-700 font-medium italic mt-1">
                                                    Inscription: &ldquo;{item.details.message}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-bold text-xs sm:text-sm text-gray-900 shrink-0">{item.price}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center bg-gray-50/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
                                <span className="font-bold text-gray-900 text-sm">Total Price</span>
                                <span className="text-xl sm:text-2xl font-extrabold text-primary-600">{order.totalPrice}</span>
                            </div>
                        </div>

                        {/* Delivery & Recipient Information */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
                            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-4">Delivery & Contact Information</h3>
                            <div className="grid sm:grid-cols-2 gap-6 text-xs text-gray-700">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recipient Destination</p>
                                    <p className="font-semibold text-gray-900">{order.deliveryAddress || 'Pick-up at Bakery'}</p>
                                    {order.deliveryNotes && (
                                        <p className="text-gray-500 text-[11px] mt-1 italic">Notes: {order.deliveryNotes}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Contact</p>
                                    <p className="font-semibold text-gray-900">{order.customerName || order.name || 'Customer'}</p>
                                    <p className="text-gray-500 text-[11px] mt-0.5">{order.customerPhone || order.phoneNumber || order.phone || 'Phone on file'}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-800">Track Your Sweet Treats</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                            Enter your order tracking number above (e.g. GN-202611-1001) to view real-time progress and bakery status.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
