import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide the initial HTML loader when React is ready
const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.remove();
    }, 800);
  }
};

// Render the app and hide loader immediately after React hydrates
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Hide initial loader after minimum animation time (1.2s) or when React is ready
// This ensures the logo animation completes before fading out
const minLoaderTime = 1200;
const startTime = Date.now();

// Use requestAnimationFrame to ensure React has rendered
requestAnimationFrame(() => {
  const elapsed = Date.now() - startTime;
  const remainingTime = Math.max(0, minLoaderTime - elapsed);
  
  setTimeout(hideInitialLoader, remainingTime);
});
