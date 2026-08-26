import React from 'react';

export const Skeleton = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-deep-navy/50 backdrop-blur-sm pointer-events-none animate-in fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-cyan-bright border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-bright font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Sector...</p>
      </div>
    </div>
  );
};
