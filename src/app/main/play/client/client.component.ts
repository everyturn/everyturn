import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPlayer } from '../../types';
import { fadeInUp } from '../../animations';
import { _ClientImpl, Client } from 'boardgame.io/dist/client';
import { applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { Multiplayer } from '../../core/multiplayer';

@Component({
  selector: 'et-client',
  animations: [fadeInUp],
  template: `
    <mat-drawer-container style="height: 100%; background-color: transparent;">
      <mat-drawer #drawer mode="side" position="end" class="mat-elevation-z4" style="width: 200px;">
        <et-debug (close)="drawer.close()" (step)="client.step()"></et-debug>
      </mat-drawer>

      <mat-drawer-content>

        <div fxLayout fxFlexFill fxLayoutAlign="center center">

          <et-room @fadeInUp *ngIf="game"
                   [gameState]="client?.getState()"
                   [game]="game"

                   [isRoomReady]="isRoomReady"
                   [players]="players"
                   [playerID]="playerID"

                   [board]="board"
                   [getBoardInputs]="getBoardInputs"

                   (leave)="leave.emit()"
                   [debug]="debug"
                   (toggleDebug)="drawer.toggle()"
                   (playAgain)="playAgain()"
          >
          </et-room>
        </div>

      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class ClientComponent implements OnChanges {

  // class inputs (possible move to higher level initialization (e.g., class factory)
  @Input() game: any;
  @Input() numPlayers: number;
  @Input() board: any;
  @Input() multiplayer: any;
  @Input() ai: any;

  // instance inputs
  @Input() gameID = 'default'; // TODO this
  @Input() playerID: string = null;
  @Input() credentials: string = null; // TODO this

  @Input() isRoomReady: boolean;
  @Input() players: IPlayer[];
  @Input() debug = true;

  @Output() leave = new EventEmitter<never>();

  client: _ClientImpl;

  @Input() playAgain = () => {
    this.client.reset();
  }

  constructor() {
    // enable passing getBoardInputs as reference
    this.getBoardInputs = this.getBoardInputs.bind(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isRoomReady) {
      if (changes.isRoomReady.currentValue) {
        const clientOpt: any = {
          game: this.game,
          ai: this.ai,
          numPlayers: this.numPlayers,
          gameID: this.gameID,
          playerID: this.playerID,
          credentials: this.credentials,
          enhancer: this.ai ? applyMiddleware(logger, store => next => action => {
            next(action);
            const state = store.getState() as any;
            if (state.ctx.currentPlayer === '1') {
              setTimeout(() => {
                this.client.step();
              }, 300);
            }
          }) : applyMiddleware(logger),
        };
        if (this.multiplayer) {
          // todo refactor this after boardgame.io has cleaner transport API
          const server = this.multiplayer.server;
          clientOpt.multiplayer = {
            transport: class {
              constructor(opt) {
                return new Multiplayer({...opt, server});
              }
            }
          }
        }
        this.client = Client(clientOpt);

        // todo is this needed? (forceUpdate on react)
        // this.client.subscribe(() => {
        //   console.log('client.subscribe triggered (forceUpdate needed?)');
        // });

        this.client.connect();
      }
    }

    if (this.client) {
      if (changes.gameID && changes.gameID.currentValue !== changes.gameID.previousValue) {
        this.client.updateGameID(changes.gameID.currentValue);
      }
      if (changes.playerID && changes.playerID.currentValue !== changes.playerID.previousValue) {
        this.client.updatePlayerID(changes.playerID.currentValue);
      }
      if (changes.credentials && changes.credentials.currentValue !== changes.credentials.previousValue) {
        this.client.updateCredentials(changes.credentials.currentValue);
      }
    }
  }

  getBoardInputs() {
    const state = this.client.getState();
    return {
      ...state,
      // isMultiplayer: this.multiplayer !== undefined, // should not be used when we have room component
      moves: this.client.moves,
      events: this.client.events,
      gameID: this.gameID,
      playerID: this.playerID,
      reset: this.client.reset,
      undo: this.client.undo,
      redo: this.client.redo,
    };
  }
}
