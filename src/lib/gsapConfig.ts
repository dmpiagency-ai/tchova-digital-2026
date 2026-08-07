import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Elite Mobile Performance & Animation Tuning
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
    ignoreMobileResize: true, // Evita engasgos quando a barra do navegador recolhe no scroll no mobile
  });

  // Lag smoothing ajusta dinamicamente a taxa de quadros para manter 60fps/120fps fluídos
  gsap.ticker.lagSmoothing(500, 16);

  // Low-end mobile: cap at 30fps to halve CPU cost
  // Simple fade/translate animations still look smooth at 30fps
  const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 4;
  const memory = typeof (navigator as unknown as { deviceMemory?: number }).deviceMemory === 'number'
    ? (navigator as unknown as { deviceMemory: number }).deviceMemory : 4;
  const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && (cores <= 2 || memory <= 2)) {
    gsap.ticker.fps(30);
  } else if (isMobile && (cores <= 4 || memory <= 4)) {
    gsap.ticker.fps(45); // Mid-range mobile: slightly reduced
  }
  // Desktop / high-end: default 60fps (or monitor refresh rate)
}

// Set global defaults for premium feel
gsap.defaults({
  duration: 0.8,
  ease: "power3.out",
});

export { gsap, ScrollTrigger, useGSAP };
