import { css, customElement, html, LitElement, property } from 'lit-element';
// remove /lib/ on https://github.com/rollup/plugins/issues/208
import { cards } from '@everyturn/core/lib/cards.js';
import './card-component.js';

@customElement('et-bid-selector')
export class BidSelectorComponent extends LitElement {
  static get styles() {
    return css`
      :host {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        display: flex;
        border: 1px solid black;
        padding: 25px;
      }
      :host > * {
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: auto;
        align-self: auto;
        margin: 5px;
      }
    `;
  }

  render() {
    return html`
      ${cards.map(({rank, suit}) => html`<et-card suit=${suit} rank=${rank} />`)}
    `;
  }
}
