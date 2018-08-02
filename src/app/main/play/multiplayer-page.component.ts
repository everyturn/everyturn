import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRoom } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
import { ColyseusService } from '../colyseus.service';
import { map } from 'rxjs/operators';
import { getGameByName } from '../../../../shared/games';
import { getGameBoardByName } from '../boards/boards.module';

@Component({
  template: `
    <ng-container [ngSwitch]="!!Game">
      <div class="mat-headline" fxLayout fxLayoutAlign="center center" style="color: white;"fxFlexFill *ngSwitchCase="false">
        Game Not Found
      </div>
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
    </ng-container>
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
        const room = await this.colyseus.createGameRoom(this.Game.name);

        delete this.room;

        this.router.navigate(['..', room.id], {relativeTo: this.route});
      });
      this.room.leave();
    };
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(map(paramMap => [this.colyseus.getConnectedRoom(paramMap.get('roomId')) as any as IRoom, paramMap.get('gameName')]))
      .subscribe(([room, gameName]: [IRoom, string]) => {
        if (!room) {
          this.router.navigate(['../../..'], {relativeTo: this.route});
        } else {
          if (this.room) {
            this.room.leave();
          }
          this.room = room;

          const gameRecord = getGameByName(gameName);
          if (gameRecord) {
            this.Game = gameRecord.Game;
            this.BoardComponent = getGameBoardByName(gameName);
          }
        }
      });
  }

  leave() {
    this.router.navigate(['../../..'], {relativeTo: this.route});
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

