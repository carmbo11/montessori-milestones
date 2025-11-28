import React from 'react';
import { Button } from './Button';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      
      {/* Top Bar: Title */}
      <div className="bg-[#9FBEC3] py-12 md:py-16 text-center px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-darkest tracking-tight leading-none drop-shadow-sm">
          Montessori <span className="italic font-light">milestones</span>
        </h1>
        {/* Decorative faint text often seen in editorial layouts */}
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-brand-darkest/30 font-sans">
          Est. 2024 • Education • Nature
        </p>
      </div>

      {/* Middle: The Image */}
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-[3s] ease-out group-hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop")',
            backgroundPosition: 'center 40%' 
          }}
        ></div>
      </div>

      {/* Bottom Bar: Subtitle & Actions */}
      <div className="bg-[#9FBEC3] py-6 px-6 text-center relative">
        <h2 className="text-3xl md:text-4xl font-serif text-brand-darkest mb-4 italic">
          Nurturing Growth in being you!
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => onNavigate('philosophy')}
            className="shadow-xl"
          >
            Read the Journal
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-brand-darkest text-brand-darkest hover:bg-brand-darkest hover:text-white"
            onClick={() => onNavigate('shop')}
          >
            Shop Essentials
          </Button>
        </div>

        {/* Watermark/Copyright similar to reference */}
        <div className="absolute bottom-4 right-6 text-brand-darkest/40 font-serif text-sm">
          © 2024
        </div>
      </div>
    </div>
  );
};