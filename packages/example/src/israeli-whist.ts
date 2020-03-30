import { Card, rankOrder, shuffledDeck, Suit, Trump, trumps } from './cards.js';
import { PlayersArray } from './player-array.js';
import { range } from './utils.js';

// region bidding phase 1
export const legalTricksBids = [5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type TricksBid = typeof legalTricksBids[number];

interface Bid {
    trump: Trump;
    tricks: TricksBid;
}

type Call = Bid | 'PASS';

function legalCalls(g: any) {
    const moves: Call[] = ['PASS']; // player can always pass
    if (g.highestBid) {
        // only stronger bids are legal
        const highestBidTrumpIdx = trumps.indexOf(g.highestBid.trump);

        // add calls with more tricks
        moves.push(...trumps.slice(0, highestBidTrumpIdx + 1) // sameOrWeakerTrumps
            .flatMap(trump => legalTricksBids.slice(g.highestBid.tricks - 4)
                .map(tricks => ({trump, tricks}))));

        // add calls with same tricks and a stronger trump
        moves.push(...trumps.slice(highestBidTrumpIdx + 1) // strongerTrumps
            .flatMap(trump => legalTricksBids.slice(g.highestBid.tricks - 5)
                .map(tricks => ({trump, tricks}))));
    } else {
        // no first bid: any bid is legal
        moves.push(...trumps.flatMap(trump => legalTricksBids.map(tricks => ({trump, tricks}))));
    }
    return moves;
}

export async function biddingPhase1(g: any) {
    g.currentPlayer = g.dealer.nextClockwise();
    g.highestBid = null;

    let numOfPasses = 0;
    while (true) {
        const call = await g.currentPlayer.makeMove(g, legalCalls(g));
        if (call === 'PASS') {
            numOfPasses++;
            if (numOfPasses === 4) {
                break;
            }
        } else {
            g.highestBid = call;
            numOfPasses = 0;
        }
        g.currentPlayer = g.currentPlayer.nextClockwise();
    }
    g.declarer = g.currentPlayer;
}

// endregion

// region bidding phase 2

export async function biddingPhase2(g: any) {
    let totalContract = 0;
    g.currentPlayer.contract = await g.currentPlayer.makeMove(
        g, legalTricksBids.slice(g.highestBid.tricks - 5)
    );
    totalContract += g.currentPlayer.contract;

    for (let i = 1; i <= 2; i++) {
        g.currentPlayer = g.currentPlayer.nextClockwise();
        g.currentPlayer.contract = await g.currentPlayer.makeMove(
            g,
            range(14),
        );
        totalContract += g.currentPlayer.contract;
    }

    g.currentPlayer = g.currentPlayer.nextClockwise();
    g.currentPlayer.contract = await g.currentPlayer.makeMove(
        g,
        totalContract <= 13 ? range(14).splice(13 - totalContract, 1) : range(14)
    );
    totalContract += g.currentPlayer.contract;

    g.overOrUnder = totalContract > 13 ? 'OVER' : 'UNDER';
}

// endregion

// region tricks phase

function followSuit(hand: Card[], starterSuit: Suit) {
    const sameSuit = hand.filter(c => c.suit === starterSuit);
    return sameSuit.length !== 0 ? sameSuit : hand;
}

function isNewHighest(card: Card, trump: Trump, currentTrickHighest: Card) {
    return card.suit === currentTrickHighest.suit ?
        rankOrder[card.rank] > rankOrder[currentTrickHighest.rank] : card.suit === trump;
}

async function tricksPhase(g: any) {
    for (const p of g.players) {
        p.tricksWon = 0;
    }

    let trickStarter = g.declarer;
    for (let trick_num = 1; trick_num <= 13; trick_num++) {
        g.trickWinner = g.currentPlayer = trickStarter;
        g.trick = [];

        g.trick.push(g.currentTrickHighest = await g.currentPlayer.makeMove(g, g.currentPlayer.hand));

        for (let i = 2; i <= 4; i++) {
            g.currentPlayer = g.currentPlayer.nextClockwise();

            const card = await g.currentPlayer.makeMove(g, followSuit(g.currentPlayer.hand, g.trick[0].suit));
            if (isNewHighest(card, g.highestBid.trump, g.currentTrickHighest)) {
                g.currentTrickHighest = card;
                g.trickWinner = g.currentPlayer
            }
            g.trick.push(card);
        }

        g.trickWinner.tricksWon++;

        trickStarter = g.trickWinner;
    }
}

// endregionx`

// region scoring
/**
 The object of the game is to win the exact number of tricks in the contract, no more and no fewer.
 - If a player makes his contract (with zero as the exception), he receives the number of tricks squared plus ten.
 For example, a player that contracted three and took three tricks will get 19 points (3*3+10=19).
 - If a player does not make his contract (with zero as the exception), he gets minus ten points for each deviation (too many or too few) from his contract.
 Therefore, if a player bids 4 and wins 6, he loses 20 points.
 - A player that bids zero and makes it,
 receives 50 points in an "under" game (the sum of bids is less than 13)
 and 25 in an "over" game (the sum of bids is more than 13).
 - A player that bids zero and does not make it,
 loses 50 points if he wins one trick. If he wins more than one trick,
 for each additional trick he won, he receives 10 points.
 So a player who bids zero and wins one will get –50 points, and if he wins 2, he will get –40 points.
 Therefore, having bid zero and winning one trick, that player will want to win as many more additional tricks as he can.
 */
function scoring(g: any) {
    for (const player of g.players) {
        if (player.contract !== 0) {
            if (player.contract === player.tricksWon) {
                // player makes its contract
                player.score = player.contract ** 2 + 10;
            } else {
                player.score = -Math.abs(player.contract - player.tricksWon) * 10;
            }
        } else { // player.contract === 0
            if (player.tricksWon === 0) {
                // player makes it
                player.score = g.overOrUnder === 'UNDER' ? 50 : 25;
            } else {
                player.score = -50 + (player.tricksWon - 1) * 10
            }
        }

    }
}

// endregion

export async function play(g: any) {
    g.round = 1;
    g.players = new PlayersArray(4);
    g.dealer = g.players.randomPlayer();

    while (g.round <= 5) {
        // dealing of the cards
        g.players.deal(shuffledDeck());

        await biddingPhase1(g);
        await biddingPhase2(g);
        await tricksPhase(g);
        await scoring(g);

        // if (someCondition()) {
        //     break;
        // }
        g.round++;
        g.dealer = g.dealer.nextClockwise();
    }
}

play({});
