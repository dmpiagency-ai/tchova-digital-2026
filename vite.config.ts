import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers — smaller output, no legacy polyfills
    target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cached aggressively
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase — only loaded for auth flows
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Animation stack — cached independently from app logic
          'animation-vendor': ['gsap', 'lenis'],
          // UI utilities
          'ui-vendor': ['embla-carousel', 'embla-carousel-react', 'embla-carousel-autoplay'],
        }
      }
    }
  }
}));
