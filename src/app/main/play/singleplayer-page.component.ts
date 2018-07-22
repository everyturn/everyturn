import { Component } from '@angular/core';
import { CreateGameReducer } from 'boardgame.io/dist/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ai, TicTacToe } from '../../../game-types/tic-tac-toe';
import { TicTacToeBoardComponent } from '../boards/tic-tac-toe-board.component';
import { AI } from 'boardgame.io/ai';

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
        color: 'rgb(102,127,203)',
      }
    ]
  },
};

@Component({
  template: `
    <et-client [isRoomReady]="room.state.isReady"
               [players]="room.state.players"
               [board]="BoardComponent"
               [game]="Game"
               [ai]="ai"
               gameID="gameID"
               playerID="0"
               (leave)="leave()"></et-client>
  `,
})
export class SingleplayerPageComponent {

  room = MOCK_ROOM;
  BoardComponent = TicTacToeBoardComponent;
  Game = TicTacToe;
  ai = ai;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  leave() {
    this.router.navigate(['../lobby'], {relativeTo: this.route});
  }
}
