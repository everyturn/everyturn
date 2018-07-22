import { Room } from 'colyseus';
import { CreateGameReducer } from 'boardgame.io/core';
import { createStore } from 'redux';
import { TicTacToe as game } from '../src/game-types/tic-tac-toe';

const MOCK_PLAYERS = [
  {
    profile: {
      nickname: 'itsME',
      picture: 'https://api.adorable.io/avatars/162/itsME@adorable.png',
    },
    color: 'rgb(102,127,203)',
  },
  {
    profile: {
      nickname: 'JohnJohn',
      picture: 'https://api.adorable.io/avatars/162/John@adorable.png',
    },
    color: 'rgb(234, 123, 123)',
  }
];

export class BaseRoom extends Room {
  store: any;

  onInit() {
    this.maxClients = 2;

    const reducer = CreateGameReducer({
      game,
      numPlayers: 2,
    });
    this.store = createStore(reducer);

    this.setState({
      bgio: this.store.getState(),
      isReady: false,
      players: [],
    });
  }

  onJoin(client) {
    const idx = this.state.players.length.toString();
    client.playerID = idx;
    this.state.players.push({...MOCK_PLAYERS[idx], playerID: idx, id: client.sessionId});

    if (this.clients.length === 2) {
      this.state.isReady = true;

      this.lock();
    }
  }

  onMessage(client, data) {
    if (
      this.state.isReady
      &&
      (
        data.action.type === 'MAKE_MOVE' && game.flow.canPlayerMakeMove(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
        ||
        data.action.type === 'GAME_EVENT' && game.flow.canPlayerCallEvent(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
      )
    ) {

      // todo if (state._stateID == stateID) ??
      this.store.dispatch(data.action);
      this.state.bgio = this.store.getState();

      // Get clients connected to this current game.
      for (const c of this.clients) {
        const ctx = Object.assign({}, this.state.bgio.ctx, { _random: undefined });
        const newState = Object.assign({}, this.state.bgio, {
          G: game.playerView(this.state.bgio.G, ctx, (c as any).playerID),
          ctx: ctx,
        });

        this.send(c, {msgType: 'sync', gameID: data.gameID, state: newState});
      }
    }
  }

  onLeave(client) {
    const idx = this.state.players.findIndex(player => player.id === client.sessionId);
    this.state.players = [...this.state.players.slice(0, idx), ...this.state.players.slice(idx + 1)];

    if (this.state.players.length > 0 && this.state.bgio.ctx.gameover === undefined) {
      this.store.dispatch({
        type: 'GAME_EVENT',
        payload: {type: 'endGame', args: {winner: this.state.players[0].playerID}},
      });
      this.state.bgio = this.store.getState();
    }
  }
}
