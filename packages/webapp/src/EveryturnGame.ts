import { html, css, LitElement, property } from 'lit-element';

export class EveryturnGame extends LitElement {
  static get styles() {
    return css`
      :host {
        --everyturn-game-text-color: #000;

        display: block;
        padding: 25px;
        color: var(--everyturn-game-text-color);
      }
    `;
  }

  @property() title = 'Hey there';
  @property() counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
