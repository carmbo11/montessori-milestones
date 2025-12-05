import React from 'react';
import { Button } from '../components/Button';
import { Users, Instagram, Facebook, Mail } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 container mx-auto px-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl bg-white p-12 rounded-3xl shadow-2xl border border-brand-paper animate-fade-in">
        <div className="w-20 h-20 bg-brand-plum/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Users className="text-brand-plum" size={40} />
        </div>
        <h1 className="text-5xl font-serif text-brand-darkest mb-6">Join the Village</h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Parenting wasn't meant to be done alone. Join 1,200+ mindful parents receiving our weekly "Prepared Environment" newsletter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-10">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-clay"
          />
          <Button variant="primary">Subscribe</Button>
        </div>

        <div className="flex justify-center gap-8 text-brand-darkest/60">
          <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Instagram size={20} /> Instagram</a>
          <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Facebook size={20} /> Facebook</a>
          <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Mail size={20} /> Contact</a>
        </div>
      </div>
    </div>
  );
};
