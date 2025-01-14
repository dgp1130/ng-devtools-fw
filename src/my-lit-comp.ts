import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-lit-comp')
export class MyLitElement extends LitElement {
    private framework = 'Lit';

    render(): TemplateResult {
        return html`
            <div>Hello from ${this.framework}!</div>
        `;
    }
}
