import { rangeGen } from './utils.js';
import { Card } from './cards.js';

export class Player {
    public hand!: Card[];
    constructor(public readonly idx: number, private arr: PlayersArray) {
    }

    nextClockwise(offset: number = 1) {
        return this.arr.nextClockwise(this.idx, offset);
    }

    makeMove(g: any, legalMoves: any[]) {
        if (!legalMoves) debugger;
        // random move
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
}

export class PlayersArray extends Array<Player> {

    constructor(public numOfPlayers: number) {
        super(numOfPlayers);
        for (const idx of rangeGen(numOfPlayers)) {
            this[idx] = new Player(idx, this);
        }
    }

    randomPlayer() {
        return this[Math.floor(Math.random() * this.numOfPlayers)];
    }

    nextClockwise(idx: number, offset: number = 1) {
        // remainder
        return this[(idx + offset) % this.numOfPlayers];
    }

    nextCounterclockwise(idx: number, offset: number = 1) {
        // modulo
        return this[(((idx - offset) % this.numOfPlayers) + this.numOfPlayers) % this.numOfPlayers];
    }

    deal(cards: Card[]) {
        const cardPerPlayer = cards.length / this.numOfPlayers;
        for (const p of this) {
            p.hand = cards.slice(p.idx * cardPerPlayer, (p.idx + 1) * cardPerPlayer);
        }
    }
}
