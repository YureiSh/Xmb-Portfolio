/**
 * doom.wasm host katmanı.
 *
 * Modülün beklediği 10 import'u sağlar, 4 export'unu sarar ve bir canvas'a bağlar.
 * Bu dosya, doom.wasm'ın yayınlanmış arayüz tanımına (doom.wasm.interface.txt)
 * göre SIFIRDAN yazılmıştır; upstream'in örnek glue kodundan kopyalanmamıştır.
 * Bu ayrım kasıtlı: GPL-2 lisanslı kod bundle'a girmesin diye .wasm `public/`
 * altında ayrı bir statik varlık olarak duruyor ve runtime'da yükleniyor.
 * Ayrıntı için depo kökündeki LICENSES.md.
 *
 * imports:
 *   console.onInfoMessage(ptr, len)        console.onErrorMessage(ptr, len)
 *   loading.onGameInit(width, height)      loading.wadSizes(...)  loading.readWads(...)
 *   runtimeControl.timeInMilliseconds() -> i64
 *   ui.drawFrame(frameBufferPtr)
 *   gameSaving.sizeOfSaveGame/readSaveGame/writeSaveGame
 * exports:
 *   initGame() tickGame() reportKeyDown(i32) reportKeyUp(i32) memory + KEY_* globals
 */

// Doom 35 fps'te koşar; rAF genelde 60Hz olduğu için biriktirici ile tick atıyoruz.
const TICK_MS = 1000 / 35;

// Tek karakterli tuşlar ASCII kodlarıyla geçer; isimli tuşlar bu haritadan.
const NAMED_KEYS = {
  ArrowLeft: 'KEY_LEFTARROW',
  ArrowRight: 'KEY_RIGHTARROW',
  ArrowUp: 'KEY_UPARROW',
  ArrowDown: 'KEY_DOWNARROW',
  ',': 'KEY_STRAFE_L',
  '.': 'KEY_STRAFE_R',
  Control: 'KEY_FIRE',
  ' ': 'KEY_USE',
  Shift: 'KEY_SHIFT',
  Tab: 'KEY_TAB',
  Escape: 'KEY_ESCAPE',
  Enter: 'KEY_ENTER',
  Backspace: 'KEY_BACKSPACE',
  Alt: 'KEY_ALT',
};

function decodeUtf8(memory, ptr, length) {
  const bytes = new Uint8Array(memory.buffer, ptr, length);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ wasmUrl?: string, onInfo?: (m: string) => void, onError?: (m: string) => void }} [options]
 * @returns {Promise<{
 *   keys: Record<string, number>,
 *   doomKeyFor: (jsKey: string) => number | null,
 *   keyDown: (doomKey: number) => void,
 *   keyUp: (doomKey: number) => void,
 *   destroy: () => void,
 * }>}
 */
export async function createDoomGame(canvas, options = {}) {
  const wasmUrl = options.wasmUrl ?? '/doom/doom.wasm';
  const onInfo = options.onInfo ?? (() => {});
  const onError = options.onError ?? (() => {});

  const ctx = canvas.getContext('2d', { alpha: false });

  let memory = null;
  let frame = null;      // ImageData — boyut onGameInit'te belli oluyor (640x400)
  let frameWords = null; // aynı tampona 32-bit görünüm (kanal takası için)
  let pendingFrameBufferPtr = null;
  let destroyed = false;

  function onGameInit(width, height) {
    canvas.width = width;
    canvas.height = height;
    frame = ctx.createImageData(width, height);
    frameWords = new Uint32Array(frame.data.buffer);
  }

  // Doom bir tick içinde drawFrame'i birden çok kez çağırabiliyor (ölçümde
  // 70 tick -> 146 çağrı). Her çağrıda 640x400'lük tamponu dönüştürmek boşa iş;
  // sadece en son işaretçiyi not edip kare başına bir kez çiziyoruz.
  function drawFrame(frameBufferPtr) {
    pendingFrameBufferPtr = frameBufferPtr;
  }

  function blitPendingFrame() {
    if (destroyed || !frame || pendingFrameBufferPtr === null) return;

    // Doom'un tamponu 32-bit; motorun kendi logu kanal yerleşimini veriyor:
    //   "RGBA: 8888, red_off: 16, green_off: 8, blue_off: 0, transp_off: 24"
    // yani kelime = A<<24 | R<<16 | G<<8 | B.
    // ImageData ise bayt sırası R,G,B,A bekliyor; little-endian'da bu
    // kelime = A<<24 | B<<16 | G<<8 | R demek. Tek fark R ile B'nin yeri.
    //
    // Bayt bayt döngü yerine 32-bit kelime üzerinde çalışıyoruz (4x az iş).
    // Belleğin büyümesi ArrayBuffer'ı detach edebileceği için görünümü
    // her karede yeniden kuruyoruz.
    const source = new Uint32Array(
      memory.buffer,
      pendingFrameBufferPtr,
      canvas.width * canvas.height
    );
    pendingFrameBufferPtr = null;

    for (let i = 0; i < frameWords.length; i++) {
      const pixel = source[i];
      frameWords[i] =
        0xff000000 |                   // alfa: tam opak
        ((pixel & 0x000000ff) << 16) | // B -> mavi kanal
        (pixel & 0x0000ff00) |         // G yerinde
        ((pixel >>> 16) & 0x000000ff); // R -> kırmızı kanal
    }

    ctx.putImageData(frame, 0, 0);
  }

  const imports = {
    loading: {
      onGameInit,
      // Boş bırakmak "WAD verme" demek; modül gömülü Doom Shareware WAD'ını yükler.
      wadSizes: () => {},
      readWads: () => {},
    },
    ui: { drawFrame },
    runtimeControl: {
      timeInMilliseconds: () => BigInt(Math.trunc(performance.now())),
    },
    console: {
      onInfoMessage: (ptr, len) => onInfo(decodeUtf8(memory, ptr, len)),
      onErrorMessage: (ptr, len) => onError(decodeUtf8(memory, ptr, len)),
    },
    gameSaving: {
      // Kayıt desteği yok — üçü de 0 döndürünce Doom kaydetmeyi denemiyor.
      sizeOfSaveGame: () => 0,
      readSaveGame: () => 0,
      writeSaveGame: () => 0,
    },
  };

  const response = fetch(wasmUrl);
  let instance;
  try {
    ({ instance } = await WebAssembly.instantiateStreaming(response, imports));
  } catch {
    // Sunucu application/wasm göndermiyorsa streaming yolu patlar; tampona düş.
    const bytes = await (await fetch(wasmUrl)).arrayBuffer();
    ({ instance } = await WebAssembly.instantiate(bytes, imports));
  }

  if (destroyed) return null;

  const exports = instance.exports;
  memory = exports.memory;

  // KEY_* global'leri WebAssembly.Global; .value ile sayıya iniyoruz.
  const keys = {};
  for (const wasmName of Object.values(NAMED_KEYS)) {
    keys[wasmName.replace(/^KEY_/, '')] = exports[wasmName].value;
  }

  function doomKeyFor(jsKey) {
    const named = NAMED_KEYS[jsKey];
    if (named) return exports[named].value;
    // Tek karakterli tuşlarda Doom doğrudan ASCII kodunu bekliyor.
    if (jsKey.length === 1) return jsKey.charCodeAt(0);
    return null;
  }

  exports.initGame();

  let rafId = null;
  let lastFrameMs = performance.now();
  let accumulatorMs = 0;

  function loop(nowMs) {
    if (destroyed) return;

    accumulatorMs += nowMs - lastFrameMs;
    lastFrameMs = nowMs;

    // Sekme arkaplandayken biriken devasa gecikmeyi kovalamaya çalışma.
    if (accumulatorMs > TICK_MS * 5) accumulatorMs = TICK_MS;

    while (accumulatorMs >= TICK_MS) {
      exports.tickGame();
      accumulatorMs -= TICK_MS;
    }

    blitPendingFrame();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  return {
    keys,
    doomKeyFor,
    keyDown: (doomKey) => { if (!destroyed) exports.reportKeyDown(doomKey); },
    keyUp: (doomKey) => { if (!destroyed) exports.reportKeyUp(doomKey); },
    destroy() {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      // WebAssembly instance'ı elle yok edilemez; referansları bırakıp GC'ye veriyoruz.
      memory = null;
      frame = null;
      frameWords = null;
      pendingFrameBufferPtr = null;
    },
  };
}
