"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const core_1 = require("boardgame.io/core");
const tic_tac_toe_1 = require("../src/game-types/tic-tac-toe");
const redux_1 = require("redux");
const get_user_from_token_1 = require("./get-user-from-token");
const game_state_1 = require("./game-state");
// trick to get room's players into boardgame.io's ctx
function ServerTicTacToe(players) {
    this.players = players;
}
ServerTicTacToe.prototype = Object.create(tic_tac_toe_1.TicTacToe);
ServerTicTacToe.prototype.setup = function (ctx) {
    ctx.players = this.players;
    return tic_tac_toe_1.TicTacToe.setup(ctx);
};
class TicTacToeRoom extends colyseus_1.Room {
    async onAuth(options) {
        return { user: options.accessToken ? await get_user_from_token_1.getUserFromToken(options.accessToken) : false };
    }
    onInit(options) {
        console.log('TicTacToeRoom created!');
        this.setSeatReservationTime(10);
        const reducer = core_1.CreateGameReducer({
            game: new ServerTicTacToe(['testing2']),
            numPlayers: 2,
        });
        this.store = redux_1.createStore(reducer);
        this.setState({ bgio: this.store.getState(), game: new game_state_1.GameState() });
    }
    onJoin(client, options, auth) {
        this.state.game.addPlayer(client, auth.user);
        // this.state.createPlayer(client.sessionId);
    }
    onLeave(client) {
        console.log('Leave TicTacToeRoom', client.sessionId);
        // this.state.removePlayer(client.sessionId);
        this.state.game.removePlayer(client);
    }
    onMessage(client, data) {
        console.log('TicTacToeRoom received message from', client.sessionId, ':', data);
        this.store.dispatch(data.action);
        this.state.bgio = this.store.getState();
    }
    onDispose() {
        console.log('Dispose TicTacToeRoom');
    }
}
exports.TicTacToeRoom = TicTacToeRoom;
