/**
 * useLowEnd — Deteta dispositivos fracos e redes lentas.
 * 
 * Lógica de inversão: low-end devices recebem conteúdo puro.
 * High-end devices recebem animações como bónus.
 */

const getConnection = (): { effectiveType?: string; saveData?: boolean } | null => {
  if (typeof navigator === 'undefined') return null;
  return (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection || null;
};

// Compute once at module level — these values never change during a session
const _isLowEnd = (() => {
  if (typeof window === 'undefined') return false;
  
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4; // GB
  const isMobile = window.innerWidth < 768;
  
  // Low-end: ≤2 cores OR ≤2GB RAM OR mobile with ≤4 cores
  return cores <= 2 || memory <= 2 || (isMobile && cores <= 4 && memory <= 4);
})();

const _isSlowNetwork = (() => {
  if (typeof window === 'undefined') return false;
  
  const conn = getConnection();
  if (!conn) return false;
  
  const slow = conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.effectiveType === '3g';
  return slow || conn.saveData === true;
})();

const _isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

/** Pre-computed flags — no React overhead, no re-renders */
export const isLowEnd = _isLowEnd;
export const isSlowNetwork = _isSlowNetwork;
export const isMobileLite = _isMobile;

/** React hook version (returns stable reference) */
export function useLowEnd() {
  return { isLowEnd: _isLowEnd, isSlowNetwork: _isSlowNetwork, isMobile: _isMobile } as const;
}
