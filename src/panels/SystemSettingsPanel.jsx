import { useState, useEffect } from 'react';
import { getVolume, setVolume, isMuted, setMuted } from '../audio/audioContext';
import { playNavigate } from '../audio/sounds';

const ROWS = ['mute', 'volume'];
const VOLUME_STEP = 0.1;

function SystemSettingsPanel() {
    const [activeRow, setActiveRow] = useState(0);
    const [volume, setVolumeState] = useState(getVolume());
    const [muted, setMutedState] = useState(isMuted());

    function changeVolume(delta) {
        const next = Math.min(Math.max(volume + delta, 0), 1);
        setVolume(next);
        setVolumeState(next);
        playNavigate(); // yeni seviyeyi duy
    }

    function toggleMute() {
        const next = !muted;
        setMuted(next);
        setMutedState(next);
        if (!next) playNavigate();
    }

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveRow((prev) => Math.min(prev + 1, ROWS.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveRow((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (ROWS[activeRow] === 'volume') changeVolume(VOLUME_STEP);
                else toggleMute();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (ROWS[activeRow] === 'volume') changeVolume(-VOLUME_STEP);
                else toggleMute();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (ROWS[activeRow] === 'mute') toggleMute();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeRow, volume, muted]);

    const level = Math.round(volume * 10);

    return (
        <div className="flex flex-col gap-2">
            <div
                onClick={toggleMute}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer text-md ${
                    activeRow === 0
                        ? 'opacity-100'
                        : 'opacity-65 border border-transparent hover:bg-white/5'
                }`}
            >
                <span>Ses</span>
                <span>{muted ? 'Kapalı' : 'Açık'}</span>
            </div>

            <div
                onClick={() => setActiveRow(1)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer text-md ${
                    activeRow === 1
                        ? 'opacity-100'
                        : 'opacity-65 border border-transparent hover:bg-white/5'
                }`}
            >
                <span>Seviye</span>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-4 rounded-sm ${
                                    i < level && !muted
                                        ? 'bg-blue-400'
                                        : 'bg-white/15'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="opacity-70 w-8 text-right">{level * 10}%</span>
                </div>
            </div>
        </div>
    );
}
export default SystemSettingsPanel;