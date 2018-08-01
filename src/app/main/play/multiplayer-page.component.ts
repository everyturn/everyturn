import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRoom } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
import { ColyseusService } from '../colyseus.service';
import { map } from 'rxjs/operators';
import { TicTacToeBoardComponent } from '../boards/tic-tac-toe-board.component';
import { TicTacToe } from '../../../../shared/games/tic-tac-toe';

@Component({
  template: `
    <et-client
      [isRoomReady]="room?.state.isReady"
      [players]="room?.state.players"
      [board]="BoardComponent"
      [game]="Game"
      [gameID]="room?.id"
      [playerID]="getPlayerId()"
      [multiplayer]="{server: room}"
      [debug]="false"
      [playAgain]="playAgain"
      (leave)="leave()">
    </et-client>
  `,
  styles: []
})
export class MultiplayerPageComponent implements OnInit, OnDestroy {
  room: IRoom;
  BoardComponent: any;
  Game: any;
  playAgain: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private colyseus: ColyseusService,
  ) {
    this.playAgain = () => {
      this.room.onLeave.addOnce(async () => {
        const room = await this.colyseus.joinWhenReady(this.room.name, {
          accessToken: localStorage.getItem('access_token')
        });
        delete this.room;

        this.router.navigate(['..', room.id], {relativeTo: this.route});
      });
      this.room.leave();
    };
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(map(paramMap => this.colyseus.getConnectedRoom(paramMap.get('roomId')) as any as IRoom))
      .subscribe((room?: IRoom) => {
        if (!room) {
          this.router.navigate(['../../lobby'], {relativeTo: this.route});
        } else {
          if (this.room) {
            this.room.leave();
          }
          this.room = room;
          this.BoardComponent = TicTacToeBoardComponent;
          this.Game = TicTacToe;
        }
      });
  }

  leave() {
    this.router.navigate(['../../lobby'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    if (this.room) {
      this.room.leave();
    }
  }

  getPlayerId() {
    if (this.room && this.room.state.players) {
      const player =  this.room.state.players.find(_ => _.id === this.room.sessionId);
      return player && player.playerID;
    }
  }
}

