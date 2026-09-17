import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { isInputCaptured } from '../store/slices/xmbSlice';
import { tapKey } from './emitKey';
import { useIsCompact } from './useIsCompact';

// Ana eksende en az bu kadar yol alınmalı (px); altı dokunma sayılır.
const SWIPE_MIN_DISTANCE = 40;
// Ana eksen diğerinden en az bu kat baskın olmalı; çapraz hareket yok sayılır.
const AXIS_DOMINANCE = 1.5;
// Kaydırma bittikten sonra tarayıcının ürettiği click bu süre içinde yutulur;
// yoksa parmağın kalktığı kategori/öğe bir de tıklanmış sayılıyordu (ms).
const CLICK_SUPPRESS_MS = 300;

// Kaydırma yönü → tuş. "İçerik parmağı takip eder": sola kaydırınca kategori
// rayı sola akar, yani SAĞDAKİ kategoriye geçilir. Dikeyde de aynı mantık.
const SWIPE_KEY = {
  left: 'ArrowRight',
  right: 'ArrowLeft',
  up: 'ArrowDown',
  down: 'ArrowUp',
};

function getSwipeDirection(dx, dy) {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax >= SWIPE_MIN_DISTANCE && ax >= ay * AXIS_DOMINANCE) {
    return dx < 0 ? 'left' : 'right';
  }
  if (ay >= SWIPE_MIN_DISTANCE && ay >= ax * AXIS_DOMINANCE) {
    return dy < 0 ? 'up' : 'down';
  }
  return null;
}

// Kompakt modda (dar ekran / dokunmatik) kaydırmaları ok tuşlarına çevirir.
// Pointer Events kullandığı için parmak da fare sürüklemesi de çalışır.
// Hangi elemanın kaydırmayı tarayıcıya bırakacağı CSS'teki touch-action ile
// belirleniyor (.xmb--compact); tarayıcı jesti alırsa pointercancel gelir ve
// burada hiçbir şey üretilmez — tam ekran panellerin doğal kaydırması böyle
// korunuyor.
export function useSwipeInput() {
  const store = useStore();
  const isCompact = useIsCompact();

  useEffect(() => {
    if (!isCompact) return;

    let gesture = null;
    let suppressClickUntil = 0;

    function handlePointerDown(e) {
      if (!e.isPrimary) return;
      // Doom girdiyi devraldıysa dokunmatikten de tuş üretmiyoruz.
      if (isInputCaptured(store.getState().xmb)) return;
      gesture = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }

    function handlePointerUp(e) {
      if (!gesture || e.pointerId !== gesture.id) return;
      const dx = e.clientX - gesture.x;
      const dy = e.clientY - gesture.y;
      gesture = null;

      const direction = getSwipeDirection(dx, dy);
      if (!direction) return;

      suppressClickUntil = performance.now() + CLICK_SUPPRESS_MS;
      tapKey(SWIPE_KEY[direction]);
    }

    function handlePointerCancel(e) {
      if (gesture && e.pointerId === gesture.id) gesture = null;
    }

    function handleClick(e) {
      if (performance.now() >= suppressClickUntil) return;
      e.stopPropagation();
      e.preventDefault();
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('click', handleClick, true);
    };
  }, [store, isCompact]);
}
