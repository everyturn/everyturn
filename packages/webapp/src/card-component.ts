import { css, customElement, html, LitElement, property } from 'lit-element';
// remove /lib/ on https://github.com/rollup/plugins/issues/208
import { Rank, Suit } from '@everyturn/core/lib/cards.js';

const suit2color = {
  'C': 'black', 'D': 'red', 'H': 'red', 'S': 'black'
};
const suit2symbol = {
  'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠'
};

@customElement('et-card')
export class CardComponent extends LitElement {
  static get styles() {
    return css`
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

  @property({type: String}) suit!: Suit;
  @property({type: String}) rank!: Rank;

  render() {
    return html`<div class="card card--color-${suit2color[this.suit]}">${this.rank}${suit2symbol[this.suit]}</div> `;
  }
}
