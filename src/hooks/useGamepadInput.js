import { useEffect, useRef } from 'react';

const DEADZONE = 0.5;

const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape','KeyQ', 'KeyE'];

// Standard mappings
const BTN_CROSS = 0;
const BTN_CIRCLE = 1;
const BTN_SQUARE = 2;
const BTN_TRIANGLE = 3;
const BTN_DPAD_UP = 12;
const BTN_DPAD_DOWN = 13;
const BTN_DPAD_LEFT = 14;
const BTN_DPAD_RIGHT = 15;

function readPad(pad) {
    const pressed = (i) => pad.buttons[i]?.pressed ?? false;
    const axis = (i) => pad.axes[i] ?? 0;

    return {
        ArrowUp: pressed(BTN_DPAD_UP) || axis(1) < -DEADZONE,
        ArrowDown: pressed(BTN_DPAD_DOWN) || axis(1) > DEADZONE,
        ArrowLeft: pressed(BTN_DPAD_LEFT) || axis(0) < -DEADZONE,
        ArrowRight: pressed(BTN_DPAD_RIGHT) || axis(0) > DEADZONE,
        KeyQ: pressed(BTN_SQUARE),
        KeyE: pressed(BTN_TRIANGLE),
        Enter: pressed(BTN_CROSS),
        Escape: pressed(BTN_CIRCLE),
    };
}

function emitKey(type, key) {
    window.dispatchEvent(
        new KeyboardEvent(type, { key, code: key, bubbles: true })
    );
}

export function useGamepadInput() {
    const heldRef = useRef({});

    useEffect(() => {
        let rafId = null;

        function releaseAll() {
            for (const key of KEYS) {
                if (heldRef.current[key]) {
                    emitKey('keyup', key);
                    heldRef.current[key] = false;
                }
            }
        }

        function poll() {
            const pads = navigator.getGamepads();
            let pad = null;
            for (const p of pads) {
                if (p) { pad = p; break; }
            }

            if (!pad) {
                releaseAll();
            } else {
                const current = readPad(pad);
                const held = heldRef.current;

                for (const key of KEYS) {
                    const isDown = current[key];
                    const wasDown = held[key] ?? false;

                    if (isDown && !wasDown) {
                        emitKey('keydown', key);
                    } else if (!isDown && wasDown) {
                        emitKey('keyup', key);
                    }

                    held[key] = isDown;
                }
            }

            rafId = requestAnimationFrame(poll);
        }

        rafId = requestAnimationFrame(poll);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            releaseAll();
        };
    }, []);
}