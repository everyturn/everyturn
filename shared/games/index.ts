import { TicTacToe, TicTacToeAi } from './tic-tac-toe';

export interface IGameTypeRecord {
  readonly Game: any;
  readonly ai: any;
}

const GAMES: {readonly [gameId: string]: IGameTypeRecord} = {
  'tic-tac-toe': {
    Game: TicTacToe,
    ai: TicTacToeAi,
  },
};

export function getGameByName(gameId: string) {
  return GAMES[gameId];
}

export function getAllGames() {
  return Object.values(GAMES);
}
