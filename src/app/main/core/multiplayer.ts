import { applyMiddleware, compose, createStore } from 'redux';
import * as ActionCreators from './action-creators';

/**
 * Multiplayer
 *
 * Handles all the multiplayer interactions on the client-side.
 */
export class Multiplayer {
  gameID: string;
  playerID: string | null;
  gameName: any;
  numPlayers: any;
  server: any;

  isConnected: any;
  store: any;
  callback: () => any;

  /**
   * Creates a new Mutiplayer instance.
   * @param {string} gameID - The game ID to connect to.
   * @param {string} playerID - The player ID associated with this client.
   * @param {string} gameName - The game type (the `name` field in `Game`).
   * @param {string} numPlayers - The number of players.
   * @param {string} server - The game server in the form of 'hostname:port'. Defaults to the server serving the client if not provided.
   */
  constructor({
                gameID,
                playerID,
                gameName,
                numPlayers,
                server,
     }: {
      gameID?: string;
      playerID?: string;
      gameName?: any;
      numPlayers?: any;
      server?: any;
    } = {}) {
    this.server = server;
    this.gameName = gameName || 'default';
    this.gameID = gameID || 'default';
    this.playerID = playerID || null;
    this.numPlayers = numPlayers || 2;
    this.gameID = this.gameName + ':' + this.gameID;
    this.isConnected = false;
    this.callback = () => {};
  }

  /**
   * Creates a Redux store with some middleware that sends actions
   * to the server whenever they are dispatched.
   * @param {function} reducer - The game reducer.
   * @param {function} enhancer - optional enhancer to apply to Redux store
   */
  createStore(reducer, enhancer) {
    this.store = null;

    // Redux middleware to emit a message on a socket
    // whenever an action is dispatched.
    const SocketEnhancer = applyMiddleware(({getState}) => next => action => {
      const state: any = getState();
      const result = next(action);

      // noinspection TsLint
      if (action.clientOnly != true) {
        this.server.send({
           msgType: 'update',
           action,
           _stateID: state._stateID,
           gameID: this.gameID,
           playerID: this.playerID
        });
      }

      return result;
    });

    enhancer = enhancer ? compose(enhancer, SocketEnhancer) : SocketEnhancer;
    this.store = createStore(reducer, enhancer);

    return this.store;
  }

  /**
   * Connect to the server.
   */
  connect() {
    this.server.onMessage.add((message) => {
      switch (message.msgType) {
        case 'update':
          const currentState = this.store.getState();

          // noinspection TsLint
          if (message.gameID == this.gameID && message.state._stateID >= currentState._stateID) {
            const action = ActionCreators.update(message.state, message.deltalog);
            this.store.dispatch(action);
          }
          break;
        case 'sync':
          // noinspection TsLint
          if (message.gameID == this.gameID) {
            const action = ActionCreators.sync(message.state, message.log);
            this.store.dispatch(action);
          }
          break;
      }
    });

    // // Initial sync to get game state.
    // this.socket.emit('sync', this.gameID, this.playerID, this.numPlayers);
    //
    // // Keep track of connection status.
    // this.socket.on('connect', () => {
    //   this.isConnected = true;
    //   this.callback();
    // });
    // this.socket.on('disconnect', () => {
    //   this.isConnected = false;
    //   this.callback();
    // });
  }

  /**
   * Subscribe to connection state changes.
   */
  subscribe(fn) {
    this.callback = fn;
  }

  /**
   * Updates the game id.
   * @param {string} id - The new game id.
   */
  updateGameID(id) {
    this.gameID = this.gameName + ':' + id;

    const action = ActionCreators.reset();
    this.store.dispatch(action);

    // if (this.socket) {
    //   this.socket.emit('sync', this.gameID, this.playerID, this.numPlayers);
    // }
  }

  /**
   * Updates the player associated with this client.
   * @param {string} id - The new player id.
   */
  updatePlayerID(id) {
    this.playerID = id;

    const action = ActionCreators.reset();
    this.store.dispatch(action);

    // if (this.socket) {
    //   this.socket.emit('sync', this.gameID, this.playerID, this.numPlayers);
    // }
  }
}
