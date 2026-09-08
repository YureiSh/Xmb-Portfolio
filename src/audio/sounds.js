import { getAudioContext, getMasterGain } from './audioContext';

export function playNavigate() {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 950;
    osc.frequency.value = baseFreq;

    osc.frequency.setValueAtTime(baseFreq + 3000, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.005);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain).connect(getMasterGain());
    osc.start(t);
    osc.stop(t + 0.06);
}

export function playSelect() {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 1250;

    osc.frequency.setValueAtTime(baseFreq - 400, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.04);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.28, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain).connect(getMasterGain());
    osc.start(t);
    osc.stop(t + 0.13);
}

export function playBack() {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 700;

    // Aşağı doğru kayma — select'in tersi
    osc.frequency.setValueAtTime(baseFreq + 350, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.05);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    osc.connect(gain).connect(getMasterGain());
    osc.start(t);
    osc.stop(t + 0.12);
}