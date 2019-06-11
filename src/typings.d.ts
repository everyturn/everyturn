declare module 'boardgame.io*';

declare module 'boardgame.io/dist/client' {
  export interface _ClientImpl {
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

  export function Client(opt: any): _ClientImpl;
}
