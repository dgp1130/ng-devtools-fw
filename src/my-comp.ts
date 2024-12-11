export class MyComp extends HTMLElement {
    public name = 'test';
}

customElements.define('my-comp', MyComp);
