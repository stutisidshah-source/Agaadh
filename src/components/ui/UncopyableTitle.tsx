import React from 'react';

interface UncopyableTitleProps {
  hindiText?: string;
  englishText: string;
  subText?: string;
  variant?: 'home' | 'page';
}

export const UncopyableTitle: React.FC<UncopyableTitleProps> = ({
  hindiText,
  englishText,
  subText,
  variant = 'page',
}) => {
  if (variant === 'home') {
    return (
      <div 
        className="select-none pointer-events-none flex flex-wrap items-center gap-x-5 gap-y-2 mb-6"
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
        aria-hidden="true"
      >
        <svg 
          className="h-14 md:h-16 w-auto max-w-full" 
          viewBox="0 0 680 70" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Filter definition */}
          <defs>
            <filter id="glow-title" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Hindi Title 'अगाध' */}
          <text
            x="0"
            y="52"
            fontFamily="'Yatra One', cursive, sans-serif"
            fontSize="54"
            fontWeight="bold"
            letterSpacing="6"
            fill="#FFFFFF"
            filter="drop-shadow(0px 4px 12px rgba(0,0,0,0.7))"
          >
            {hindiText || 'अगाध'}
          </text>

          {/* Divider */}
          <line x1="165" y1="18" x2="165" y2="54" stroke="rgba(103, 232, 249, 0.4)" strokeWidth="2.5" strokeLinecap="round" />

          {/* English Title 'AGAADH' */}
          <text
            x="185"
            y="48"
            fontFamily="'Space Grotesk', sans-serif"
            fontSize="32"
            fontWeight="700"
            letterSpacing="7"
            fill="url(#cyanGrad)"
            filter="drop-shadow(0px 2px 8px rgba(103,232,249,0.5))"
          >
            {englishText || 'AGAADH'}
          </text>

          {/* Subtitle Tag */}
          <rect x="365" y="24" width="300" height="28" rx="8" fill="rgba(2, 30, 50, 0.75)" stroke="rgba(103, 232, 249, 0.3)" strokeWidth="1" />
          <text
            x="380"
            y="43"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="11"
            fontWeight="600"
            letterSpacing="1.5"
            fill="#E0F2FE"
          >
            {subText || 'DEEP-SEA eDNA INTELLIGENCE'}
          </text>
        </svg>
      </div>
    );
  }

  // Page Variant (Explorer, Analysis, etc.)
  return (
    <div 
      className="select-none pointer-events-none flex items-center mb-6"
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      aria-hidden="true"
    >
      <svg 
        className="h-12 md:h-14 w-auto max-w-full" 
        viewBox="0 0 540 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pageCyanGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>
        </defs>

        {/* Page Title */}
        <text
          x="0"
          y="44"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="4"
          fill="url(#pageCyanGrad)"
          filter="drop-shadow(0px 3px 10px rgba(0,0,0,0.6))"
        >
          {englishText}
        </text>

        {subText && (
          <>
            <line x1="205" y1="16" x2="205" y2="48" stroke="rgba(103, 232, 249, 0.35)" strokeWidth="2" strokeLinecap="round" />
            <text
              x="225"
              y="38"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="12"
              fontWeight="500"
              letterSpacing="2"
              fill="#93C5FD"
            >
              {subText}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
