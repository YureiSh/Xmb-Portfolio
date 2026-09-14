import { useSyncExternalStore } from 'react';

// "Masaüstü" = birincil işaretçi hassas (fare/trackpad) VE hover yapabiliyor.
// Ekran genişliği yerine bunu seçtik: dar bir masaüstü penceresi hâlâ
// klavyeli bir masaüstüdür; dokunmatik bir tablet ise geniş olsa da değildir.
// XMB klavye/gamepad ile gezildiği için asıl mesele giriş cihazı.
const QUERY = '(pointer: fine) and (hover: hover)';

function subscribe(onChange) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// SSR/ilk render için iyimser varsayım
function getServerSnapshot() {
  return true;
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
