import { Room } from 'colyseus';
import { CreateGameReducer } from 'boardgame.io/core';
import { createStore } from 'redux';
import { getUserFromToken } from './get-user-from-token';
import { getGameByName } from '../shared/games';

const MOCK_PLAYERS = [
  {
    profile: {
      nickname: 'Player 1',
      picture: 'https://api.adorable.io/avatars/162/itsME@adorable.png',
    },
    color: 'rgb(102,127,203)',
  },
  {
    profile: {
      nickname: 'Player 2',
      picture: 'https://api.adorable.io/avatars/162/John@adorable.png',
    },
    color: 'rgb(234, 123, 123)',
  }
];

export class BaseRoom extends Room {
  store: any;
  game: any;

  onInit({gameName}: {gameName: string}) {
    this.setSeatReservationTime(10);

    this.maxClients = 2;

    this.game = getGameByName(gameName).Game;
    const reducer = CreateGameReducer({
      game: this.game,
      numPlayers: 2,
    });
    this.store = createStore(reducer);

    this.setState({
      bgio: this.store.getState(),
      isReady: false,
      players: [],
    });
  }

  async onAuth(options) {
    return {user: options.accessToken ? await getUserFromToken(options.accessToken) : false};
  }

  onJoin(client, options: any, auth: {user: false | {nickname: string, picture: string}}) {
    const idx = this.state.players.length.toString();
    client.playerID = idx;
    const player = {...MOCK_PLAYERS[idx], ...(auth.user ? {profile: auth.user} : {}), playerID: idx, id: client.sessionId};
    this.state.players.push(player);

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
        data.action.type === 'MAKE_MOVE' && this.game.flow.canPlayerMakeMove(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
        ||
        data.action.type === 'GAME_EVENT' && this.game.flow.canPlayerCallEvent(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
      )
    ) {

      // todo if (state._stateID == stateID) ??
      this.store.dispatch(data.action);
      this.state.bgio = this.store.getState();

      // Get clients connected to this current game.
      for (const c of this.clients) {
        const ctx = Object.assign({}, this.state.bgio.ctx, { _random: undefined });
        const newState = Object.assign({}, this.state.bgio, {
          G: this.game.playerView(this.state.bgio.G, ctx, (c as any).playerID),
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
