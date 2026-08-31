import { useState, useEffect, useRef } from 'react';

const MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const THEME_PRESETS = [
    { id: 'default', label: 'Original (RGB Sliders)' },
    ...MONTHS.flatMap((month, i) => {
    const mm = String(i + 1).padStart(2, '0');
    return [
        { id: `${mm}_day`, label: `${month} — Gündüz` },
        { id: `${mm}_night`, label: `${month} — Gece` },
    ];
    }),
];

function ThemeSettingPanel() {
    const currentPreset = window.SPLINE_SETTINGS?.gradientPreset;
    const initialIndex = Math.max(
        THEME_PRESETS.findIndex((p) => p.id === currentPreset),
        0
    );

    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [appliedId, setAppliedId] = useState(currentPreset ?? null);

    const itemRefs = useRef([]);

    function applyPreset(index) {
        const preset = THEME_PRESETS[index];
        if (window.SPLINE_SETTINGS) {
            window.SPLINE_SETTINGS.gradientPreset = preset.id;
        }
        setActiveIndex(index);
        setAppliedId(preset.id);
    }

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, THEME_PRESETS.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                applyPreset(activeIndex);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    useEffect(() => {
        itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    return (
        <div className="flex flex-col gap-1 pt-36">
            {THEME_PRESETS.map((preset, i) => {
                const isActive = i === activeIndex;
                const isApplied = preset.id === appliedId;

                return (
                    <div
                        key={preset.id}
                        ref={(el) => (itemRefs.current[i] = el)}
                        onClick={() => applyPreset(i)}
                        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm ${
                            isActive
                                ? 'opacity-100'
                                : 'opacity-65 border border-transparent hover:bg-white/5'
                        }`}
                    >
                        <span>{preset.label}</span>
                        {isApplied && <span className="text-xs opacity-70">✓</span>}
                    </div>
                );
            })}
        </div>
    );
}
export default ThemeSettingPanel;