import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Search, Package, Clock, CheckCircle, Truck, Utensils } from 'lucide-react';
import { calculateOrderStatus } from '../utils/statusUtils';

const TrackOrder = () => {
    const { orderNumber: urlOrderNumber } = useParams();
    const navigate = useNavigate();
    const [searchNumber, setSearchNumber] = useState(urlOrderNumber || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(!!urlOrderNumber);
    const [error, setError] = useState('');

    const statusSteps = [
        { status: 'Received', icon: Clock, label: 'Order Received', desc: 'We have received your request.' },
        { status: 'Baking', icon: Utensils, label: 'Baking', desc: 'Our bakers are working on your treats.' },
        { status: 'Decorating', icon: Package, label: 'Decorating', desc: 'Adding the final artistic touches.' },
        { status: 'Ready', icon: Truck, label: 'Ready', desc: 'Packaged and ready for transport.' },
        { status: 'Delivered', icon: CheckCircle, label: 'Delivered', desc: 'Enjoy your GoodNews treats!' }
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
                    setError('Order not found. Please check the number and try again.');
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

    const getCurrentStatusIndex = () => {
        if (!order) return -1;
        const currentStatus = calculateOrderStatus(order);
        return statusSteps.findIndex(step => step.status === currentStatus);
    };

    return (
        <div className="min-h-screen pt-24 bg-gray-50 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order number to see the real-time status of your sweet treats.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchNumber}
                                onChange={(e) => setSearchNumber(e.target.value)}
                                placeholder="e.g. GN-123456"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                            />
                        </div>
                        <button type="submit" className="btn-primary px-8 rounded-xl font-semibold">
                            Track
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Checking status...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center max-w-xl mx-auto">
                        <p>{error}</p>
                    </div>
                ) : order ? (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Order Header */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">Order Found</span>
                                <h2 className="text-2xl font-bold text-gray-900 mt-1">{order.orderNumber}</h2>
                                <p className="text-gray-500">{order.orderDate} at {order.orderTime}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                <p className="text-2xl font-bold text-gray-900">{order.totalPrice}</p>
                            </div>
                        </div>

                        {/* Visual Tracker */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-8">Live Status</h3>
                            
                            <div className="relative">
                                {/* Connector Line */}
                                <div className="absolute left-6 md:left-0 md:top-6 md:w-full h-full md:h-0.5 bg-gray-200 z-0">
                                    <div 
                                        className="bg-primary-500 h-full md:h-full transition-all duration-1000"
                                        style={{ 
                                            height: window.innerWidth < 768 ? `${(getCurrentStatusIndex() / (statusSteps.length - 1)) * 100}%` : '100%',
                                            width: window.innerWidth >= 768 ? `${(getCurrentStatusIndex() / (statusSteps.length - 1)) * 100}%` : '100%'
                                        }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                                    {statusSteps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive = index <= getCurrentStatusIndex();
                                        const isCurrent = index === getCurrentStatusIndex();

                                        return (
                                            <div key={step.status} className="flex md:flex-col items-center gap-4 md:text-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                    isActive ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-200' : 'bg-gray-100 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                    <p className="text-xs text-gray-500 hidden md:block mt-1">{step.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details Summary */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                            <div className="space-y-4">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.details.quantity && `${item.details.quantity} • `}
                                                {item.details.flavor || item.details.size}
                                            </p>
                                        </div>
                                        <p className="font-medium text-gray-900">{item.price}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-8 rounded-b-2xl">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-primary-600">{order.totalPrice}</span>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
                            <div className="grid md:grid-cols-2 gap-8 text-gray-600">
                                <div>
                                    <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Address</p>
                                    <p className="text-gray-900">{order.deliveryAddress}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Schedule</p>
                                    <p className="text-gray-900">{order.eventDate} at {order.deliveryTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500">Search for your order to view live updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
