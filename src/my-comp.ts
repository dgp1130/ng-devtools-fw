import './my-other-comp.js';

import { effect } from './effect.js';

export class MyComp extends HTMLElement {
    public _name = 'test';

    private readonly log = effect(() => {
        console.log('Hello, world!');
    });

    public connectedCallback(): void {
        this.render();
    }

    // Using a GOAT-inspired rendering engine. :)
    public render(): void {
        this.innerHTML = `
            <div>Name: ${this._name}</div>
            <my-other-comp></my-other-comp>
        `;
    }
}

customElements.define('my-comp', MyComp);
