import { css, customElement, html, LitElement, property } from 'lit-element';
// remove /lib/ on https://github.com/rollup/plugins/issues/208
import { Card, cards } from '@everyturn/core/lib/cards.js';

const suit2color = {
  'C': 'black', 'D': 'red', 'H': 'red', 'S': 'black'
};
const suit2symbol = {
  'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠'
};
const cardTemplate = ({ rank, suit}: Card) => html`<div class="card card--color-${suit2color[suit]}">${rank}${suit2symbol[suit]}</div>`;

@customElement('et-game')
export class GameComponent extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--everyturn-game-text-color, #000);
      }

      .card {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid gray;
        height: 28px;
        width: 28px;
      }
      .card.card--color-black {color: black;}
      .card.card--color-red {color: red;}
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
      ${cards.map(cardTemplate)}
    `;
  }
}
