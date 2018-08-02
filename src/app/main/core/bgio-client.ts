import { Client } from 'boardgame.io/dist/client';
import { Multiplayer } from './multiplayer';

export class BgioClient extends Client {
  createMultiplayerClient(opt: any) {
    return new Multiplayer(opt);
  }
}
