import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface FeaturedPostCarouselProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
}

export const FeaturedPostCarousel: React.FC<FeaturedPostCarouselProps> = ({ posts, onReadPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [posts.length, isPaused]);

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));

  return (
    <div 
      className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl group border border-brand-paper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Transition */}
      <div 
        key={currentPost.id}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out animate-fade-in"
        style={{ 
          backgroundImage: `url(${currentPost.images[0]})`,
          transform: 'scale(1.05)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darkest/90 via-brand-darkest/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darkest via-transparent to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl z-10">
        <div className="animate-fade-in-up">
           <div className="flex items-center gap-3 mb-6">
             <span className="bg-brand-clay text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               {currentPost.category}
             </span>
             <span className="text-white/60 text-sm font-sans tracking-wide border-l border-white/20 pl-3">
               {currentPost.date}
             </span>
           </div>
           
           <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
             {currentPost.title}
           </h2>
           
           <p className="text-lg md:text-xl text-brand-paper/90 mb-10 max-w-xl leading-relaxed font-light">
             {currentPost.excerpt}
           </p>

           <Button 
             variant="primary" 
             size="lg" 
             onClick={() => onReadPost(currentPost)}
             className="shadow-lg shadow-brand-clay/30"
           >
             Read Article <ArrowRight size={20} className="ml-2" />
           </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-brand-darkest p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-brand-darkest p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-8 md:left-20 flex gap-3 z-20">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              currentIndex === idx 
                ? 'w-12 bg-brand-clay' 
                : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
