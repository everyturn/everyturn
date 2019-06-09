import http from 'http';
import express from 'express';
import { Server } from 'colyseus';
// import { monitor } from '@colyseus/monitor';
// import socialRoutes from '@colyseus/social/express';

import { BaseRoom } from './base.room';

const port = Number(process.env.PORT || 8000);
const app = express();

const server = http.createServer(app);
const gameServer = new Server({server});

// register your room handlers
gameServer.register('base-room', BaseRoom);

// register @colyseus/social routes
// app.use('/', socialRoutes);

// register colyseus monitor AFTER registering your room handlers
// app.use('/colyseus', monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
