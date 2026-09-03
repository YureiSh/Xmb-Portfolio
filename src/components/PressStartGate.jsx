import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBootPhase, setBootPhase } from '../store/slices/xmbSlice';
import { unlockAudioContext } from '../audio/audioContext';

function PressStartGate() {
    const dispatch = useDispatch();
    const bootPhase = useSelector(selectBootPhase);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none">
            <p className="text-white text-lg tracking-[0.3em] animate-pulse">
                PRESS START
            </p>
        </div>
    );
}
export default PressStartGate;