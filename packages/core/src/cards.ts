const suits = ['C', 'D', 'H', 'S'] as const;
export type Suit = typeof suits[number]

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
type Rank = typeof ranks[number]

export interface Card {
    readonly suit: Suit;
    readonly rank: Rank;
}

export const cards: ReadonlyArray<Card> = Object.freeze(ranks.flatMap(rank => suits.map(suit => ({rank, suit}))));
