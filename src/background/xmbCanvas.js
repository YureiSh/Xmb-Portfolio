import './background-gradients.js'; // -> window.BG_GRADIENT_PRESETS(+_OPTIONS)
import './spline-settings.js';    // -> window.SPLINE_SETTINGS
import './spline-reverse.js';     // -> window.PS3SplineReverse
import './spline.js';             // -> window.createSplineLayer (üstteki ikisini kullanır)
import './particles-settings.js'; // -> window.PARTICLE_SETTINGS
import './particles.js';          // -> window.createParticlesLayer

/**
 * WebGL dalga arkaplanını başlatır.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ maxDpr?: number }} [options]
 * @returns {{ destroy: () => void }} temizlik fonksiyonu
 */
export function createXmbCanvas(canvas, options = {}) {
  const maxDpr = options.maxDpr ?? 1.5;

  const gl = canvas.getContext('webgl2', {
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    console.warn('[xmbCanvas] WebGL2 desteklenmiyor.');
    return { destroy() { } };
  }

  const missing = [];
  if (typeof window.createSplineLayer !== 'function') missing.push('createSplineLayer (spline.js)');
  if (typeof window.createParticlesLayer !== 'function') missing.push('createParticlesLayer (particles.js)');
  if (!window.PS3SplineReverse) missing.push('PS3SplineReverse (spline-reverse.js)');
  if (!window.SPLINE_SETTINGS) missing.push('SPLINE_SETTINGS (spline-settings.js)');
  if (!window.PARTICLE_SETTINGS) missing.push('PARTICLE_SETTINGS (particles-settings.js)');
  if (!window.BG_GRADIENT_PRESETS) missing.push('BG_GRADIENT_PRESETS (background-gradients.js)');

  if (missing.length > 0) {
    console.error('[xmbCanvas] Eksik global(ler):', missing.join(', '));
    return { destroy() { } };
  }

  let splineLayer = null;
  let particlesLayer = null;
  let rafId = null;
  let contextLost = false;
  let prevFrameMs = performance.now();
  let splineTimeSec = 0;
  let particlesTimeSec = Math.random() * 1000;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function initGLResources() {
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('EXT_color_buffer_float');
    splineLayer = window.createSplineLayer(gl, canvas);
    particlesLayer = window.createParticlesLayer(gl, canvas);
  }

  // --- Render döngüsü ---
  function frame(nowMs) {
    const dtSec = Math.max(0, (nowMs - prevFrameMs) / 1000);
    prevFrameMs = nowMs;

    splineTimeSec += dtSec;
    particlesTimeSec += dtSec;

    splineLayer.render(splineTimeSec);
    particlesLayer.render(particlesTimeSec);

    rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (rafId !== null) return;
    prevFrameMs = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stopLoop() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopLoop();
    } else if (!contextLost) {
      startLoop();
    }
  }

  function handleContextLost(e) {
    e.preventDefault();
    contextLost = true;
    stopLoop();
    console.warn('[xmbCanvas] WebGL context kayboldu, geri gelmesi bekleniyor.');
  }

  function handleContextRestored() {
    contextLost = false;
    resize();
    initGLResources();
    if (!document.hidden) startLoop();
    console.info('[xmbCanvas] WebGL context geri geldi.');
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  resize();
  initGLResources();
  if (!document.hidden) startLoop();

  return {
    /**
   * Dalga rengini değiştirir. Hafta 3'teki Ayarlar panelinden
   * çağrılacak.
   * @param {string} presetId - 'default' | '01_day' ... '12_night'
   */
    setPreset(presetId) {
      if (!window.BG_GRADIENT_PRESETS[presetId]) {
        console.warn('[xmbCanvas] Bilinmeyen preset:', presetId);
        return;
      }
      window.SPLINE_SETTINGS.gradientPreset = presetId;
    },

    /** Mevcut preset id'sini döndürür. */
    getPreset() {
      return window.SPLINE_SETTINGS.gradientPreset;
    },
    destroy() {
      stopLoop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    },
  };
}