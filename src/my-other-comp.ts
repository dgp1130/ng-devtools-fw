export class MyOtherComp extends HTMLElement {
    public target = 'World';

    public connectedCallback(): void {
        this.render();
    }

    public render(): void {
        this.innerHTML = `
            <div>Hello, ${this.target}!</div>
        `;
    }
}

customElements.define('my-other-comp', MyOtherComp);
