declare module 'boardgame.io*';

declare module 'boardgame.io/dist/client' {
  export class Client {
    moves: {[moveName: string]: (...args) => void};
    events: {[eventName: string]: (...args) => void};

    constructor(opt: any);

    getState(): any;
    reset(): void;
    undo(): void;
    redo(): void;
    step(): void;
    connect(): void;
    updateGameID(gameID: string): void;
    updatePlayerID(playerID: string): void;
    updateCredentials(credentials: string): void;
  }
}
