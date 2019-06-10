"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-shadowed-variable */
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
let BaseRoom = class BaseRoom extends colyseus_1.Room {
    onInit({ gameName }) {
        this.setSeatReservationTime(10);
        this.maxClients = 2;
        this.game = games_1.getGameByName(gameName).Game;
        const reducer = core_1.CreateGameReducer({
            game: this.game,
            numPlayers: 2,
        });
        const initialState = core_1.InitializeGame({ game: this.game, numPlayers: 2, });
        this.store = redux_1.createStore(reducer, initialState);
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
        if (this.state.isReady) {
            switch (data.msgType) {
                case 'update':
                    if (data.action.type === 'MAKE_MOVE' &&
                        this.game.flow.canPlayerMakeMove(this.state.bgio.G, this.state.bgio.ctx, client.playerID)
                        ||
                            data.action.type === 'GAME_EVENT' &&
                                this.game.flow.canPlayerCallEvent(this.state.bgio.G, this.state.bgio.ctx, client.playerID)) {
                        // Update server's version of the store.
                        this.store.dispatch(data.action);
                        const bgio = this.store.getState();
                        // Get clients connected to this current game.
                        for (const c of this.clients) {
                            const filteredState = Object.assign({}, bgio, { G: this.game.playerView(bgio.G, bgio.ctx, c.playerID), ctx: Object.assign({}, bgio.ctx, { _random: undefined }), log: undefined, deltalog: undefined });
                            this.send(c, { msgType: 'update', gameID: data.gameID, state: filteredState, deltalog: bgio.deltalog });
                        }
                        // TODO: We currently attach the log back into the state
                        // object before storing it, but this should probably
                        // sit in a different part of the database eventually.
                        this.state.bgio = Object.assign({}, bgio, { log: bgio.log ? [...bgio.log, ...bgio.deltalog] : bgio.deltalog });
                    }
                    break;
                case 'sync':
                    const bgio = this.store.getState();
                    const callerFilteredState = Object.assign({}, bgio, { G: this.game.playerView(bgio.G, bgio.ctx, client.playerID), ctx: Object.assign({}, bgio.ctx, { _random: undefined }), log: undefined, deltalog: undefined });
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
    onLeave(client, consented) {
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
    onDispose() {
    }
};
BaseRoom = __decorate([
    colyseus_1.serialize(colyseus_1.FossilDeltaSerializer)
], BaseRoom);
exports.BaseRoom = BaseRoom;
