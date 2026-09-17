import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBootPhase, setBootPhase } from '../store/slices/xmbSlice';
import { unlockAudioContext } from '../audio/audioContext';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { useIsCompact } from '../hooks/useIsCompact';

function PressStartGate() {
    const dispatch = useDispatch();
    const bootPhase = useSelector(selectBootPhase);
    const isDesktop = useIsDesktop();
    const isCompact = useIsCompact();
    const startedRef = useRef(false);

    useEffect(() => {
        if (bootPhase !== 'press-start') return;

        async function start() {
            if (startedRef.current) return;
            startedRef.current = true;

            await unlockAudioContext();
            dispatch(setBootPhase('boot-sequence'));
        }

        function handleKeyDown() {
            start();
        }

        function handleClick() {
            start();
            dispatch(setBootPhase('boot-sequence')); // Burası önemli değişebilir.
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);
        };
    }, [bootPhase, dispatch]);

    if (bootPhase !== 'press-start') return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black cursor-pointer select-none px-6 text-center">
            <p className="text-white text-lg tracking-[0.3em] animate-pulse">
                PRESS START
            </p>
            <p className="text-white text-xs sm:text-lg tracking-[0.15em] sm:tracking-[0.3em] animate-pulse">
                {isCompact
                    ? 'Navigation: Swipe | Selection: Tap | Return: ✕'
                    : 'Navigation: ↑↓←→ | Selection: Enter | Return: Escape'}
            </p>

            {!isDesktop && (
                <p className="mt-8 text-white/50 text-[11px] tracking-[0.25em] uppercase leading-relaxed">
                    For the best experience<br />use a desktop with a keyboard or gamepad
                </p>
            )}
        </div>
    );
}
export default PressStartGate;