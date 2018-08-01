"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(profile) {
        this.profile = profile;
    }
}
exports.Player = Player;
class GameState {
    constructor() {
        this.players = {};
    }
    addPlayer(client, user) {
        if (user) {
            this.players[user.sub] = new Player({ nickname: user.nickname, picture: user.picture });
        }
        else {
            this.players[client.id] = new Player();
        }
    }
    removePlayer(client) {
        delete this.players[client.sessionId];
    }
}
exports.GameState = GameState;
