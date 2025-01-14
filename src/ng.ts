import { EffectHandle } from './effect.js';

// DevTools checks for `__ngContext__` of the root element to ensure it's running Angular Ivy.
(document.querySelector('body > *')! as any).__ngContext__ = {};

export const ng = {
    /** Get a reference to the user-defined "component" instance containing relevant properties. */
    getComponent(el: Element): Element | null {
        // Treat all custom elements as components.
        if (el.tagName.includes('-')) return el;

        return null; // Ignore everything else.
    },

    // No directive support.
    getDirectives(_el: Element): never[] {
        return [];
    },

    // Gives additional metadata about properties.
    // Note that Angular components *are* directives, so this is called.
    // Seems like we could use this to disambiguate properties and inputs, but
    // not entirely sure how it works right now.
    getDirectiveMetadata(el: Element): ComponentDebugMetadata | DirectiveDebugMetadata | null {
        const comp = ng.getComponent(el);
        if (!comp) return null;

        const properties = Object.entries(Object.getOwnPropertyDescriptors(el));

        return {
            inputs: {},
            outputs: {},
            props: properties
                .filter(([prop]) => !prop.startsWith('_'))
                .filter(([_prop, descriptor]) => !(descriptor.value instanceof EffectHandle))
                .map(([prop]) => ({[prop]: prop}))
                .reduce((l, r) => ({...l, ...r}), {}),
            state: properties
                .filter(([prop]) => prop.startsWith('_'))
                .filter(([_prop, descriptor]) => !(descriptor.value instanceof EffectHandle))
                .map(([prop]) => ({[prop]: prop}))
                .reduce((l, r) => ({...l, ...r}), {}),
            effects: properties
                .filter(([_prop, descriptor]) => descriptor.value instanceof EffectHandle)
                .map(([_prop, descriptor]) => (descriptor.value as EffectHandle).stack)
                .filter((stack): stack is string => Boolean(stack))
                .map((stack) => parseStack(stack))
                .filter((effectRef): effectRef is string => Boolean(effectRef)),
            encapsulation: ViewEncapsulation.Emulated,
            changeDetection: ChangeDetectionStrategy.Default,
        };
    },

    // The `Components` panel normally shows a list of injected services and the resolution path,
    // we can ignore this.
    getInjector(_el: Element): null {
        return null;
    },

    // DevTools automatically applies property updates to component instances based on
    // `getComponent`. This tells the framework to re-render that component.
    applyChanges(el: Element): void {
        (el as any).render();
    },
};

interface DirectiveDebugMetadata {
    inputs: Record<string, string>;
    outputs: Record<string, string>;
    props: Record<string, string>;
    state: Record<string, string>;
    effects: string[];
}

// Forked from Angular internals.
interface ComponentDebugMetadata extends DirectiveDebugMetadata {
    encapsulation: ViewEncapsulation;
    changeDetection: ChangeDetectionStrategy;
}

enum ViewEncapsulation {
    Emulated = 0,
    // Historically the 1 value was for `Native` encapsulation which has been removed as of v11.
    None = 2,
    ShadowDom = 3,
}

enum ChangeDetectionStrategy {
    OnPush = 0,
    Default = 1,
}

/**
 * Parses the following into the `effect` caller's location URL:
 *
 * Error
 *     at effect (http://localhost:8080/my-comp.js:21:19)
 *     at <instance_members_initializer> (http://localhost:8080/my-comp.js:5:11)
 *     at new MyComp (http://localhost:8080/my-comp.js:3:8)
 *     at http://localhost:8080/my-comp.js:19:16
 */
function parseStack(stack: string): string | undefined {
    const traceLines = stack.matchAll(/^ +at (?<line>.*)$/mg);
    if (!traceLines) return undefined;

    const caller = Array.from(traceLines).at(1);
    const match = caller!.groups!['line'].match(/[^(]* \((?<location>[^)]*)\)/);
    if (!match) return undefined;

    return match.groups!['location'];
}
