/**
 * doom girdi arbitrasyonu regresyon testi.
 *
 * Korunan hata: klavye ve gamepad tek bir "basılı tuşlar" kümesini paylaşıyordu.
 * Gamepad her rAF karesinde yoklandığı için, klavyeden basılı tutulan bir tuş
 * bir kare içinde bırakılmış sayılıyor ve Doom'da yürümek imkânsız hale geliyordu.
 *
 * Çalıştır: node scripts/test-doom-input.mjs   (npm run test:input)
 */
import { createInputRouter } from '../src/game/doomInput.js';

let pass = 0;
let fail = 0;

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`);
    console.log(`        beklenen: ${JSON.stringify(expected)}`);
    console.log(`        gelen:    ${JSON.stringify(actual)}`);
  }
}

function makeRouter() {
  const log = [];
  const router = createInputRouter({
    doomKeyFor: (k) =>
      ({ ArrowUp: 172, Control: 163, ' ': 162, F13: null }[k] ??
        (k.length === 1 ? k.charCodeAt(0) : null)),
    keyDown: (k) => log.push(`DOWN ${k}`),
    keyUp: (k) => log.push(`UP ${k}`),
  });
  return { router, log };
}

console.log('\n=== REGRESYON: gamepad yoklaması klavyeyi ezmemeli ===');
{
  const { router, log } = makeRouter();
  router.press('keyboard', 'ArrowUp');
  for (let frame = 0; frame < 60; frame++) router.setGamepadKeys([]);
  check('60 kare sonra tuş hâlâ basılı', router.isDown('ArrowUp'), true);
  check('sadece tek bir DOWN gitti', log, ['DOWN 172']);
  router.release('keyboard', 'ArrowUp');
  check('bırakınca UP gidiyor', log, ['DOWN 172', 'UP 172']);
}

console.log('\n=== Gamepad tek başına ===');
{
  const { router, log } = makeRouter();
  router.setGamepadKeys(['ArrowUp']);
  router.setGamepadKeys(['ArrowUp']);
  router.setGamepadKeys(['ArrowUp']);
  check('tekrarlı DOWN yok', log, ['DOWN 172']);
  router.setGamepadKeys([]);
  check('düğme bırakılınca UP', log, ['DOWN 172', 'UP 172']);
}

console.log('\n=== İki kaynak aynı tuşta ===');
{
  const { router, log } = makeRouter();
  router.press('keyboard', 'ArrowUp');
  router.setGamepadKeys(['ArrowUp']);
  check('ikinci kaynak DOWN tekrarlamıyor', log, ['DOWN 172']);
  router.release('keyboard', 'ArrowUp');
  check('bir kaynak bıraktı, diğeri basılı -> UP yok', log, ['DOWN 172']);
  check('hâlâ basılı', router.isDown('ArrowUp'), true);
  router.setGamepadKeys([]);
  check('son kaynak da bırakınca UP', log, ['DOWN 172', 'UP 172']);
}

console.log('\n=== Odak kaybı ===');
{
  const { router, log } = makeRouter();
  router.press('keyboard', 'ArrowUp');
  router.press('keyboard', 'Control');
  router.setGamepadKeys([' ']);
  router.releaseAll();
  check(
    'her şey bırakıldı',
    log.filter((l) => l.startsWith('UP')).sort(),
    ['UP 162', 'UP 163', 'UP 172']
  );
}

console.log('\n=== Eşlenmeyen tuş ===');
{
  const { router, log } = makeRouter();
  router.press('keyboard', 'F13');
  check('Doom tanımayan tuş yok sayılıyor', log, []);
}

console.log(`\n${fail === 0 ? 'TÜMÜ GEÇTİ' : 'BAŞARISIZ'} — ${pass} geçti, ${fail} kaldı\n`);
process.exit(fail === 0 ? 0 : 1);
