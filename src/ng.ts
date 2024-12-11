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
    getDirectiveMetadata(): DirectiveMetadata {
        return {
            inputs: {},
            outputs: {},
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

// Forked from Angular internals.
interface DirectiveMetadata {
    inputs: Record<string, string>;
    outputs: Record<string, string>;
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
