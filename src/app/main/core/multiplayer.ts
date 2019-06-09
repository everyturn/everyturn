/* tslint:disable:no-redundant-jsdoc triple-equals no-shadowed-variable */
/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

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
   * @param store
   * @param {string} gameID - The game ID to connect to.
   * @param {string} playerID - The player ID associated with this client.
   * @param {string} gameName - The game type (the `name` field in `Game`).
   * @param {string} numPlayers - The number of players.
   * @param {string} server - The game server in the form of 'hostname:port'. Defaults to the server serving the client if not provided.
   */
  constructor({
                store,
                gameID,
                playerID,
                gameName,
                numPlayers,
                server,
              }: {
    store?: any,
    gameID?: string;
    playerID?: string;
    gameName?: any;
    numPlayers?: any;
    server?: any;
  } = {}) {
    this.server = server;
    this.store = store;
    this.gameName = gameName || 'default';
    this.gameID = gameID || 'default';
    this.playerID = playerID || null;
    this.numPlayers = numPlayers || 2;
    this.gameID = this.gameName + ':' + this.gameID;
    this.isConnected = false;
    this.callback = () => {};
  }

  /**
   * Called when an action that has to be relayed to the
   * game master is made.
   */
  onAction(state, action) {
    this.server.send({
      msgType: 'update',
      action,
      _stateID: state._stateID,
      gameID: this.gameID,
      playerID: this.playerID
    });
  }

  /**
   * Connect to the server.
   */
  connect() {
    this.server.onMessage.add((message) => {
      switch (message.msgType) {
        case 'update':
          // Called when another player makes a move and the
          // master broadcasts the update to other clients (including
          // this one).

          const currentState = this.store.getState();

          if (message.gameID == this.gameID && message.state._stateID >= currentState._stateID) {
            const action = ActionCreators.update(message.state, message.deltalog);
            this.store.dispatch(action);
          }
          break;
        case 'sync':
          // Called when the client first connects to the master
          // and requests the current game state.

          if (message.gameID == this.gameID) {
            const action = ActionCreators.sync(message.state, message.log);
            this.store.dispatch(action);
          }
          break;
      }
    });

    // Initial sync to get game state.
    this.server.send({
      msgType: 'sync',
      gameID: this.gameID,
      playerID: this.playerID
    });
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

    const action = ActionCreators.reset(null);
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

    const action = ActionCreators.reset(null);
    this.store.dispatch(action);

    // if (this.socket) {
    //   this.socket.emit('sync', this.gameID, this.playerID, this.numPlayers);
    // }
  }
}
