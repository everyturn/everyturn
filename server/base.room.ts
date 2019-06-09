/* tslint:disable:no-shadowed-variable */
import { Client, FossilDeltaSerializer, Room, serialize } from 'colyseus';
import { CreateGameReducer, InitializeGame } from 'boardgame.io/core';
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

@serialize(FossilDeltaSerializer)
export class BaseRoom extends Room {
  store: any;
  game: any;

  onInit({gameName}: { gameName: string }) {
    this.setSeatReservationTime(10);

    this.maxClients = 2;

    this.game = getGameByName(gameName).Game;
    const reducer = CreateGameReducer({
      game: this.game,
      numPlayers: 2,
    });
    const initialState = InitializeGame({game: this.game, numPlayers: 2, /* setupData */});
    this.store = createStore(reducer, initialState);

    this.setState({
      bgio: this.store.getState(),
      isReady: false,
      players: [],
    });
  }

  async onAuth(options) {
    return {user: options.accessToken ? await getUserFromToken(options.accessToken) : false};
  }

  onJoin(client: Client & { playerID: any }, options: any, auth: { user: false | { nickname: string, picture: string } }) {
    const idx = this.state.players.length.toString();
    client.playerID = idx;
    const player = {...MOCK_PLAYERS[idx], ...(auth.user ? {profile: auth.user} : {}), playerID: idx, id: client.sessionId};
    this.state.players.push(player);

    if (this.clients.length === 2) {
      this.state.isReady = true;

      this.lock();
    }
  }

  onMessage(client: Client & { playerID: any }, data: any) {
    if (this.state.isReady) {
      switch (data.msgType) {
        case 'update':
          if (
            data.action.type === 'MAKE_MOVE' &&
            this.game.flow.canPlayerMakeMove(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
            ||
            data.action.type === 'GAME_EVENT' &&
            this.game.flow.canPlayerCallEvent(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
          ) {
            // Update server's version of the store.
            this.store.dispatch(data.action);
            const bgio = this.store.getState();

            // Get clients connected to this current game.
            for (const c of this.clients) {
              const filteredState = {
                ...bgio,
                G: this.game.playerView(bgio.G, bgio.ctx, (c as any).playerID),
                ctx: {...bgio.ctx, _random: undefined},
                log: undefined,
                deltalog: undefined,
              };

              this.send(c, {msgType: 'update', gameID: data.gameID, state: filteredState, deltalog: bgio.deltalog});
            }
            // TODO: We currently attach the log back into the state
            // object before storing it, but this should probably
            // sit in a different part of the database eventually.
            this.state.bgio = {...bgio, log: bgio.log ? [...bgio.log, ...bgio.deltalog] : bgio.deltalog};
          }
          break;
        case 'sync':
          const bgio = this.store.getState();

          const callerFilteredState = {
            ...bgio,
            G: this.game.playerView(bgio.G, bgio.ctx, client.playerID),
            ctx: {...bgio.ctx, _random: undefined},
            log: undefined,
            deltalog: undefined,
          };

          this.send(client, {
            msgType: 'sync',
            gameID: data.gameID,
            state: callerFilteredState,
            log: bgio.log // todo redactLog
          });

          break;
      }
    }
  }

  onLeave(client: Client, consented: boolean) {
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

  onDispose() {
  }
}
