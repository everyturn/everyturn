"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tic_tac_toe_1 = require("./tic-tac-toe");
const GAMES = {
    'tic-tac-toe': {
        Game: tic_tac_toe_1.TicTacToe,
        ai: tic_tac_toe_1.TicTacToeAi,
    },
};
function getGameByName(gameId) {
    return GAMES[gameId];
}
exports.getGameByName = getGameByName;
function getAllGames() {
    return Object.values(GAMES);
}
exports.getAllGames = getAllGames;
