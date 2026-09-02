let ctx = null;

export function getAudioContext() {
    if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
}

export async function unlockAudioContext() {
    const context = getAudioContext();
    if (context.state === 'suspended') {
        await context.resume();
    }
    return context;
}