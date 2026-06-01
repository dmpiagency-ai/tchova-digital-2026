import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Elite Mobile Performance Tuning
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize", // Refresh on resize to fix disappearing elements
  });

  // Lag smoothing adjusts the playhead dynamically if frame rate drops, ensuring smooth animations
  gsap.ticker.lagSmoothing(1000, 16);
}

// Set global defaults for premium feel
gsap.defaults({
  duration: 0.8,
  ease: "power3.out",
});

export { gsap, ScrollTrigger, useGSAP };
