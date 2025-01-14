export class EffectHandle {
    public constructor(public readonly stack?: string) {}
}

/** Simplified effect implement, just polls occasionally. */
export function effect(callback: () => void): EffectHandle {
    const stack = new Error().stack;
    setInterval(callback, 1_000);
    return new EffectHandle(stack);
}
