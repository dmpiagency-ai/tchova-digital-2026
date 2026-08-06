/**
 * useLowEnd — Deteta dispositivos fracos e redes lentas.
 * 
 * Lógica de inversão: low-end devices recebem conteúdo puro.
 * High-end devices recebem animações como bónus.
 */

interface ConnectionInfo {
  effectiveType?: string;
  saveData?: boolean;
}

const getConnection = (): ConnectionInfo | null => {
  if (typeof navigator === 'undefined') return null;
  return (navigator as unknown as Navigator & {
    connection?: ConnectionInfo;
    mozConnection?: ConnectionInfo;
    webkitConnection?: ConnectionInfo;
  }).connection || 
    (navigator as unknown as Navigator & {
      connection?: ConnectionInfo;
      mozConnection?: ConnectionInfo;
      webkitConnection?: ConnectionInfo;
    }).mozConnection || 
    (navigator as unknown as Navigator & {
      connection?: ConnectionInfo;
      mozConnection?: ConnectionInfo;
      webkitConnection?: ConnectionInfo;
    }).webkitConnection || null;
};

const getCores = (): number => {
  if (typeof navigator === 'undefined') return 4;
  const c = navigator.hardwareConcurrency;
  return typeof c === 'number' && !isNaN(c) ? c : 4;
};

const getMemory = (): number => {
  if (typeof navigator === 'undefined') return 4;
  const m = (navigator as unknown as { deviceMemory?: unknown }).deviceMemory;
  return typeof m === 'number' && !isNaN(m) ? m : 4;
};

// Compute once at module level — these values never change during a session
const _isLowEnd = (() => {
  if (typeof window === 'undefined') return false;
  
  const cores = getCores();
  const memory = getMemory();
  
  // Low-end: ≤2 cores OR ≤2GB RAM
  return cores <= 2 || memory <= 2;
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
