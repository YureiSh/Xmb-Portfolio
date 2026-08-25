import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
    moveCategoryLeft,
    moveCategoryRight,
    moveItemDown,
    moveItemUp
} from '../store/slices/xmbSlice';

const REPEAT_DELAY = 400;
const REPEAT_RATE = 120;

export function useXmbInput() {
    const dispatch = useDispatch();
    const timersRef = useRef({});

    useEffect(() => {
        const actionMap = {
            ArrowLeft: () => dispatch(moveCategoryLeft()),
            ArrowRight: () => dispatch(moveCategoryRight()),
            ArrowUp: () => dispatch(moveItemUp()),
            ArrowDown: () => dispatch(moveItemDown()),
        };

        const handleKeyDown = (e) => {
            const key = e.key;

            if (!actionMap[key]) return;
            e.preventDefault();
            if (e.repeat) return;
            clearKeyTimers(key);

            actionMap[key]();

            const delayTimeout = setTimeout(() => {
                const intervalId = setInterval(() => {
                    actionMap[key]();
                }, REPEAT_RATE);
                timersRef.current[key] = { delayTimeout, intervalId };
            }, REPEAT_DELAY);

            timersRef.current[key] = { delayTimeout, intervalId: null };
        };

        const handleKeyUp = (e) => {
            clearKeyTimers(e.key);
        };

        function clearKeyTimers(key) {
            const timers = timersRef.current[key];
            if (!timers) return;
            clearTimeout(timers.delayTimeout);
            clearInterval(timers.intervalId);
            delete timersRef.current[key];
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            Object.keys(timersRef.current).forEach(clearKeyTimers);
        };
    }, [dispatch]);
}

/*
const myRef = useRef(initialValue);
// myRef = { current: initialValue }
*/