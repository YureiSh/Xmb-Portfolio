import { useSyncExternalStore } from 'react';

// Bu genişliğin altında ok tuşları yerine kaydırma/dokunma navigasyonu
// devreye girer. Dokunmatik ama geniş cihazlar (tablet) da klavyesiz olduğu
// için kaba işaretçi sorgusuyla kapsanıyor. CSS tarafında karşılığı
// Xmb.jsx'in köke eklediği .xmb--compact sınıfı — ayrı bir media query yok.
export const COMPACT_MAX_WIDTH = 768;

const QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px), (hover: none) and (pointer: coarse)`;

function subscribe(onChange) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsCompact() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
