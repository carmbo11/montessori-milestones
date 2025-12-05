import React from 'react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

export const ShopPage: React.FC = () => {
  const products = PRODUCTS;

  return (
    <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-plum font-bold tracking-widest uppercase text-sm mb-4 block">The Shop</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-darkest mb-6">Curated Essentials</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          We only recommend what we use. High-quality, open-ended materials that respect the child's intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-20 bg-brand-deep text-brand-paper p-12 rounded-2xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-serif mb-4">Not sure where to start?</h3>
          <p className="mb-8 max-w-xl mx-auto opacity-90">Ask Maria, our AI guide, for personalized recommendations based on your child's age and interests.</p>
          <Button variant="secondary" onClick={() => document.getElementById('montessori-bot-trigger')?.click()}>Chat with Maria</Button>

          {/* Quick Developmental Match Suggestions */}
          <div className="mt-12 pt-12 border-t border-white/10 text-left">
            <h4 className="text-center font-serif text-2xl mb-8 text-brand-clay">Quick Developmental Match</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* 0-12 Weeks */}
              <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">0-12 Weeks</div>
                <h5 className="font-serif font-bold text-lg mb-2">The Newborn Stage</h5>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  High-contrast images and sensory play to build new brain connections.
                </p>
                <a href="https://lovevery.com/products/the-looker-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                  Shop The Looker Kit
                </a>
              </div>

              {/* 7-8 Months */}
              <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">7-8 Months</div>
                <h5 className="font-serif font-bold text-lg mb-2">The Sitter Stage</h5>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  Texture exploration and object permanence ("Where did it go?").
                </p>
                <a href="https://lovevery.com/products/the-inspector-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                  Shop The Inspector Kit
                </a>
              </div>

              {/* 13-15 Months */}
              <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">13-15 Months</div>
                <h5 className="font-serif font-bold text-lg mb-2">The Toddler Stage</h5>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  Cause and effect, balance, and opening/closing (posting).
                </p>
                <a href="https://lovevery.com/products/the-babbler-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                  Shop The Babbler Kit
                </a>
              </div>

              {/* 19-21 Months */}
              <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">19-21 Months</div>
                <h5 className="font-serif font-bold text-lg mb-2">The Realist Stage</h5>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  Practical life skills, pouring, and precise hand control.
                </p>
                <a href="https://lovevery.com/products/the-realist-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                  Shop The Realist Kit
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
