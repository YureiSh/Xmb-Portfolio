import { useEffect, useRef } from 'react';

// Tuş basılı tutulurken kayma hızı (px/sn). Klavye tekrarına (e.repeat)
// değil rAF'a dayanıyor; böylece gamepad köprüsü tek keydown/keyup üretse
// bile çubuğu basılı tutmak sürekli ve akıcı kaydırıyor.
const SCROLL_SPEED = 900;
// Sekme arka plana alınıp geri gelince rAF'ın uzun boşluğu tek karede
// dev bir sıçramaya dönüşmesin diye kare süresi sınırlı (ms).
const MAX_FRAME_MS = 100;

const KEY_DIRECTION = { ArrowUp: -1, ArrowDown: 1 };

// Verilen elemandan yukarı çıkarak dikeyde gerçekten taşan ilk kaydırılabilir
// kapsayıcıyı bulur. Pratikte bu .panel__body oluyor ama hook'u o sınıfa
// bağımlı kılmadık; panel kendi içinde kayıyorsa o da çalışır.
function findScrollParent(el) {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    const scrollable = overflowY === 'auto' || overflowY === 'scroll';
    if (scrollable && node.scrollHeight > node.clientHeight) return node;
  }
  return null;
}

// İçerik panellerinde ↑↓ ile kaydırma. Dönen ref panelin kök elemanına
// verilir. Sadece ok tuşlarını dinler; diğer tuşlara (Q/E, Enter, Escape)
// dokunmadığı için panelin kendi kısayollarıyla çakışmaz. Kendi ↑↓
// navigasyonu olan paneller (ayarlar) bunu KULLANMAMALI.
export function usePanelScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const held = new Set();
    let rafId = null;
    let lastTime = 0;

    function step(now) {
      const direction =
        (held.has('ArrowDown') ? 1 : 0) - (held.has('ArrowUp') ? 1 : 0);
      if (direction === 0) {
        rafId = null;
        return;
      }

      const dt = Math.min(Math.max(now - lastTime, 0), MAX_FRAME_MS) / 1000;
      lastTime = now;

      const target = ref.current && findScrollParent(ref.current);
      target?.scrollBy(0, direction * SCROLL_SPEED * dt);

      rafId = requestAnimationFrame(step);
    }

    function handleKeyDown(e) {
      if (!KEY_DIRECTION[e.key]) return;
      // useXmbInput zaten preventDefault ediyor; yine de tarayıcının kendi
      // kaydırmasının bizimkine eklenmemesi için burada da ediyoruz.
      e.preventDefault();
      if (e.repeat || held.has(e.key)) return;

      held.add(e.key);
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(step);
      }
    }

    function handleKeyUp(e) {
      held.delete(e.key);
    }

    // Alt+Tab vb. ile keyup kaçarsa tuş "basılı" kalmasın.
    function releaseAll() {
      held.clear();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseAll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseAll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
