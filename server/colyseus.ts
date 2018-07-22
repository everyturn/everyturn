import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import * as express from 'express';

import { createServer, Server as HttpServer } from 'http';

import { BaseRoom } from './base.room';

const app = (express as any).default();

const server = createServer(app);
const gameServer = new Server({
  server
});

gameServer.register('base-room', BaseRoom);

// app.use('/colyseus', cors(), monitor(gameServer));

gameServer.onShutdown(function () {
  console.log(`game server is going down.`);
});

const PORT = +(process.env.PORT || 8000);
gameServer.listen(PORT, undefined, undefined, function (this: HttpServer) {
  console.log('HTTP listening on ', this.address());
});
