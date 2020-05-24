import React from 'react';
import { Card as CardValue } from '@everyturn/core/cards.js';

export class Card extends React.PureComponent<{value?: CardValue}> {

    render() {
        const symbol = this.props.value ? `${this.props.value.rank}${this.props.value.suit}` : 'XX';
        const colorClass = this.props.value && ['D', 'H'].includes(this.props.value.suit) ? 'card--color-red' : '';
        return <span className={`card ${colorClass}`}>{symbol}</span>;
    }
}
