import React from 'react';

interface TruckLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const TruckLogo: React.FC<TruckLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeMap[size]} rounded-2xl overflow-hidden shadow-md group shrink-0 border border-blue-400/30`}>
        {/* Modern Animated Gradient Background */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
          }}
        />

        {/* Vector Semi-Trailer Truck Icon with Motion Loop */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/4 h-3/4 drop-shadow-sm"
          >
            {/* Motion Loop Streak */}
            <path
              d="M10 34C6 28 8 18 16 12C24 6 38 8 42 16C46 24 38 34 28 36"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            {/* Cargo Box */}
            <rect
              x="6"
              y="16"
              width="22"
              height="14"
              rx="2"
              fill="white"
              fillOpacity="0.9"
            />
            {/* Cargo Stripes */}
            <path d="M12 20L18 20" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 25L22 25" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />

            {/* Truck Cabin Head */}
            <path
              d="M28 20H36L40 25V30H28V20Z"
              fill="white"
            />
            {/* Cabin Windshield */}
            <path
              d="M31 22H35L38 25H31V22Z"
              fill="#2563EB"
            />

            {/* Heavy Wheels */}
            <circle cx="12" cy="31" r="3.5" fill="#0F172A" stroke="white" strokeWidth="1.5" />
            <circle cx="22" cy="31" r="3.5" fill="#0F172A" stroke="white" strokeWidth="1.5" />
            <circle cx="34" cy="31" r="3.5" fill="#0F172A" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Cargo<span className="text-blue-600 dark:text-indigo-400">Loop</span>
          </span>
          <span className="block text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider -mt-1">
            AI Logistics
          </span>
        </div>
      )}
    </div>
  );
};
