import { getAudioContext } from './audioContext';

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

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
}