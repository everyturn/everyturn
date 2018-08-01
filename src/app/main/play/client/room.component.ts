import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IGame, IGameState, IPlayer } from '../../types';
import { fadeIn } from '../../animations';

@Component({
  selector: 'et-room',
  animations: [fadeIn],
  templateUrl: './room.component.html',
})

export class RoomComponent {
  @Input() gameState: IGameState;

  @Input() game: IGame;

  // room state
  @Input() isRoomReady: boolean;
  @Input() playerID: string = null;
  @Input() players: IPlayer[];


  @Output() leave = new EventEmitter<never>();
  @Output() toggleDebug = new EventEmitter<never>();
  @Output() playAgain = new EventEmitter<never>();

  // board view
  @Input() board: any;
  @Input() getBoardInputs: () => any;

  @Input() debug: boolean;

  canPlayerMakeMove = (playerID: string) => {
    return this.isRoomReady && this.game.flow.canPlayerMakeMove(this.gameState.G, this.gameState.ctx, playerID);
  };

  isDone() {
    return this.gameState.ctx.gameover !== undefined;
  }

  getWinnerNickName() {
    const winner = this.players.find(player => player.playerID === this.gameState.ctx.gameover.winner);
    return winner.profile.nickname;
  }
}
