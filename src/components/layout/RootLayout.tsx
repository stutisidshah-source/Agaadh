import { useEffect, useRef, useState, Suspense } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Skeleton } from '../ui/Skeleton';

export const RootLayout = () => {
  const tintRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showGuideTooltip, setShowGuideTooltip] = useState(false);
  
  const isHome = location.pathname === '/';
  const rAFRef = useRef<number | null>(null);

  // Mount check log (to verify canvas stays mounted)
  useEffect(() => {
    console.log("RootLayout mounted! persistent background should not unmount.");
    return () => console.log("RootLayout UNMOUNTED! (This should not happen during navigation)");
  }, []);

  // Update DOM directly to bypass React state for high-fps animation
  const updateDepthDOM = (depth: number) => {
    if (tintRef.current) {
      tintRef.current.style.background = `radial-gradient(circle at 50% 120%, rgba(5, 69, 84, ${0.4 + depth * 0.4}), rgba(3, 20, 43, ${0.7 + depth * 0.3}))`;
      tintRef.current.style.backdropFilter = `blur(${depth * 4}px)`;
    }
    if (hudRef.current) {
      hudRef.current.innerText = `${(depth * 4000).toFixed(0)}m`;
    }
  };

  // Scroll logic for Home with rAF throttle using native window scroll
  useEffect(() => {
    if (!isHome) return;
    
    const handleScroll = () => {
      if (rAFRef.current) return;
      rAFRef.current = requestAnimationFrame(() => {
        // use document.documentElement for standard window scroll
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) {
          updateDepthDOM(0);
        } else {
          const depth = window.scrollY / maxScroll;
          updateDepthDOM(depth);
        }
        rAFRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial depth correctly
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
        rAFRef.current = null;
      }
    };
  }, [isHome]);

  const prefetchRoute = (route: string) => {
    if (route === '/explorer') import('../../pages/Explorer');
    if (route === '/analysis') import('../../pages/Analysis');
  };

  // Ambient oscillation for non-Home routes
  useEffect(() => {
    if (isHome) return;
    
    let animationFrame: number;
    let startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      // Gentle sine wave oscillation between 0.4 and 0.6 over 10 seconds
      const ambientDepth = 0.5 + Math.sin(elapsed / 2000) * 0.1;
      updateDepthDOM(ambientDepth);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isHome]);

  // CSS depth-tint overlay style based on depth01
  const initialDepth = isHome ? 0 : 0.5;
  const depthTintStyle = {
    background: `radial-gradient(circle at 50% 120%, rgba(5, 69, 84, ${0.4 + initialDepth * 0.4}), rgba(3, 20, 43, ${0.7 + initialDepth * 0.3}))`,
    backdropFilter: `blur(${initialDepth * 4}px)`,
    transition: isHome ? 'none' : 'background 0.5s ease, backdrop-filter 0.5s ease',
  };

  // Guide creature explanations based on route
  const getGuideText = () => {
    switch(location.pathname) {
      case '/': return "Upload your eDNA sample sequences here for primary analysis.";
      case '/explorer': return "Navigate the global map to view interconnected biomes.";
      case '/analysis': return "Review deep diagnostic metrics and species divergence.";
      default: return "Awaiting input...";
    }
  };

  return (
    <div className="relative min-h-screen bg-deep-navy">
      {/* Persistent Background Layer */}
      <div className="fixed inset-0 z-[0] filter brightness-[0.75] saturate-[1.15] hue-rotate-[-5deg]">
        <img 
          className="w-full h-full object-cover pointer-events-none brightness-[1.35]" 
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1920"
          alt="Ocean Background"
        />
      </div>

      {/* CSS Depth-Tint Overlay */}
      <div 
        ref={tintRef}
        className="fixed inset-0 z-[2] pointer-events-none"
        style={depthTintStyle}
      />

      {/* Depth HUD */}
      <div className="fixed left-6 bottom-6 z-[20] pointer-events-none glass-panel px-4 py-2 rounded-lg border-l-2 border-l-cyan-bright shadow-lg">
        <div className="text-xs text-cyan-bright font-mono uppercase tracking-widest">Current Depth</div>
        <div ref={hudRef} className="text-2xl text-foam-white font-mono">{(initialDepth * 4000).toFixed(0)}m</div>
      </div>

      {/* Guide Creature / Ecosystem */}
      <div className="fixed right-6 bottom-6 z-[20] flex flex-col items-end gap-2">
        <div 
          className="relative cursor-pointer group flex flex-col items-end outline-none focus-visible:ring-2 focus-visible:ring-cyan-bright focus-visible:ring-offset-2 focus-visible:ring-offset-deep-navy rounded-full"
          onClick={() => setShowGuideTooltip(!showGuideTooltip)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowGuideTooltip(!showGuideTooltip);
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={showGuideTooltip}
          aria-label="Toggle Guide Creature"
        >
          {showGuideTooltip && (
            <div className="mb-4 p-4 glass-panel rounded-xl max-w-[200px] text-sm text-foam-white animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-lg border border-cyan-bright/30" aria-live="polite">
              {getGuideText()}
            </div>
          )}
          <div className="w-12 h-12 rounded-full bg-cyan-bright/20 border border-cyan-bright/50 flex items-center justify-center animate-pulse hover:bg-cyan-bright/40 transition-colors shadow-[0_0_15px_rgba(28,170,217,0.5)]">
            <span className="text-xl" aria-hidden="true">🐟</span>
          </div>
        </div>
        <button 
          onClick={() => setShowGuideTooltip(!showGuideTooltip)}
          className="text-xs text-cyan-bright/60 hover:text-cyan-bright underline-offset-4 hover:underline focus-visible:underline"
          aria-expanded={showGuideTooltip}
        >
          What is this?
        </button>
      </div>

      {/* Hamburger & Drawer */}
      <div className="fixed top-6 left-6 z-[30]">
        <button 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-3 glass-panel rounded-lg text-cyan-bright hover:text-foam-white transition-colors shadow-lg"
          aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={drawerOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        
        {drawerOpen && (
          <div className="absolute top-14 left-0 w-64 glass-panel rounded-xl p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4 duration-300 shadow-2xl border border-cyan-bright/20">
            <NavLink 
              to="/" 
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-lg transition-colors font-display ${isActive ? 'bg-cyan-bright/20 text-cyan-bright border border-cyan-bright/30' : 'text-foam-white hover:bg-mid-teal/20'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/explorer" 
              onClick={() => setDrawerOpen(false)}
              onMouseEnter={() => prefetchRoute('/explorer')}
              onFocus={() => prefetchRoute('/explorer')}
              className={({ isActive }) => `px-4 py-3 rounded-lg transition-colors font-display ${isActive ? 'bg-cyan-bright/20 text-cyan-bright border border-cyan-bright/30' : 'text-foam-white hover:bg-mid-teal/20'}`}
            >
              Explorer
            </NavLink>
            <NavLink 
              to="/analysis" 
              onClick={() => setDrawerOpen(false)}
              onMouseEnter={() => prefetchRoute('/analysis')}
              onFocus={() => prefetchRoute('/analysis')}
              className={({ isActive }) => `px-4 py-3 rounded-lg transition-colors font-display ${isActive ? 'bg-cyan-bright/20 text-cyan-bright border border-cyan-bright/30' : 'text-foam-white hover:bg-mid-teal/20'}`}
            >
              Analysis
            </NavLink>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="min-h-screen">
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};
