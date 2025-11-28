import React from 'react';
import { AffiliateProduct } from '../types';
import { ShoppingBag } from 'lucide-react';
import { Button } from './Button';

interface ProductCardProps {
  product: AffiliateProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-brand-paper flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        {product.badge && (
          <span className="absolute top-4 left-4 bg-brand-plum text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-widest">
            {product.badge}
          </span>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-xl font-bold text-brand-darkest">{product.name}</h3>
            <span className="font-sans text-brand-wine font-bold">{product.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
          {product.description}
        </p>
        <Button variant="primary" className="w-full gap-2 text-sm">
          <ShoppingBag size={18} />
          View Details
        </Button>
      </div>
    </div>
  );
};