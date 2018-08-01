"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const express = __importStar(require("express"));
const http_1 = require("http");
const base_room_1 = require("./base.room");
const app = express.default();
const server = http_1.createServer(app);
const gameServer = new colyseus_1.Server({
    server
});
gameServer.register('base-room', base_room_1.BaseRoom);
// app.use('/colyseus', cors(), monitor(gameServer));
gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});
const PORT = +(process.env.PORT || 8000);
gameServer.listen(PORT, undefined, undefined, function () {
    console.log('HTTP listening on ', this.address());
});
