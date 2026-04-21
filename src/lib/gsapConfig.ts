import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Set global defaults for premium feel
gsap.defaults({
  duration: 0.8,
  ease: "power3.out",
});

export { gsap, ScrollTrigger, useGSAP };
