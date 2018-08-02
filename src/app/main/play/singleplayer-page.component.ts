import { Component } from '@angular/core';
import { CreateGameReducer } from 'boardgame.io/dist/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getGameByName } from '../../../../shared/games';
import { getGameBoardByName } from '../boards/boards.module';

const MOCK_ROOM = {
  state: {
    isReady: true,
    players: [
      {
        playerID: '0',
        profile: {
          nickname: 'Player 1',
          picture: 'https://api.adorable.io/avatars/162/itsME@adorable.png',
        },
        color: 'rgb(102,127,203)',
      },
      {
        playerID: '1',
        profile: {
          nickname: 'ai',
          picture: 'https://api.adorable.io/avatars/162/itsME2@adorable.png',
        },
        color: 'rgb(234, 123, 123)',
      }
    ]
  },
};

@Component({
  template: `
    <ng-container [ngSwitch]="!!Game">
      <div class="mat-headline" fxLayout fxLayoutAlign="center center" style="color: white;"fxFlexFill *ngSwitchCase="false">
        Game Not Found
      </div>
      <et-client *ngSwitchCase="true"
                 [isRoomReady]="room.state.isReady"
                 [players]="room.state.players"
                 [board]="BoardComponent"
                 [game]="Game"
                 [ai]="ai"
                 gameID="gameID"
                 playerID="0"
                 (leave)="leave()"></et-client>
    </ng-container>
  `,
})
export class SingleplayerPageComponent {
  room = MOCK_ROOM;
  BoardComponent;
  Game;
  ai;

  constructor(private route: ActivatedRoute, private router: Router) {
    route.paramMap.subscribe(paramMap => {
      const gameName = paramMap.get('gameName');

      const gameRecord = getGameByName(gameName);
      if (gameRecord) {
        this.Game = gameRecord.Game;
        this.ai = gameRecord.ai;
        this.BoardComponent = getGameBoardByName(gameName);
      }
    });
  }

  leave() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }
}
