import { InjectionToken } from '@angular/core';
import { Signal } from '@gamestdio/signals';

export interface IProfile {
  nickname: string;
  picture: string;
}

export interface IPlayer {
  id: string;
  playerID: string;
  color: string;
  profile: IProfile;
}

interface IGameContext {
  gameover: any;
}

export interface IGameState<T = any> {
  G: T;
  ctx: IGameContext;
}

export interface IGameFlow<T = any> {
  canPlayerMakeMove(G: T, ctx: IGameContext, playerID: string): boolean;
}

export interface IGame<T = any> {
  name: string;
  flow: IGameFlow<T>;
}

export interface IRoomState<T> {
  players: IPlayer[];
  isReady: boolean;

  bgio: IGameState<T>;
}

export interface IRoom<T = any> {
  id: string;
  sessionId: string;
  name: string;
  state: IRoomState<T>;
  onLeave: Signal;

  send(message: any): void;
  leave(): void;
}

export const ROOM_TOKEN = new InjectionToken<IRoom>('ROOM');

export const GAME_TOKEN = new InjectionToken<any>('GAME');
