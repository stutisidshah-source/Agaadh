import { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';
import { Ocean3DBackground } from './Ocean3DBackground';

export const RootLayout = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showGuideTooltip, setShowGuideTooltip] = useState(false);

  // Initialize Lenis buttery-smooth momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const prefetchRoute = (route: string) => {
    if (route === '/explorer') import('../../pages/Explorer');
    if (route === '/analysis') import('../../pages/Analysis');
  };

  // Guide explanations based on route
  const getGuideText = () => {
    switch(location.pathname) {
      case '/': return "Upload your eDNA sample sequences here for primary analysis.";
      case '/explorer': return "Navigate the global map to view interconnected biomes.";
      case '/analysis': return "Review deep diagnostic metrics and species divergence.";
      default: return "Awaiting input...";
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* 3D HDRI Underwater Ocean Background */}
      <Ocean3DBackground />

      {/* Guide Fish Floating Action Button (Bottom Right) */}
      <div className="fixed right-6 bottom-6 z-[20] flex flex-col items-end gap-2">
        {showGuideTooltip && (
          <div 
            className="mb-3 p-4 glass-panel rounded-2xl max-w-[240px] text-xs text-white animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-2xl border border-cyan-400/30 select-none"
            style={{ userSelect: 'none' }}
            aria-live="polite"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 uppercase mb-1 font-semibold">
              <span>●</span> Subsystem Assistant
            </div>
            <p className="leading-relaxed text-white/90 font-light">{getGuideText()}</p>
          </div>
        )}

        <button 
          onClick={() => setShowGuideTooltip(!showGuideTooltip)}
          className="w-12 h-12 rounded-full glass-panel border border-cyan-400/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(77,238,233,0.35)] hover:shadow-[0_0_25px_rgba(77,238,233,0.6)] hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 select-none"
          title="Toggle Subsystem Assistant"
          aria-label="Toggle Subsystem Assistant"
        >
          {/* Vector Fish Icon */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none text-cyan-300">
            <path d="M12 4C7.5 4 3.5 7.5 2 12C3.5 16.5 7.5 20 12 20C16.5 20 20.5 16.5 22 12C20.5 7.5 16.5 4 12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(103, 232, 249, 0.15)"/>
            <path d="M12 8C10.5 9.5 9.5 11 9.5 12C9.5 13 10.5 14.5 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M17 12H17.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M2 12L0.5 9M2 12L0.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Navigation Hamburger & Drawer */}
      <div className="fixed top-6 left-6 z-[30]">
        <button 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-3.5 glass-panel rounded-2xl text-white hover:text-cyan-200 transition-all shadow-2xl border border-white/25 hover:border-cyan-300/60"
          aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={drawerOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        
        {drawerOpen && (
          <div className="absolute top-16 left-0 w-72 glass-panel-glow rounded-3xl p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4 duration-300 shadow-2xl border border-white/30">
            <NavLink 
              to="/" 
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) => `px-5 py-3.5 rounded-2xl transition-all font-display font-medium text-base ${isActive ? 'bg-cyan-400/25 text-white border border-cyan-300 shadow-[0_0_15px_rgba(77,238,233,0.3)]' : 'text-white/80 hover:text-white hover:bg-white/15'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/explorer" 
              onClick={() => setDrawerOpen(false)}
              onMouseEnter={() => prefetchRoute('/explorer')}
              onFocus={() => prefetchRoute('/explorer')}
              className={({ isActive }) => `px-5 py-3.5 rounded-2xl transition-all font-display font-medium text-base ${isActive ? 'bg-cyan-400/25 text-white border border-cyan-300 shadow-[0_0_15px_rgba(77,238,233,0.3)]' : 'text-white/80 hover:text-white hover:bg-white/15'}`}
            >
              Explorer
            </NavLink>
            <NavLink 
              to="/analysis" 
              onClick={() => setDrawerOpen(false)}
              onMouseEnter={() => prefetchRoute('/analysis')}
              onFocus={() => prefetchRoute('/analysis')}
              className={({ isActive }) => `px-5 py-3.5 rounded-2xl transition-all font-display font-medium text-base ${isActive ? 'bg-cyan-400/25 text-white border border-cyan-300 shadow-[0_0_15px_rgba(77,238,233,0.3)]' : 'text-white/80 hover:text-white hover:bg-white/15'}`}
            >
              Analysis
            </NavLink>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main 
        className="relative z-10 pt-12 pb-16 flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', isolation: 'isolate' }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div>
            <Suspense fallback={<Skeleton />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};
