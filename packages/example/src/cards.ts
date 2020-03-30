import { orderByIndex, shuffle } from './utils.js';

const suits = ['C', 'D', 'H', 'S'] as const;
export type Suit = typeof suits[number]

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
type Rank = typeof ranks[number]

export const trumps = [...suits, 'NT'] as const;
export type Trump = typeof trumps[number];

export const rankOrder = orderByIndex(ranks);
export const trumpOrder = orderByIndex(trumps);

export interface Card {
    readonly suit: Suit;
    readonly rank: Rank;
}

export const cards: ReadonlyArray<Card> = Object.freeze(ranks.flatMap(rank => suits.map(suit => ({rank, suit}))));

export function shuffledDeck(): Array<Card> {
    return shuffle([...cards]);
}
//
// class Bid {
//     private readonly trumpValue: number;
//
//     constructor(public trump: Trump, public tricks: number) {
//         this.trumpValue = trumpOrder[trump];
//     }
//
//     isHigherThan(other: Bid) {
//         return this.trumpValue === other.trumpValue ? this.tricks > other.tricks :
//             this.trumpValue > other.trumpValue ? this.tricks >= other.tricks : false;
//     }
// }
//
// class Card {
//     private readonly rankValue: number;
//
//     constructor(public suit: Suit, public rank: Rank) {
//         this.rankValue = rankOrder[rank];
//     }
//
//     isNewHighest(starterSuit: Suit, trump: Trump, trumpUsed: boolean, highestRankValue: number) {
//         return trumpUsed ? (this.suit === trump && this.rankValue > highestRankValue) :
//             (this.suit === trump) || (this.suit === starterSuit && this.rankValue > highestRankValue);
//     }
// }
