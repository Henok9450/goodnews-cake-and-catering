import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Send, User } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const Reviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const formMountedAtRef = useRef(Date.now());
    
    // Form State
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (user && user.displayName) {
            setName(user.displayName);
        }
    }, [user]);

    useEffect(() => {
        const q = query(
            collection(db, 'reviews'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Only show approved reviews to public
            setReviews(reviewsData.filter(r => r.status === 'approved'));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Anti-bot honeypot check
        if (companyUrl) {
            console.warn('Bot review blocked via honeypot');
            await new Promise(resolve => setTimeout(resolve, 800));
            setSubmitSuccess(true);
            setComment('');
            return;
        }

        // 2. Anti-bot rapid submission check (< 1.2s)
        if (Date.now() - formMountedAtRef.current < 1200) {
            setSubmitError("Submission occurred unusually quickly. Please verify your review and submit again.");
            return;
        }

        // 3. Rate limiting (minimum 30 seconds between reviews per session)
        const lastSubmit = sessionStorage.getItem('last_review_submit');
        if (lastSubmit && Date.now() - Number(lastSubmit) < 30000) {
            setSubmitError("Please wait a moment before submitting another review.");
            return;
        }

        const cleanName = String(name || '').replace(/[<>]/g, '').trim().slice(0, 100);
        const cleanComment = String(comment || '').replace(/[<>]/g, '').trim().slice(0, 1000);

        if (!cleanName || !cleanComment) {
            setSubmitError("Please provide both your name and a valid comment.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await addDoc(collection(db, 'reviews'), {
                name: cleanName,
                userName: cleanName,
                userPhoto: user?.photoURL || null,
                userId: user?.uid || null,
                rating: Math.max(1, Math.min(5, Number(rating) || 5)),
                comment: cleanComment,
                status: 'pending', // Requires admin approval
                createdAt: serverTimestamp(),
                dateDisplay: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            });

            sessionStorage.setItem('last_review_submit', Date.now().toString());
            setSubmitSuccess(true);
            setComment('');
            setRating(5);
            // Don't reset name if logged in
            if (!user) setName('');
            
            // Hide success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitError("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 font-display"
                    >
                        Customer Reviews & Testimonials
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Real experiences and feedback from our sweet community in Addis Ababa
                    </motion.p>
                </div>

                {/* Review Submission Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Share Your Experience</h2>
                    
                    {submitSuccess && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-center font-medium">
                            Thank you! Your review has been submitted and is pending approval.
                        </div>
                    )}

                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center font-medium">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Anti-bot honeypot field - invisible to humans */}
                        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                            <label htmlFor="website-url-check">Website</label>
                            <input
                                id="website-url-check"
                                type="text"
                                name="companyUrl"
                                tabIndex="-1"
                                autoComplete="off"
                                value={companyUrl}
                                onChange={(e) => setCompanyUrl(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Rate Your Order</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={36}
                                            className={`${
                                                star <= (hoverRating || rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-200 fill-gray-200"
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="review-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        readOnly={!!user?.displayName}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors ${user?.displayName ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    id="review-comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the taste, design, and service..."
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors resize-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Review
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Reviews Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-500">Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-8 relative hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="absolute top-6 right-8 text-primary-100">
                                    <Quote size={48} className="text-primary-100 opacity-20 transform rotate-180" />
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < review.rating ? "text-yellow-400 fill-yellow-400 cursor-pointer" : "text-gray-200 fill-gray-200 cursor-pointer"}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-6 italic relative z-10 flex-grow leading-relaxed">
                                    "{review.comment}"
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                                            {review.userName}
                                            {review.userId && <span className="text-primary-600 ml-1 text-sm cursor-pointer" title="Verified Customer">✓</span>}
                                        </h3>
                                        <span className="text-sm text-gray-500">{review.dateDisplay}</span>
                                    </div>
                                    <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-dark-100 rounded-full flex items-center justify-center text-primary-700 font-bold overflow-hidden shadow-sm">
                                        {review.userPhoto ? (
                                            <img
                                                src={review.userPhoto}
                                                alt={review.userName}
                                                width="40"
                                                height="40"
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            review.userName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
