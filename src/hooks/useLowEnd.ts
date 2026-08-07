/**
 * useLowEnd — Deteta dispositivos fracos e redes lentas.
 * 
 * Lógica de inversão: low-end devices recebem conteúdo puro.
 * High-end devices recebem animações como bónus.
 * 
 * Tiers:
 *   LOW-END  → ≤2 cores OR ≤2GB RAM → sem animações, sem vídeo
 *   MID-RANGE → 3-4 cores, 3-4GB RAM → animações simples, vídeo com poster
 *   HIGH-END → 5+ cores, 5+ GB RAM → tudo activo
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
const _cores = getCores();
const _memory = getMemory();

const _isLowEnd = (() => {
  if (typeof window === 'undefined') return false;
  // Low-end: ≤2 cores OR ≤2GB RAM
  return _cores <= 2 || _memory <= 2;
})();

const _isMidRange = (() => {
  if (typeof window === 'undefined') return false;
  if (_isLowEnd) return false;
  // Mid-range: 3-4 cores OR 3-4GB RAM
  return _cores <= 4 || _memory <= 4;
})();

const _isSlowNetwork = (() => {
  if (typeof window === 'undefined') return false;
  const conn = getConnection();
  if (!conn) return false;
  const slow = conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.effectiveType === '3g';
  return slow || conn.saveData === true;
})();

/** User explicitly opted into data saving (browser setting) */
const _prefersReducedData = (() => {
  if (typeof window === 'undefined') return false;
  const conn = getConnection();
  if (!conn) return false;
  return conn.saveData === true;
})();

/** 75% video quality tier for slow networks / 2g / 3g / low-end devices */
const _use75Quality = (() => {
  if (typeof window === 'undefined') return false;
  return _isSlowNetwork || _isLowEnd || _prefersReducedData;
})();

const _isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

/** Load video always unless user enabled explicit Data Saver mode */
const _shouldLoadVideo = !_prefersReducedData;

/** Pre-computed flags — no React overhead, no re-renders */
export const isLowEnd = _isLowEnd;
export const isMidRange = _isMidRange;
export const isSlowNetwork = _isSlowNetwork;
export const prefersReducedData = _prefersReducedData;
export const use75Quality = _use75Quality;
export const isMobileLite = _isMobile;
export const shouldLoadVideo = _shouldLoadVideo;

/** React hook version (returns stable reference) */
export function useLowEnd() {
  return {
    isLowEnd: _isLowEnd,
    isMidRange: _isMidRange,
    isSlowNetwork: _isSlowNetwork,
    prefersReducedData: _prefersReducedData,
    use75Quality: _use75Quality,
    isMobile: _isMobile,
    shouldLoadVideo: _shouldLoadVideo,
  } as const;
}
