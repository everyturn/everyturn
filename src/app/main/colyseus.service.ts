import { Injectable, OnDestroy } from '@angular/core';
import { Client as ColyseusClient, Room } from 'colyseus.js';
import { SERVER_ORIGIN } from './app-config';
import { AuthService } from '../auth/auth.service';

export enum CONNECTION_STATUS {
  DISCONNECTED = 'DISCONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  UNKNOWN = 'UNKNOWN',
}

@Injectable({
  providedIn: 'root',
})
export class ColyseusService extends ColyseusClient implements OnDestroy {
  constructor(private auth: AuthService) {
    super(SERVER_ORIGIN);
  }

  get readyState(): CONNECTION_STATUS {
    return {
      [WebSocket.CLOSED]: CONNECTION_STATUS.DISCONNECTED,
      [WebSocket.CLOSING]: CONNECTION_STATUS.DISCONNECTING,
      [WebSocket.CONNECTING]: CONNECTION_STATUS.CONNECTING,
      [WebSocket.OPEN]: CONNECTION_STATUS.CONNECTED,
    }[this.connection.readyState] || CONNECTION_STATUS.UNKNOWN;
  }

  get isReady() {
    return this.connection.readyState === WebSocket.OPEN;
  }

  getConnectedRoom(roomId: string): Room | undefined {
    return this.rooms[roomId];
  }

  protected joinPromise(roomId: string, options: {accessToken?: string, gameName: string}): Promise<Room> {
    return new Promise((resolve, reject) => {
      const room = this.join(roomId, options);
      room.onJoin.addOnce(() => {
        resolve(room);
      });
      room.onError.addOnce((error) => {
        reject(error);
      });
    });
  }

  protected joinWhenReady(roomId: string, options: {accessToken?: string, gameName: string}): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        this.onOpen.addOnce(() => {
          resolve(this.joinPromise(roomId, options));
        });
        this.onError.addOnce((error) => {
          reject(error);
        });
      } else {
        resolve(this.joinPromise(roomId, options));
      }
    });
  }

  createGameRoom(gameName: string) {
    const opt: any = {gameName};
    const accessToken = this.auth.getAccessToken();
    if (accessToken) {
      // we can't just {gameName, accessToken: this.auth.getAccessToken()}
      // because colyseus+msgPack will serialize 'undefined' as string
      opt.accessToken = accessToken;
    }
    return this.joinWhenReady('base-room', opt);
  }

  ngOnDestroy() {
    this.close();
  }
}
