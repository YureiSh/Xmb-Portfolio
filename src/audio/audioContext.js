let ctx = null;
let masterGain = null;

const STORAGE_KEY = 'xmb-audio';
const DEFAULT_VOLUME = 0.7;

let volume = DEFAULT_VOLUME;
let muted = false;


try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.volume === 'number') volume = saved.volume;
        if (typeof saved.muted === 'boolean') muted = saved.muted;
    }
} catch {
}

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted }));
    } catch {
    }
}

export function getAudioContext() {
    if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
}

export function getMasterGain() {
    const context = getAudioContext();
    if (!masterGain) {
        masterGain = context.createGain();
        masterGain.gain.value = muted ? 0 : volume;
        masterGain.connect(context.destination);
    }
    return masterGain;
}

function applyGain() {
    if (!masterGain) return;
    const context = getAudioContext();
    masterGain.gain.setTargetAtTime(
        muted ? 0 : volume,
        context.currentTime,
        0.01
    );
}

export function getVolume() {
    return volume;
}

export function setVolume(value) {
    volume = Math.min(Math.max(value, 0), 1);
    applyGain();
    persist();
}

export function isMuted() {
    return muted;
}

export function setMuted(value) {
    muted = value;
    applyGain();
    persist();
}

export async function unlockAudioContext() {
    const context = getAudioContext();
    if (context.state === 'suspended') {
        await context.resume();
    }
    getMasterGain();
    return context;
}