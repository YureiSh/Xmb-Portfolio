import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { closePanel } from '../../store/slices/xmbSlice';
import { createDoomGame } from '../../game/doomHost';
import { createInputRouter } from '../../game/doomInput';

// DualShock/standart gamepad düğmesi -> Doom'un beklediği JS tuşu.
const GAMEPAD_BUTTONS = {
  0: 'Control',    // ✕  ateş
  2: ' ',          // □  kullan (kapı/anahtar)
  1: 'Escape',     // ○  menü
  3: 'Enter',      // △  menüde onayla
  4: ',',          // L1 sola yanlama
  5: '.',          // R1 sağa yanlama
  7: 'Shift',      // R2 koş
  12: 'ArrowUp',
  13: 'ArrowDown',
  14: 'ArrowLeft',
  15: 'ArrowRight',
};

const BTN_OPTIONS = 9; // paneli kapatan düğme
const AXIS_DEADZONE = 0.5;

function DoomPanel() {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'running' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let game = null;
        let input = null;
        let cancelled = false;
        let rafId = null;

        function exitGame() {
            dispatch(closePanel());
        }

        function handleKeyDown(e) {
            if (e.key === 'F10') {
                e.preventDefault();
                exitGame();
                return;
            }
            if (!game || e.repeat) return;
            if (game.doomKeyFor(e.key) === null) return;
            // Ok tuşları sayfayı kaydırmasın, Space butona basmasın.
            e.preventDefault();
            input.press('keyboard', e.key);
        }

        function handleKeyUp(e) {
            if (!game || game.doomKeyFor(e.key) === null) return;
            e.preventDefault();
            input.release('keyboard', e.key);
        }

        function handleBlur() {
            input?.releaseAll();
        }

        function pollGamepad() {
            if (!cancelled && input) {
                const pad = Array.from(navigator.getGamepads?.() ?? []).find(Boolean);

                if (!pad) {
                    // Gamepad yoksa gamepad kaynağı boş — klavyeye DOKUNMUYOR.
                    input.setGamepadKeys([]);
                } else if (pad.buttons[BTN_OPTIONS]?.pressed) {
                    exitGame();
                    return;
                } else {
                    // Bu karede gamepad'in bastığı tuşları topla. Küme olduğu için
                    // d-pad ve analog çubuk aynı tuşu üretirse kendiliğinden tekilleşir.
                    const active = [];

                    for (const [index, jsKey] of Object.entries(GAMEPAD_BUTTONS)) {
                        if (pad.buttons[index]?.pressed) active.push(jsKey);
                    }

                    const [x = 0, y = 0] = pad.axes;
                    if (y < -AXIS_DEADZONE) active.push('ArrowUp');
                    if (y > AXIS_DEADZONE) active.push('ArrowDown');
                    if (x < -AXIS_DEADZONE) active.push('ArrowLeft');
                    if (x > AXIS_DEADZONE) active.push('ArrowRight');

                    input.setGamepadKeys(active);
                }
            }

            if (!cancelled) rafId = requestAnimationFrame(pollGamepad);
        }

        createDoomGame(canvasRef.current, {
            onError: (message) => console.error('[doom]', message),
        })
            .then((instance) => {
                // Panel, wasm inmeden kapandıysa oyunu hiç başlatma.
                if (cancelled || !instance) {
                    instance?.destroy();
                    return;
                }
                game = instance;
                input = createInputRouter(instance);
                setStatus('running');

                window.addEventListener('keydown', handleKeyDown);
                window.addEventListener('keyup', handleKeyUp);
                window.addEventListener('blur', handleBlur);
                rafId = requestAnimationFrame(pollGamepad);
            })
            .catch((error) => {
                if (cancelled) return;
                console.error('[doom] yüklenemedi', error);
                setErrorMessage(error?.message ?? 'Bilinmeyen hata');
                setStatus('error');
            });

        return () => {
            cancelled = true;
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
            input?.releaseAll();
            game?.destroy();
            game = null;
            input = null;
        };
    }, [dispatch]);

    return (
        <div className="doom">
            {/* Doom onGameInit ile gerçek boyutu (640x400) bildirip bunu eziyor;
                buradaki değerler yalnızca ilk karedeki boyut sıçramasını önlüyor. */}
            <canvas ref={canvasRef} className="doom__screen" width={640} height={400} />

            {status === 'loading' && (
                <p className="doom__overlay text-sm tracking-[0.3em] animate-pulse">
                    LOADING
                </p>
            )}

            {status === 'error' && (
                <div className="doom__overlay flex flex-col items-center gap-2">
                    <p className="text-sm tracking-[0.2em]">DISC READ ERROR</p>
                    <p className="text-xs opacity-60">{errorMessage}</p>
                </div>
            )}
        </div>
    );
}
export default DoomPanel;
