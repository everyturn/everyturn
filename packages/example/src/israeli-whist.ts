enum Suit {
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
}

const SUITS = Object.freeze([Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES]);

enum Rank {
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    QUEEN,
    KING,
    ACE,
}

const RANKS = Object.freeze([
    Rank.TWO, Rank.THREE, Rank.FOUR,
    Rank.FIVE, Rank.SIX, Rank.SEVEN, Rank.EIGHT,
    Rank.NINE, Rank.TEN, Rank.JACK,
    Rank.QUEEN, Rank.KING, Rank.ACE,
]);

interface Face {
    readonly rank: Rank,
    readonly suit: Suit
}

const FACES = Object.freeze(RANKS.flatMap(rank => SUITS.map(suit => Object.freeze({rank, suit}))));

// Fisher–Yates shuffle algorithm
function shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface Card {
    readonly face: Face;
}

function newDeck(): Card[] {
    return FACES.map(face => Object.freeze({face}));
}

console.log(shuffle(newDeck()));

