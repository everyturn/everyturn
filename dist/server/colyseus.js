"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const tic_tac_toe_room_1 = require("./tic-tac-toe.room");
const base_room_1 = require("./base.room");
const app = express_1.default();
const server = http_1.createServer(app);
const gameServer = new colyseus_1.Server({
    server
});
gameServer.register('tic-tac-toe', tic_tac_toe_room_1.TicTacToeRoom);
gameServer.register('base-room', base_room_1.BaseRoom);
// app.use('/colyseus', cors(), monitor(gameServer));
gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});
const PORT = +(process.env.PORT || 8000);
gameServer.listen(PORT, undefined, undefined, function () {
    console.log('HTTP listening on ', this.address());
});
