import React from 'react';

interface LogoProps {
  className?: string;
  classNameText?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'color';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  classNameText = "",
  showText = true,
  variant = 'color' 
}) => {
  // Dynamic colors based on variant
  const primaryColor = variant === 'light' ? 'white' : '#C25F30'; // Clay
  const secondaryColor = variant === 'light' ? 'white' : '#8F4A91'; // Plum
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-darkest';
  const subTextColor = variant === 'light' ? 'text-white/70' : 'text-brand-clay';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icon: Abstract Sprouting M */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${className} transition-transform duration-500 hover:rotate-6`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none"
      >
        <circle cx="50" cy="50" r="48" stroke={secondaryColor} strokeWidth="1.5" opacity={variant === 'light' ? "0.3" : "0.1"} />
        
        {/* Left Leaf/Arch */}
        <path 
          d="M50 80 C 50 80, 20 80, 20 50 C 20 25, 45 25, 50 50" 
          stroke={primaryColor} 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Right Leaf/Arch */}
        <path 
          d="M50 80 C 50 80, 80 80, 80 50 C 80 25, 55 25, 50 50" 
          stroke={secondaryColor} 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />

        {/* Central Sprout Leaf */}
        <path 
          d="M50 50 Q 50 20 65 25 Q 65 40 50 50" 
          fill={primaryColor} 
          opacity="0.8"
        />
      </svg>

      {/* Text Brand */}
      {showText && (
        <div className={`flex flex-col justify-center ${classNameText}`}>
          <span className={`font-serif font-bold text-xl md:text-2xl leading-none tracking-tight ${textColor}`}>
            Montessori
          </span>
          <span className={`font-sans text-[0.6rem] uppercase tracking-[0.25em] font-bold ${subTextColor}`}>
            Milestones
          </span>
        </div>
      )}
    </div>
  );
};