/**
 * Doom girdi arbitrasyonu.
 *
 * Klavye ve gamepad aynı tuşlara basabiliyor (ör. hem yukarı oku hem d-pad).
 * Tek bir "basılı tuşlar" kümesi tutmak işe yaramıyor: gamepad her karede
 * yoklandığı için "bu düğmeye basılmıyor" durumu, klavyeden basılı tutulan
 * aynı tuşu anında bırakılmış sayıyordu — tuşlar bir kare içinde düşüyordu.
 *
 * Çözüm: her kaynağın basılı kümesini AYRI tut, Doom'a gönderilen durum
 * ikisinin birleşimi olsun. Bir tuş, onu basan tüm kaynaklar bırakana kadar
 * basılı kalır.
 */

/**
 * @param {{
 *   doomKeyFor: (jsKey: string) => number | null,
 *   keyDown: (doomKey: number) => void,
 *   keyUp: (doomKey: number) => void,
 * }} game
 */
export function createInputRouter(game) {
  const sources = {
    keyboard: new Set(),
    gamepad: new Set(),
  };

  // Doom'a fiilen "basılı" diye bildirdiklerimiz — tekrarlı bildirim yapmamak için.
  const reported = new Set();

  function sync(jsKey) {
    const shouldBeDown = sources.keyboard.has(jsKey) || sources.gamepad.has(jsKey);
    if (shouldBeDown === reported.has(jsKey)) return;

    const doomKey = game.doomKeyFor(jsKey);
    if (doomKey === null) return;

    if (shouldBeDown) {
      reported.add(jsKey);
      game.keyDown(doomKey);
    } else {
      reported.delete(jsKey);
      game.keyUp(doomKey);
    }
  }

  return {
    press(source, jsKey) {
      sources[source].add(jsKey);
      sync(jsKey);
    },

    release(source, jsKey) {
      sources[source].delete(jsKey);
      sync(jsKey);
    },

    /**
     * Gamepad'in o karedeki TÜM basılı tuşlarını tek seferde bildirir.
     * Düğme döngüsü ve analog çubuk aynı tuşu üretebildiği için küme kullanmak
     * tekrarı kendiliğinden eliyor.
     */
    setGamepadKeys(jsKeys) {
      const next = new Set(jsKeys);
      // Değişebilecek tuşlar: önceki karede basılı olanlar + şimdi basılı olanlar.
      const touched = new Set([...sources.gamepad, ...next]);
      sources.gamepad = next;
      for (const jsKey of touched) sync(jsKey);
    },

    /** Odak kaybı vb. — her şeyi bırak, yoksa karakter tek yöne yürümeye devam eder. */
    releaseAll() {
      const touched = new Set([...sources.keyboard, ...sources.gamepad]);
      sources.keyboard = new Set();
      sources.gamepad = new Set();
      for (const jsKey of touched) sync(jsKey);
    },

    /** Testler ve hata ayıklama için: Doom şu an bu tuşu basılı görüyor mu? */
    isDown(jsKey) {
      return reported.has(jsKey);
    },
  };
}
