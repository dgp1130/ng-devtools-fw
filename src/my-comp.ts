import './my-other-comp.js';

export class MyComp extends HTMLElement {
    public name = 'test';

    public connectedCallback(): void {
        this.render();
    }

    // Using a GOAT-inspired rendering engine. :)
    public render(): void {
        this.innerHTML = `
            <div>Name: ${this.name}</div>
            <my-other-comp></my-other-comp>
        `;
    }
}

customElements.define('my-comp', MyComp);
