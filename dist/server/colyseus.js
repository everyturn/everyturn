"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const colyseus_1 = require("colyseus");
// import { monitor } from '@colyseus/monitor';
// import socialRoutes from '@colyseus/social/express';
const base_room_1 = require("./base.room");
const port = Number(process.env.PORT || 8000);
const app = express_1.default();
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({ server });
// register your room handlers
gameServer.register('base-room', base_room_1.BaseRoom);
// register @colyseus/social routes
// app.use('/', socialRoutes);
// register colyseus monitor AFTER registering your room handlers
// app.use('/colyseus', monitor(gameServer));
gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
