import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'gold' | 'monochrome';
  showText?: boolean;
  textClassName?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showText = false,
  textClassName = '',
  className = '',
}) => {
  // Dimension mapping
  const dimensions = {
    xs: { icon: 20, text: 'text-sm' },
    sm: { icon: 26, text: 'text-base' },
    md: { icon: 34, text: 'text-xl' },
    lg: { icon: 42, text: 'text-2xl' },
    xl: { icon: 54, text: 'text-3xl' },
  }[size];

  // Color schemes for the dual-tone bird-leaf symbol
  const colors = {
    default: {
      bird: '#1B3B2B',       // Forest Green
      leaf: '#C5A059',       // Harvest Gold
      accent: '#2A5A41',     // Medium Green
      eye: '#C5A059',        // Gold Eye
      textPrimary: 'text-[#1B3B2B]',
      textAccent: 'text-[#C5A059]',
    },
    light: {
      bird: '#FFFFFF',
      leaf: '#C5A059',
      accent: '#E5E3D8',
      eye: '#C5A059',
      textPrimary: 'text-white',
      textAccent: 'text-[#C5A059]',
    },
    gold: {
      bird: '#C5A059',
      leaf: '#D4B36E',
      accent: '#E5C98A',
      eye: '#11271D',
      textPrimary: 'text-[#C5A059]',
      textAccent: 'text-white',
    },
    monochrome: {
      bird: 'currentColor',
      leaf: 'currentColor',
      accent: 'currentColor',
      eye: '#FFFFFF',
      textPrimary: 'text-current',
      textAccent: 'text-current',
    },
  }[variant];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimalist Bird + Sprout Leaf Geometric Mark */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="BirdGrow Logo"
      >
        {/* Soft protective rounded emblem backdrop */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill={variant === 'light' ? 'rgba(255,255,255,0.1)' : variant === 'gold' ? 'rgba(197,160,89,0.15)' : '#F0EEE5'}
          stroke={variant === 'light' ? 'rgba(255,255,255,0.25)' : variant === 'gold' ? '#C5A059' : '#E2DFD2'}
          strokeWidth="1.5"
        />

        {/* Minimalist Poultry Rooster Comb (3-crown gold crest) */}
        <path
          d="M 38 32 C 38 23, 44 19, 48 24 C 51 18, 58 17, 61 24 C 64 19, 71 21, 71 29 C 71 31, 70 33, 68 34 C 60 32, 46 32, 38 32 Z"
          fill={colors.leaf}
        />

        {/* Rooster Head & Neck Plumage (Clean minimalist silhouette) */}
        <path
          d="M 36 34 C 44 33, 62 33, 68 35 C 72 38, 77 44, 76 50 C 72 52, 67 52, 65 52 C 67 60, 68 68, 64 76 C 54 77, 44 76, 36 68 C 30 60, 32 46, 36 34 Z"
          fill={colors.bird}
        />

        {/* Sleek Golden Poultry Beak */}
        <path
          d="M 76 43 L 88 47 L 76 51 Z"
          fill={colors.leaf}
        />

        {/* Minimalist Golden Wattle */}
        <path
          d="M 72 53 C 75 56, 75 62, 70 64 C 67 62, 67 55, 72 53 Z"
          fill={colors.leaf}
        />

        {/* Modern Geometric Wing Feather Arc */}
        <path
          d="M 44 48 C 50 48, 56 52, 57 59 C 55 67, 48 71, 41 68 C 45 61, 44 54, 44 48 Z"
          fill={colors.leaf}
          opacity="0.9"
        />

        {/* Keen Poultry Eye Accent */}
        <circle cx="63" cy="42" r="3" fill={colors.eye} />
        <circle cx="64" cy="41" r="1" fill="#FFFFFF" />
      </svg>

      {/* Optional Wordmark */}
      {showText && (
        <span className={`font-bold tracking-tight ${dimensions.text} ${textClassName}`}>
          <span className={colors.textPrimary}>Bird</span>
          <span className={colors.textAccent}>Grow</span>
        </span>
      )}
    </div>
  );
};
