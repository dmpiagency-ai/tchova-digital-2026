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
}

// Set global defaults for premium feel
gsap.defaults({
  duration: 0.8,
  ease: "power3.out",
});

export { gsap, ScrollTrigger, useGSAP };
