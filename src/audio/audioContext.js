let ctx = null;

export function getAudioContext() {
    if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        console.log('[audio] created, state =', ctx.state);
    }
    return ctx;
}

export async function unlockAudioContext() {
    const context = getAudioContext();
    console.log('[audio] before resume =', context.state);
    if (context.state === 'suspended') {
        await context.resume();
    }
    console.log('[audio] after resume =', context.state);
    return context;
}