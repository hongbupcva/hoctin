import React from 'react';

interface HBLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
  subtitle?: string;
  className?: string;
}

export const HBLogo: React.FC<HBLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'dark',
  subtitle = 'Nền tảng Tin học 10, 11, 12 · KNTT',
  className = '',
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { box: 32, icon: 'w-8 h-8', title: 'text-base', sub: 'text-[10px]', badge: 'text-[9px] px-1' },
    md: { box: 40, icon: 'w-10 h-10', title: 'text-lg', sub: 'text-[11px]', badge: 'text-[10px] px-1.5' },
    lg: { box: 48, icon: 'w-12 h-12', title: 'text-xl', sub: 'text-xs', badge: 'text-[10px] px-2' },
    xl: { box: 64, icon: 'w-16 h-16', title: 'text-2xl', sub: 'text-sm', badge: 'text-xs px-2.5' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern High-Tech Monogram Badge */}
      <div className={`relative ${dimensions.icon} shrink-0 group`}>
        {/* Ambient Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-600 rounded-xl opacity-70 blur-[3px] group-hover:opacity-100 transition duration-300" />
        
        {/* Core Monogram Container */}
        <div className="relative w-full h-full rounded-xl bg-slate-950 p-[1.5px] overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow"
          >
            <defs>
              {/* Inner tech background gradient */}
              <linearGradient id="hb-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="50%" stopColor="#111827" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* High-tech Vibrant Cyan-to-Indigo Gradient for Letters */}
              <linearGradient id="hb-letter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#60a5fa" />
                <stop offset="80%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>

              {/* Accent cyber glow */}
              <linearGradient id="hb-neon-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Subtle squircle inner plate */}
            <rect width="64" height="64" rx="14" fill="url(#hb-bg-grad)" />

            {/* Geometric tech grid lines in background */}
            <line x1="8" y1="20" x2="56" y2="20" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
            <line x1="8" y1="44" x2="56" y2="44" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
            <line x1="24" y1="8" x2="24" y2="56" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
            <line x1="42" y1="8" x2="42" y2="56" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

            {/* Monogram Letters "H" and "B" crafted as unified geometric glyphs */}
            {/* Letter H: Left vertical stem */}
            <rect x="13" y="16" width="6" height="32" rx="2.5" fill="url(#hb-letter-grad)" />

            {/* Letter H: Crossbar linking into B */}
            <rect x="16" y="29.5" width="13" height="5" rx="1.5" fill="url(#hb-letter-grad)" />

            {/* Letter H right stem / B backbone (Shared) */}
            <rect x="26" y="16" width="6" height="32" rx="2.5" fill="url(#hb-letter-grad)" />

            {/* Letter B: Upper Bow */}
            <path
              d="M29 16 H41.5 C46.2 16 49.5 19.3 49.5 24 C49.5 28.7 46.2 32 41.5 32 H29 V16 Z"
              fill="url(#hb-letter-grad)"
            />
            {/* Letter B: Upper Bow Cutout */}
            <path
              d="M32 20.8 H41 C43.2 20.8 44.8 22.2 44.8 24 C44.8 25.8 43.2 27.2 41 27.2 H32 V20.8 Z"
              fill="#0d1424"
            />

            {/* Letter B: Lower Bow */}
            <path
              d="M29 30 H43.5 C48.5 30 52 33.5 52 38.8 C52 44.1 48.5 48 43.5 48 H29 V30 Z"
              fill="url(#hb-letter-grad)"
            />
            {/* Letter B: Lower Bow Cutout */}
            <path
              d="M32 34.8 H42.8 C45.3 34.8 47.2 36.5 47.2 39 C47.2 41.5 45.3 43.2 42.8 43.2 H32 V34.8 Z"
              fill="#0d1424"
            />

            {/* High-tech Cyber Spark Nodes */}
            <circle cx="13" cy="16" r="1.8" fill="#38bdf8" />
            <circle cx="13" cy="48" r="1.8" fill="#38bdf8" />
            <circle cx="49.5" cy="24" r="1.5" fill="#c084fc" />
            <circle cx="52" cy="38.8" r="1.5" fill="#38bdf8" />
            
            {/* Digital circuit indicator node at top-right */}
            <circle cx="53" cy="11" r="2.2" fill="#06b6d4" />
            <line x1="47" y1="11" x2="51" y2="11" stroke="#06b6d4" strokeWidth="1" />
          </svg>
        </div>

        {/* Live system pulse dot */}
        <span 
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" 
          title="HB Informatics Online" 
        />
      </div>

      {/* Typography & Brand Name */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`${dimensions.title} font-extrabold tracking-tight font-sans text-slate-900 leading-none flex items-center`}>
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent font-black tracking-tight mr-1.5">
                HB
              </span>
              <span>EduTin</span>
            </span>

            <span className={`${dimensions.badge} font-mono font-bold py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md tracking-wider shadow-2xs`}>
              THPT
            </span>

            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200/70 rounded-md hidden sm:inline-block">
              KNTT
            </span>
          </div>

          {subtitle && (
            <p className={`${dimensions.sub} text-slate-500 font-medium tracking-tight mt-1 line-clamp-1`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
