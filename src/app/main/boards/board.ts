import { Input } from '@angular/core';

export abstract class Board<T, U> {
  @Input() G: T;
  @Input() ctx: any;

  @Input() moves: U;
  @Input() events: any;

  @Input() playerID: string;
  @Input() isActive: boolean;

  // @Input() isMultiplayer: boolean;
  // @Input() isConnected: boolean;
}
