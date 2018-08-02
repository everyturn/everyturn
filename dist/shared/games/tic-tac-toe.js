"use strict";
/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("boardgame.io/dist/core");
const ai_1 = require("boardgame.io/dist/ai");
exports.TicTacToeAi = ai_1.AI({
    enumerate: G => {
        const r = [];
        for (let i = 0; i < 9; i++) {
            if (G.cells[i] === null) {
                r.push({ move: 'clickCell', args: [i] });
            }
        }
        return r;
    },
});
function IsVictory(cells) {
    const positions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const pos of positions) {
        const symbol = cells[pos[0]];
        let winner = symbol;
        for (const i of pos) {
            // noinspection TsLint
            if (cells[i] != symbol) {
                winner = null;
                break;
            }
        }
        if (winner != null) {
            return true;
        }
    }
    return false;
}
exports.IsVictory = IsVictory;
exports.TicTacToe = core_1.Game({
    name: 'tic-tac-toe',
    setup: () => ({
        cells: Array(9).fill(null),
    }),
    moves: {
        clickCell(G, ctx, id) {
            const cells = [...G.cells];
            if (cells[id] === null) {
                cells[id] = ctx.currentPlayer;
            }
            return Object.assign({}, G, { cells });
        },
    },
    flow: {
        movesPerTurn: 1,
        endGameIf: (G, ctx) => {
            if (IsVictory(G.cells)) {
                return { winner: ctx.currentPlayer };
            }
            if (G.cells.every(c => c !== null)) {
                return { draw: true };
            }
        },
        endGame: true,
    },
});
