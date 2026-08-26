import React from 'react';

export const SwimmingFishes: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* CSS Animation Keyframes for Fish Movement & Tail Wagging */}
      <style>{`
        @keyframes swim-across-1 {
          0% {
            transform: translate(-10vw, 35vh) scale(0.75) scaleX(1);
          }
          48% {
            transform: translate(110vw, 28vh) scale(0.75) scaleX(1);
          }
          50% {
            transform: translate(110vw, 28vh) scale(0.75) scaleX(-1);
          }
          98% {
            transform: translate(-10vw, 38vh) scale(0.75) scaleX(-1);
          }
          100% {
            transform: translate(-10vw, 35vh) scale(0.75) scaleX(1);
          }
        }

        @keyframes swim-across-2 {
          0% {
            transform: translate(110vw, 55vh) scale(0.65) scaleX(-1);
          }
          48% {
            transform: translate(-10vw, 48vh) scale(0.65) scaleX(-1);
          }
          50% {
            transform: translate(-10vw, 48vh) scale(0.65) scaleX(1);
          }
          98% {
            transform: translate(110vw, 52vh) scale(0.65) scaleX(1);
          }
          100% {
            transform: translate(110vw, 55vh) scale(0.65) scaleX(-1);
          }
        }

        @keyframes swim-across-3 {
          0% {
            transform: translate(-15vw, 18vh) scale(0.55) scaleX(1);
          }
          48% {
            transform: translate(115vw, 22vh) scale(0.55) scaleX(1);
          }
          50% {
            transform: translate(115vw, 22vh) scale(0.55) scaleX(-1);
          }
          98% {
            transform: translate(-15vw, 15vh) scale(0.55) scaleX(-1);
          }
          100% {
            transform: translate(-15vw, 18vh) scale(0.55) scaleX(1);
          }
        }

        @keyframes swim-school {
          0% {
            transform: translate(115vw, 32vh) scale(0.4) scaleX(-1);
          }
          100% {
            transform: translate(-20vw, 26vh) scale(0.4) scaleX(-1);
          }
        }

        @keyframes tail-wiggle {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes fin-flutter {
          0%, 100% {
            transform: scaleX(0.8) rotate(5deg);
          }
          50% {
            transform: scaleX(1.1) rotate(-5deg);
          }
        }

        .animate-swim-1 {
          animation: swim-across-1 32s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-swim-2 {
          animation: swim-across-2 26s cubic-bezier(0.4, 0, 0.6, 1) infinite 6s;
        }
        .animate-swim-3 {
          animation: swim-across-3 38s cubic-bezier(0.4, 0, 0.6, 1) infinite 14s;
        }
        .animate-school {
          animation: swim-school 22s linear infinite 4s;
        }
        .animate-tail {
          animation: tail-wiggle 0.35s ease-in-out infinite;
          transform-origin: 20% 50%;
        }
        .animate-fin {
          animation: fin-flutter 0.45s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Fish 1: Vibrant Yellow Tang (Cruises from Left to Right in Upper Midground) */}
      <div className="absolute top-0 left-0 animate-swim-1 drop-shadow-[0_4px_12px_rgba(251,191,36,0.35)] opacity-90">
        <svg width="84" height="60" viewBox="0 0 84 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fish Body */}
          <path d="M12 30C18 12 45 8 62 20C70 26 72 30 72 30C72 30 70 34 62 40C45 52 18 48 12 30Z" fill="url(#yellowTangBody)" />
          {/* Dorsal Fin */}
          <path d="M28 14C35 4 52 6 60 18C48 16 35 15 28 14Z" fill="#F59E0B" className="animate-fin" />
          {/* Ventral Fin */}
          <path d="M30 46C38 56 50 54 58 42C46 44 36 45 30 46Z" fill="#F59E0B" className="animate-fin" />
          {/* Tail Fin */}
          <g className="animate-tail">
            <path d="M14 30L2 16C5 25 5 35 2 44L14 30Z" fill="#FBBF24" />
            <path d="M14 30L0 20C2 27 2 33 0 40L14 30Z" fill="#F59E0B" />
          </g>
          {/* Eye */}
          <circle cx="58" cy="24" r="3.5" fill="#1E293B" />
          <circle cx="59" cy="23" r="1.2" fill="#FFFFFF" />
          {/* Body Stripes / Highlight */}
          <path d="M52 20C48 24 48 36 52 40" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <defs>
            <linearGradient id="yellowTangBody" x1="12" y1="30" x2="72" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.4" stopColor="#FBBF24" />
              <stop offset="0.85" stopColor="#FDE047" />
              <stop offset="1" stopColor="#FEF08A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Fish 2: Coral Butterflyfish / Copperband (Swims across right-to-left) */}
      <div className="absolute top-0 left-0 animate-swim-2 drop-shadow-[0_4px_16px_rgba(249,115,22,0.3)] opacity-85">
        <svg width="76" height="64" viewBox="0 0 76 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <path d="M14 32C22 14 44 12 58 24C68 30 72 32 72 32C72 32 68 34 58 40C44 52 22 50 14 32Z" fill="#FFFFFF" />
          {/* Orange Stripes */}
          <path d="M50 18C44 26 44 38 50 46" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
          <path d="M36 15C30 25 30 39 36 49" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 22C20 28 20 36 24 42" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
          {/* Dorsal Fin with Filament */}
          <path d="M26 16C36 0 54 8 60 22C46 20 34 18 26 16Z" fill="#F97316" />
          <path d="M38 6L40 0" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tail */}
          <g className="animate-tail">
            <path d="M16 32L3 20C6 28 6 36 3 44L16 32Z" fill="#FDBA74" />
          </g>
          {/* Eye with Stripe */}
          <path d="M60 22L62 42" stroke="#475569" strokeWidth="3" opacity="0.6" />
          <circle cx="61" cy="28" r="3" fill="#0F172A" />
          <circle cx="62" cy="27.2" r="1" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Fish 3: Deep-Sea Anthias / Neon Fairy Basslet (Upper Waters) */}
      <div className="absolute top-0 left-0 animate-swim-3 drop-shadow-[0_4px_16px_rgba(236,72,153,0.35)] opacity-80">
        <svg width="68" height="42" viewBox="0 0 68 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gradient Body: Magenta to Violet/Gold */}
          <path d="M10 21C16 9 38 6 52 15C58 19 62 21 62 21C62 21 58 23 52 27C38 36 16 33 10 21Z" fill="url(#anthiasGrad)" />
          {/* Fins */}
          <path d="M24 10C32 2 44 4 50 14C40 12 30 11 24 10Z" fill="#F43F5E" className="animate-fin" />
          <path d="M26 32C34 40 42 38 48 28C38 30 30 31 26 32Z" fill="#8B5CF6" className="animate-fin" />
          {/* Tail */}
          <g className="animate-tail">
            <path d="M12 21L1 10C4 17 4 25 1 32L12 21Z" fill="#F43F5E" />
          </g>
          {/* Eye */}
          <circle cx="53" cy="18" r="2.8" fill="#1E1B4B" />
          <circle cx="54" cy="17.2" r="1" fill="#67E8F9" />
          <defs>
            <linearGradient id="anthiasGrad" x1="10" y1="21" x2="62" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="0.5" stopColor="#EC4899" />
              <stop offset="1" stopColor="#FB7185" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* School of Small Neon Chromis passing in background */}
      <div className="absolute top-0 left-0 animate-school opacity-60 drop-shadow-[0_2px_8px_rgba(103,232,249,0.4)]">
        <div className="relative">
          {/* Fish A */}
          <svg className="absolute -top-4 left-0" width="38" height="20" viewBox="0 0 38 20" fill="none">
            <path d="M6 10C10 4 24 3 32 8C36 10 36 10 36 10C36 10 36 10 32 12C24 17 10 16 6 10Z" fill="#38BDF8" />
            <path d="M7 10L1 4C3 8 3 12 1 16L7 10Z" fill="#0284C7" />
            <circle cx="30" cy="8.5" r="1.5" fill="#0F172A" />
            <circle cx="30.5" cy="8" r="0.5" fill="#FFFFFF" />
          </svg>
          {/* Fish B */}
          <svg className="absolute top-6 left-10" width="34" height="18" viewBox="0 0 38 20" fill="none">
            <path d="M6 10C10 4 24 3 32 8C36 10 36 10 36 10C36 10 36 10 32 12C24 17 10 16 6 10Z" fill="#22D3EE" />
            <path d="M7 10L1 4C3 8 3 12 1 16L7 10Z" fill="#0891B2" />
            <circle cx="30" cy="8.5" r="1.5" fill="#0F172A" />
          </svg>
          {/* Fish C */}
          <svg className="absolute -top-8 left-16" width="36" height="19" viewBox="0 0 38 20" fill="none">
            <path d="M6 10C10 4 24 3 32 8C36 10 36 10 36 10C36 10 36 10 32 12C24 17 10 16 6 10Z" fill="#38BDF8" />
            <path d="M7 10L1 4C3 8 3 12 1 16L7 10Z" fill="#0284C7" />
            <circle cx="30" cy="8.5" r="1.5" fill="#0F172A" />
          </svg>
          {/* Fish D */}
          <svg className="absolute top-12 left-20" width="30" height="16" viewBox="0 0 38 20" fill="none">
            <path d="M6 10C10 4 24 3 32 8C36 10 36 10 36 10C36 10 36 10 32 12C24 17 10 16 6 10Z" fill="#67E8F9" />
            <path d="M7 10L1 4C3 8 3 12 1 16L7 10Z" fill="#06B6D4" />
          </svg>
        </div>
      </div>
    </div>
  );
};
