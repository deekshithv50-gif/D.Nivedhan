import React from 'react';

interface TerraLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export const TerraLogo: React.FC<TerraLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Minimalist Food & Vegetable SVG Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle glowing circular organic emblem base */}
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Golden Wheat Stalk (Minimalist curve on right) */}
          <path
            d="M44 48C42 38 38 28 35 20"
            stroke="#F59E0B"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <ellipse cx="41" cy="24" rx="2.4" ry="4" transform="rotate(30 41 24)" fill="#FBBF24" />
          <ellipse cx="44" cy="31" rx="2.4" ry="4.2" transform="rotate(40 44 31)" fill="#F59E0B" />
          <ellipse cx="46" cy="39" rx="2.2" ry="3.8" transform="rotate(35 46 39)" fill="#D97706" />

          {/* Heirloom Tomato (Vibrant red & crimson curve on bottom-left) */}
          <path
            d="M20 44C16 38 18 29 25 27C27 26.5 31 27 34 29C37 32 37 42 31 46C26 49 22 47 20 44Z"
            fill="url(#tomatoGradient)"
          />
          {/* Tomato star calyx / stem */}
          <path
            d="M26 27L24 23M26 27L27 22M26 27L30 24"
            stroke="#15803D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Crisp Orange Carrot (Minimalist diagonal wedge with leaf plumes) */}
          <path
            d="M37 19L27 49C26.5 50.5 28.5 51.5 29.5 50L43 25C44 23 41 18 37 19Z"
            fill="url(#carrotGradient)"
          />
          {/* Carrot subtle texture ridges */}
          <path d="M33 30L36 32" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M31 38L34 40" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" />

          {/* Carrot leafy emerald greens */}
          <path
            d="M39 19C40 14 43 11 47 11C47 15 44 18 40 20Z"
            fill="#10B981"
          />
          <path
            d="M37 18C36 13 33 10 30 10C31 14 34 17 38 19Z"
            fill="#059669"
          />
          <path
            d="M38 18C38 12 39 8 41 8C41 12 40 15 38 18Z"
            fill="#34D399"
          />

          {/* Fresh Organic Basil / Salad Leaf (Front center accent) */}
          <path
            d="M23 37C23 31 29 28 35 29C35 37 29 42 23 37Z"
            fill="url(#leafGradient)"
            opacity="0.95"
          />
          <path
            d="M24 37C28 35 31 33 34 30"
            stroke="#047857"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Modern Gradients */}
          <defs>
            <linearGradient id="tomatoGradient" x1="18" y1="26" x2="35" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="0.5" stopColor="#E11D48" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="carrotGradient" x1="43" y1="18" x2="27" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB923C" />
              <stop offset="0.6" stopColor="#F97316" />
              <stop offset="1" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="leafGradient" x1="23" y1="28" x2="35" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className={`font-display font-bold tracking-tight text-stone-900 ${text}`}>
              Terra<span className="text-emerald-700">Harvest</span>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          {variant === 'full' && (
            <span className={`font-mono uppercase tracking-wider text-stone-600 font-semibold ${sub}`}>
              Local Food & Produce Portal
            </span>
          )}
        </div>
      )}
    </div>
  );
};
