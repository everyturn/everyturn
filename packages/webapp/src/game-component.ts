import { css, customElement, html, LitElement, property } from 'lit-element';
// remove /lib/ on https://github.com/rollup/plugins/issues/208
import { cards } from '@everyturn/core/lib/cards.js';

const cardElements = cards.map(({rank, suit}) => html`<div>${rank}${suit}</div>`);

@customElement('et-game')
export class GameComponent extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--everyturn-game-text-color, #000);
      }
    `;
  }

  @property({type: String}) title = 'Hey there';
  @property({type: Number}) counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
      ${cardElements}
    `;
  }
}
