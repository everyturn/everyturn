"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const core_1 = require("boardgame.io/core");
const redux_1 = require("redux");
const get_user_from_token_1 = require("./get-user-from-token");
const games_1 = require("../shared/games");
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
class BaseRoom extends colyseus_1.Room {
    onInit({ gameName }) {
        this.setSeatReservationTime(10);
        this.maxClients = 2;
        this.game = games_1.getGameByName(gameName).Game;
        const reducer = core_1.CreateGameReducer({
            game: this.game,
            numPlayers: 2,
        });
        this.store = redux_1.createStore(reducer);
        this.setState({
            bgio: this.store.getState(),
            isReady: false,
            players: [],
        });
    }
    async onAuth(options) {
        return { user: options.accessToken ? await get_user_from_token_1.getUserFromToken(options.accessToken) : false };
    }
    onJoin(client, options, auth) {
        const idx = this.state.players.length.toString();
        client.playerID = idx;
        const player = Object.assign({}, MOCK_PLAYERS[idx], (auth.user ? { profile: auth.user } : {}), { playerID: idx, id: client.sessionId });
        this.state.players.push(player);
        if (this.clients.length === 2) {
            this.state.isReady = true;
            this.lock();
        }
    }
    onMessage(client, data) {
        if (this.state.isReady
            &&
                (data.action.type === 'MAKE_MOVE' && this.game.flow.canPlayerMakeMove(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
                    ||
                        data.action.type === 'GAME_EVENT' && this.game.flow.canPlayerCallEvent(this.state.bgio.G, this.state.bgio.ctx, client.playerID))) {
            // todo if (state._stateID == stateID) ??
            this.store.dispatch(data.action);
            this.state.bgio = this.store.getState();
            // Get clients connected to this current game.
            for (const c of this.clients) {
                const ctx = Object.assign({}, this.state.bgio.ctx, { _random: undefined });
                const newState = Object.assign({}, this.state.bgio, {
                    G: this.game.playerView(this.state.bgio.G, ctx, c.playerID),
                    ctx: ctx,
                });
                this.send(c, { msgType: 'sync', gameID: data.gameID, state: newState });
            }
        }
    }
    onLeave(client) {
        const idx = this.state.players.findIndex(player => player.id === client.sessionId);
        this.state.players = [...this.state.players.slice(0, idx), ...this.state.players.slice(idx + 1)];
        if (this.state.players.length > 0 && this.state.bgio.ctx.gameover === undefined) {
            this.store.dispatch({
                type: 'GAME_EVENT',
                payload: { type: 'endGame', args: { winner: this.state.players[0].playerID } },
            });
            this.state.bgio = this.store.getState();
        }
    }
}
exports.BaseRoom = BaseRoom;
