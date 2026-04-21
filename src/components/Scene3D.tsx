import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy load the heavy Three.js canvas to avoid blocking initial render
const Scene3DCanvas = lazy(() => import('./Scene3DCanvas'));

export const Scene3D = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/low-end devices
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(mobile);
      // Don't render 3D on mobile or when user prefers reduced motion
      setShouldRender(!mobile && !prefersReducedMotion);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Don't render on mobile or reduced motion — save battery & bandwidth
  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <Scene3DCanvas />
    </Suspense>
  );
};

export default Scene3D;
