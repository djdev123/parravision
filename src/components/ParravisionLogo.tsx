import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export const ParravisionIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <defs>
        {/* Gradients to replicate the beautiful teal to cyan eye shape */}
        <linearGradient id="eyeTealGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#115e59" /> {/* Deep teal */}
          <stop offset="50%" stopColor="#0d9488" /> {/* Medium teal */}
          <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan highlight */}
        </linearGradient>
        
        {/* Shadow filter to give a subtle depth */}
        <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Outer Eye Contour */}
      <path
        d="M 10 50 C 35 15, 125 15, 150 50 C 125 85, 35 85, 10 50 Z"
        fill="url(#eyeTealGradient)"
        filter="url(#subtleShadow)"
      />

      {/* Outer White Iridescent Ring */}
      <circle
        cx="80"
        cy="50"
        r="28"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
      />

      {/* Inner Pupil Backdrop (darker contrast teal) */}
      <circle
        cx="80"
        cy="50"
        r="25.5"
        fill="#083344" /* Deep slate cyan */
        opacity="0.45"
      />

      {/* Network Node Constellation Lines (White, subtle glowing thin segments) */}
      <g stroke="#ffffff" strokeWidth="1.25" opacity="0.85">
        {/* Connecting the nodes */}
        <line x1="68" y1="42" x2="80" y2="35" />
        <line x1="80" y1="35" x2="92" y2="42" />
        <line x1="92" y1="42" x2="92" y2="58" />
        <line x1="92" y1="58" x2="80" y2="65" />
        <line x1="80" y1="65" x2="68" y2="58" />
        <line x1="68" y1="58" x2="68" y2="42" />
        
        {/* Inner spiderweb node links */}
        <line x1="80" y1="50" x2="68" y2="42" />
        <line x1="80" y1="50" x2="80" y2="35" />
        <line x1="80" y1="50" x2="92" y2="42" />
        <line x1="80" y1="50" x2="92" y2="58" />
        <line x1="80" y1="50" x2="80" y2="65" />
        <line x1="80" y1="50" x2="68" y2="58" />

        {/* Cross-constellation link structures */}
        <line x1="68" y1="42" x2="80" y2="65" />
        <line x1="92" y1="42" x2="80" y2="65" />
        <line x1="68" y1="58" x2="80" y2="35" />
        <line x1="92" y1="58" x2="80" y2="35" />
      </g>

      {/* Network Nodes (Dots) */}
      <g fill="#ffffff">
        <circle cx="68" cy="42" r="3.5" />
        <circle cx="80" cy="35" r="3.5" />
        <circle cx="92" cy="42" r="3.5" />
        <circle cx="92" cy="58" r="3.5" />
        <circle cx="80" cy="65" r="3.5" />
        <circle cx="68" cy="58" r="3.5" />
        <circle cx="80" cy="50" r="4.5" /> {/* Center Anchor Node */}
      </g>

      {/* Signature Highlight reflection dot in the upper right - dark teal circle inside */}
      <circle
        cx="90"
        cy="38"
        r="6"
        fill="#0f172a" /* Deep neutral slate black matching logo */
        stroke="#ffffff"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const ParravisionLogo: React.FC<LogoProps> = ({ className = '', size = 'md', withText = true }) => {
  const sizeMap = {
    sm: { iconSize: 32, textClass: 'text-sm' },
    md: { iconSize: 44, textClass: 'text-lg' },
    lg: { iconSize: 60, textClass: 'text-2xl tracking-widest' },
    xl: { iconSize: 110, textClass: 'text-4xl tracking-[0.15em] mt-3' }
  };

  const currentSize = sizeMap[size];

  if (!withText) {
    return <ParravisionIcon size={currentSize.iconSize} className={className} />;
  }

  // Vertical stacked orientation for larger showcase, or horizontal for headers
  if (size === 'xl') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`} id="parravision-vertical-brand-logo">
        <ParravisionIcon size={currentSize.iconSize} className="drop-shadow-md animate-fade-in" />
        <h1 className={`font-sans font-black text-slate-800 leading-none uppercase ${currentSize.textClass}`}>
          PARRAVISION
        </h1>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="parravision-horizontal-brand-logo">
      <ParravisionIcon size={currentSize.iconSize} className="shrink-0 drop-shadow-sm" />
      <h1 className={`font-sans font-black text-slate-800 tracking-tight leading-none uppercase ${currentSize.textClass}`}>
        PARRAVISION
      </h1>
    </div>
  );
};
