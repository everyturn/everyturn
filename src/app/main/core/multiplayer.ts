import { createStore, applyMiddleware, compose } from 'redux';
import { RESTORE } from './action-types';
import * as ActionCreators from './action-creators';

// The actions that are sent across the network.
const blacklistedActions = new Set([RESTORE]);

/**
 * Multiplayer
 *
 * Handles all the multiplayer interactions on the client-side.
 */
export class Multiplayer {
  numPlayers: any;
  server: any;
  playerID: string | null;
  gameID: string;
  gameName: any;
  store: any;
  isConnected: any;

  constructor({
                gameID,
                playerID,
                gameName,
                numPlayers,
                server,
              }: { gameID: string; playerID: string; gameName: any; numPlayers: any; server: any }) {
    this.server = server;
    this.gameName = gameName || 'default';
    this.gameID = this.gameName + ':' + (gameID || 'default');
    this.playerID = playerID || null;
    this.numPlayers = numPlayers || 2;

    this.isConnected = false;
  }

  updateGameID(arg0: any): any {
    // throw new Error('Method not implemented.');
  }

  updatePlayerID(arg0: any): any {
    // throw new Error('Method not implemented.');
  }

  connect(): any {
    this.server.onMessage.add((message) => {
      if (
        message.msgType === 'sync' &&
        // message.gameID === this.gameID && // todo figure this out...
        message.state._stateID >= this.store.getState()._stateID
      ) {
        const action = ActionCreators.restore(message.state);
        action._remote = true;
        this.store.dispatch(action);
      }
    });

  }


  subscribe(arg0: any): any {
    // throw new Error('Method not implemented.');
  }

  /**
   * Creates a Redux store with some middleware that sends actions
   * to the server whenever they are dispatched.
   * @param {function} reducer - The game reducer.
   * @param {function} enhancer - optional enhancer to apply to Redux store
   */
  createStore(reducer, enhancer): any {
    this.store = null;

    // Redux middleware to emit a message on a socket
    // whenever an action is dispatched.
    const SocketEnhancer = applyMiddleware(({ getState }) => next => action => {
      const state: any = getState();
      const result = next(action);

      if (!blacklistedActions.has(action.type) && action._remote !== true) {
        this.server.send({msgType: 'action', action, _stateID: state._stateID, gameID: this.gameID, playerID: this.playerID});
      }

      return result;
    });

    enhancer = enhancer ? compose(enhancer, SocketEnhancer) : SocketEnhancer;
    this.store = createStore(reducer, enhancer);

    return this.store;
  }
}
