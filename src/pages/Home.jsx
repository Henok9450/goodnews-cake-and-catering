import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Star, Truck, Shield, Heart, Sparkles } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const features = [
    {
      icon: Cake,
      title: 'Handcrafted Quality',
      description: 'Each cake is baked fresh with premium ingredients and artistic craftsmanship.'
    },
    {
      icon: Star,
      title: 'Custom Designs',
      description: 'Personalize your cake with unique designs, flavors, and messages.'
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Fresh delivery to your doorstep with careful handling guaranteed.'
    },
    {
      icon: Shield,
      title: '100% Satisfaction',
      description: 'We guarantee you\'ll love your cake or we\'ll make it right.'
    }
  ];

  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

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
      // Filter for approved and grab top 3
      const approved = reviewsData.filter(r => r.status === 'approved').slice(0, 3);
      
      // If no live reviews yet, fallback to one static positive review for aesthetics
      if (approved.length === 0) {
          setFeaturedReviews([{
              id: 'placeholder',
              userName: "Sarah Johnson",
              rating: 5,
              comment: "The birthday cake I ordered was absolutely stunning! Not only did it look beautiful, but it tasted amazing. Moist, rich, and perfect sweetness.",
              userId: "verified",
              dateDisplay: "October 15, 2023"
          }]);
      } else {
          setFeaturedReviews(approved);
      }
      setLoadingReviews(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-50 via-white to-primary-50 py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary-200 bg-white shadow-sm text-primary-700 font-bold uppercase tracking-widest text-xs"
              >
                <Sparkles className="h-4 w-4 text-primary-500" />
                Where Every Bite Brings Joy
                <Sparkles className="h-4 w-4 text-primary-500" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Celebrate Life's{' '}
              <span className="text-gradient">Sweet Moments</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Handcrafted cakes for every occasion. From birthdays to weddings,
              we bake happiness into every slice. Because every good news deserves a sweet celebration!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/gallery" className="btn-primary text-lg px-8 py-4">
                View Our Gallery
              </Link>
              <Link to="/custom-order" className="btn-secondary text-lg px-8 py-4">
                Start Custom Order
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GoodNews Cake?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine traditional baking techniques with creative designs to deliver
              exceptional cakes that taste as good as they look.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 card"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sweet Words From Our Customers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - here's what our happy customers have to say about their GoodNews Cake experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReviews.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Rating Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(parseInt(testimonial.rating) || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-center mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-dark-100 rounded-full flex items-center justify-center text-xl overflow-hidden font-bold">
                    {testimonial.userPhoto ? (
                       <img src={testimonial.userPhoto} alt={testimonial.userName} className="w-full h-full object-cover" />
                    ) : (
                       testimonial.userName ? testimonial.userName.charAt(0).toUpperCase() : 'G'
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {testimonial.userName}
                      {testimonial.userId && <span className="text-primary-600" title="Verified Customer">✓</span>}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.userId ? "Verified Customer" : "Guest"}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{testimonial.dateDisplay}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                <div className="text-gray-600">Events Catered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600">Wedding Cakes</div>
              </div>
            </div>
          </motion.div>

          {/* CTA for Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Share your own GoodNews Cake experience!</p>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              <Star className="h-5 w-5" />
              Write a Review
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Spread Some Sweet Joy?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Start your custom cake order today and make someone's day extra special!
            </p>
            <Link
              to="/custom-order"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Your Order
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
