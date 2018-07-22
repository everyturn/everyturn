import { Component, Input } from '@angular/core';
import { IPlayer } from '../../../types';

export enum PLAYER_STATUS {
  CAN_MOVE = 'CAN_MOVE',
  WAITING = 'WAITING',
  DONE_WINNER = 'DONE_WINNER',
  DONE_INDIFFERENT = 'DONE_INDIFFERENT',
}

@Component({
  selector: 'et-player-list-item',
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.scss']
})
export class PlayerListItemComponent {
  PLAYER_STATUS = PLAYER_STATUS;

  @Input() isMe: boolean;
  @Input() status: PLAYER_STATUS;

  @Input() player: IPlayer;

}
