import { Component, Input } from '@angular/core';
import { IPlayer } from '../../../types';
import { PLAYER_STATUS } from './player-list-item.component';

@Component({
  selector: 'et-player-list',
  template: `
    <mat-list dense style="margin-right: 2px;">
      <h3 matSubheader>Players</h3>
      <et-player-list-item *ngFor="let player of players"
                           [status]="getPlayerStatus(player)"
                           [isMe]="player.playerID === playerID"
                           [player]="player"></et-player-list-item>
    </mat-list>
  `,
})
export class PlayerListComponent {
  @Input() players: IPlayer[];
  @Input() canPlayerMakeMove: (playerID: string) => boolean;

  @Input() playerID: string;
  @Input() gameover?: {winner?: string, draw?: true};

  getPlayerStatus(player: IPlayer) {
    return this.gameover != null
      ? (this.gameover.winner === player.playerID ? PLAYER_STATUS.DONE_WINNER : PLAYER_STATUS.DONE_INDIFFERENT)
      : (this.canPlayerMakeMove(player.playerID) ? PLAYER_STATUS.CAN_MOVE : PLAYER_STATUS.WAITING);
  }

}
