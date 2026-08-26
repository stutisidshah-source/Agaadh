import { useEffect, useRef } from 'react';
import { useDepthStore } from '../../store/useDepthStore';

const CROSSFADE_DUR = 2.5; // Long 2.5s crossfade for a dreamy, unnoticeable transition
const BASE_OPACITY = 1.0; 

export const ScrollVideoBackground = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const rAFRef = useRef<number | undefined>(undefined);
  const activeIndexRef = useRef(0);

  // Update Parallax based on depth
  const updateOverlay = (depth: number) => {
    // Subtle Parallax Effect (Moves video up slightly as you scroll down)
    const parallaxOffset = depth * 15; // Move up by up to 15vh
    const container = document.getElementById('video-parallax-container');
    if (container) {
      container.style.transform = `translate3d(0, -${parallaxOffset}vh, 0)`;
    }

    // Dynamic playback rate based on scroll depth
    if (video1Ref.current && video2Ref.current) {
      const speed = 1.0 + depth * 1.5; // Base speed 1.0, up to 2.5 when scrolled
      video1Ref.current.playbackRate = speed;
      video2Ref.current.playbackRate = speed;
    }
  };

  useEffect(() => {
    // Subscribe to depth changes for immediate parallax updates
    const unsubscribe = useDepthStore.subscribe((state) => {
      updateOverlay(state.depth01);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const updateLoop = () => {
      if (!v1 || !v2) return;
      
      if (!v1.duration || !v2.duration) {
        rAFRef.current = requestAnimationFrame(updateLoop);
        return;
      }

      const activeVid = activeIndexRef.current === 0 ? v1 : v2;
      const inactiveVid = activeIndexRef.current === 0 ? v2 : v1;

      // Start crossfade before the end to hide the teleport
      const effectiveDuration = activeVid.duration - 0.1; 
      const timeLeft = effectiveDuration - activeVid.currentTime;

      if (timeLeft <= CROSSFADE_DUR) {
        if (inactiveVid.paused) {
          inactiveVid.currentTime = 0;
          inactiveVid.play().catch(() => {});
        }
        
        const alpha = Math.max(0, timeLeft / CROSSFADE_DUR);
        activeVid.style.opacity = (alpha * BASE_OPACITY).toString();
        inactiveVid.style.opacity = ((1 - alpha) * BASE_OPACITY).toString();
        
        if (timeLeft <= 0.05 || activeVid.ended) {
          activeVid.pause();
          activeVid.style.opacity = "0";
          inactiveVid.style.opacity = BASE_OPACITY.toString();
          activeIndexRef.current = activeIndexRef.current === 0 ? 1 : 0;
        }
      } else {
        activeVid.style.opacity = BASE_OPACITY.toString();
        if (activeVid.paused) {
          activeVid.play().catch(() => {});
        }
        if (!inactiveVid.paused) {
          inactiveVid.pause();
        }
        inactiveVid.style.opacity = "0";
      }

      rAFRef.current = requestAnimationFrame(updateLoop);
    };

    const handleLoadedMetadata = () => {
      v1.style.opacity = BASE_OPACITY.toString();
      v2.style.opacity = "0";
      v1.play().catch(() => {});
      
      if (!rAFRef.current) {
        rAFRef.current = requestAnimationFrame(updateLoop);
      }
    };

    v1.addEventListener('loadedmetadata', handleLoadedMetadata);
    v2.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Force load to ensure duration is populated
    v1.load();
    v2.load();

    if (v1.readyState >= 1 && v2.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      v1.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[0] w-full h-full bg-black overflow-hidden">
      {/* Video Container (Taller than screen for parallax) */}
      <div 
        id="video-parallax-container"
        className="absolute top-0 left-0 w-full h-[115vh] transition-transform duration-75 ease-out will-change-transform"
      >
        {/* Video 1 */}
        <video
          ref={video1Ref}
          src="/dhruvi/364463_medium.mp4"
          className="absolute inset-0 w-full h-full object-cover transition-none"
          style={{ opacity: BASE_OPACITY }}
          muted
          playsInline
          preload="auto"
          loop={false} 
          autoPlay={false}
        />
        {/* Video 2 (For Crossfading) */}
        <video
          ref={video2Ref}
          src="/dhruvi/364463_medium.mp4"
          className="absolute inset-0 w-full h-full object-cover transition-none"
          style={{ opacity: 0 }}
          muted
          playsInline
          preload="auto"
          loop={false}
          autoPlay={false}
        />
      </div>
    </div>
  );
};
