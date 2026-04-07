import React from 'react';
import { Cake, Heart, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 font-display">About GoodNews Cake</h1>
        <p className="text-xl text-primary-600 text-center font-medium italic mb-12">"Where Every Bite Brings Joy"</p>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center card p-6">
              <img 
    src="/images/logo/logo3.png"
    alt="GoodNews Cake Logo"
    class="h-12 w-12 mx-auto mb-4" 
/> 
              <h3 className="text-xl font-semibold mb-2">Our Passion</h3>
              <p className="text-gray-600">Creating beautiful, delicious cakes that celebrate life's special moments.</p>
            </div>
             
            <div className="text-center card p-6">
              <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" /> 
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">Spread joy and sweetness through exceptional baking and customer service.</p>
            </div>
            
            <div className="text-center card p-6">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Community</h3>
              <p className="text-gray-600">Serving our local community with love and dedication since day one.</p>
            </div>
          </div>
          
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GoodNews Cake started with a simple idea: every piece of good news deserves a sweet celebration. 
              What began as a home bakery has grown into a beloved local business, but our commitment to quality 
              and personal touch remains the same.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that cakes are more than just desserts—they're the centerpiece of memories, the sweet 
              ending to celebrations, and the perfect way to say "I'm thinking of you." That's why we pour our 
              hearts into every cake we create.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
