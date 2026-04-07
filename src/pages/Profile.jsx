import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CreditCard, ShoppingBag, LogOut, ChevronRight, MapPin, ExternalLink } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('customerUid', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const ordersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersList);
            } catch (err) {
                console.error("Error fetching order history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 bg-gray-50 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-primary-600" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.displayName || 'Sweet Customer'}</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 transition-colors py-2 border-t mt-4"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <nav className="space-y-1">
                                <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-semibold flex items-center space-x-3">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Order History</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl flex items-center space-x-3">
                                    <MapPin className="w-5 h-5" />
                                    <span>Saved Addresses</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl flex items-center space-x-3">
                                    <Mail className="w-5 h-5" />
                                    <span>Account Support</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content / Order History */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">My Order History</h3>

                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-500">Loading your orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-6 font-medium">You haven't placed any orders yet.</p>
                                    <button 
                                        onClick={() => navigate('/cookies')}
                                        className="btn-primary"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-6 border border-gray-100 rounded-2xl hover:border-primary-200 transition-colors shadow-sm bg-white hover:shadow-md">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <CreditCard className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                order.status === 'Delivered' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-primary-100 text-primary-700'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{order.orderDate} at {order.orderTime}</p>
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-1">{order.orderSummary.split('\n')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col justify-between items-end gap-2">
                                                    <p className="text-xl font-bold text-primary-600">{order.totalPrice}</p>
                                                    <button
                                                        onClick={() => navigate(`/track/${order.orderNumber}`)}
                                                        className="text-sm font-semibold text-gray-900 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                                                    >
                                                        <span>Tracking</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
