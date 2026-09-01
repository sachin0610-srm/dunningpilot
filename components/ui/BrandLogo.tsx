import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  iconOnly = false,
  showTagline = false,
  className = ''
}: BrandLogoProps) {
  // Dimensions based on size
  const iconDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 46, h: 46 },
    xl: { w: 60, h: 60 }
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }[size];

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Stylized D Logo SVG with Paper Flight Arrow & Speed Lines */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_10px_rgba(0,229,153,0.3)] transition-transform hover:scale-105"
      >
        <defs>
          {/* Main D Shape Vibrant Emerald-Cyan Gradient */}
          <linearGradient id="dunningGradientMain" x1="15%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="50%" stopColor="#00D287" />
            <stop offset="100%" stopColor="#00A865" />
          </linearGradient>

          {/* Plane / Arrow Gradient with Depth */}
          <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00A865" />
            <stop offset="60%" stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#80FFD2" />
          </linearGradient>

          {/* Speed Lines Gradient */}
          <linearGradient id="speedLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A6588" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7E9EB8" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* 3 Speed Lines on Left */}
        <rect x="2" y="32" width="16" height="5.5" rx="2.75" fill="url(#speedLineGrad)" />
        <rect x="-2" y="47" width="24" height="5.5" rx="2.75" fill="url(#speedLineGrad)" />
        <rect x="4" y="62" width="14" height="5.5" rx="2.75" fill="url(#speedLineGrad)" />

        {/* Outer Stylized "D" Loop */}
        <path
          d="M32 16 H60 C78 16 94 30 94 50 C94 70 78 84 60 84 H32 C26 84 22 79 26 73 L35 59 L26 43 C22 37 26 16 32 16 Z"
          fill="url(#dunningGradientMain)"
        />

        {/* Inner Counter Cutout of the "D" */}
        <path
          d="M48 32 H58 C68 32 76 40 76 50 C76 60 68 68 58 68 H48 L48 32 Z"
          fill="#060c18"
          className="dark:fill-[#080d1a] fill-white transition-colors"
        />

        {/* Dynamic Flight Arrow / Paper Airplane Cutting Through */}
        <path
          d="M28 65 L70 41 L47 55 L38 84 Z"
          fill="url(#arrowGradient)"
        />
        
        {/* Subtle highlight edge on the flight arrow */}
        <path
          d="M70 41 L47 55 L42 62 Z"
          fill="#007A48"
          fillOpacity="0.3"
        />
      </svg>

      {/* Brand Wordmark & Tagline */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className={`font-bold tracking-tight leading-none ${textSizes}`}>
            <span className="text-zinc-900 dark:text-white transition-colors">Dunning</span>
            <span className="text-emerald-500 dark:text-[#00E599]">Pilot</span>
          </div>
          {showTagline && (
            <span className={`font-mono text-zinc-500 dark:text-zinc-400 font-semibold tracking-[0.18em] uppercase mt-1 leading-none ${taglineSizes}`}>
              Recover More. Automate Smarter.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
