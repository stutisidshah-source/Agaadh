import React, { useState } from 'react';

interface Ocean3DBackgroundProps {
  interactive?: boolean;
}

export const Ocean3DBackground: React.FC<Ocean3DBackgroundProps> = ({ interactive = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Sketchfab model ID b09ad71350bb4fb7b6e0aec6470b5a3b (Anchor on a sea floor | Greece) with clean parameters
  const sketchfabSrc = 
    'https://sketchfab.com/models/b09ad71350bb4fb7b6e0aec6470b5a3b/embed' +
    '?autostart=1' +
    '&preload=1' +
    '&ui_infos=0' +
    '&ui_controls=0' +
    '&ui_watermark=0' +
    '&ui_hint=0' +
    '&ui_help=0' +
    '&ui_settings=0' +
    '&ui_inspector=0' +
    '&ui_stop=0' +
    '&ui_ar=0' +
    '&ui_vr=0' +
    '&ui_annotations=0' +
    '&ui_general_controls=0' +
    '&autospin=0.03' +
    '&scrollwheel=0' +
    '&transparent=1' +
    '&dnt=1';

  return (
    <div 
      className="fixed inset-0 z-[0] overflow-hidden select-none bg-[#021827] pointer-events-none"
      style={{ 
        contain: 'strict', 
        transform: 'translateZ(0)', 
        willChange: 'transform',
        isolation: 'isolate'
      }}
    >
      {/* Light subtle pulse while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm transition-opacity duration-700">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-300/30 border-t-cyan-300 animate-spin" />
            <span className="text-xs font-mono text-cyan-200 tracking-widest uppercase drop-shadow">
              Loading 3D Seabed Environment...
            </span>
          </div>
        </div>
      )}

      {/* 3D Underwater Viewport - isolated GPU layer */}
      <div 
        className={`absolute w-[108vw] h-[calc(108vh+80px)] -left-[4vw] -top-[4vh] transition-opacity duration-1000 ease-out overflow-hidden ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <iframe
          title="Anchor on a see floor | Greece"
          src={sketchfabSrc}
          className="w-full h-full border-0 scale-[1.02]"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="eager"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Right-Side Horizon Blend - Blends out the white background void into deep ocean depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(2, 24, 38, 0.95) 0%, rgba(3, 45, 65, 0.78) 18%, rgba(5, 70, 92, 0.4) 40%, transparent 70%)',
        }}
      />

      {/* Top Sea-Surface Oceanic Water Column Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(2, 28, 44, 0.85) 0%, rgba(4, 58, 80, 0.55) 24%, rgba(6, 80, 102, 0.22) 55%, rgba(2, 20, 36, 0.4) 100%)',
        }}
      />

      {/* Oceanic Sunbeam Glow from Sea Surface (optimized alpha without costly mix-blend-mode repaint) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(56, 189, 248, 0.18) 0%, rgba(14, 116, 144, 0.08) 50%, transparent 80%)',
        }}
      />

      {/* Bottom Vignette Layer */}
      <div 
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(2, 20, 32, 0.85) 0%, rgba(2, 20, 32, 0.4) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
