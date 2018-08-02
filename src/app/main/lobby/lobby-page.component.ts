import { Component, OnInit } from '@angular/core';
import { fadeInUp } from '../animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ColyseusService } from '../colyseus.service';
import { getAllGames } from '../../../../shared/games';

@Component({
  animations: [fadeInUp],
  template: `
    <section fxLayout fxFlexFill fxLayoutAlign="center center">
      <div style="min-height: 80%">
        <div fxLayout="column" fxLayoutAlign="start center" class="mat-elevation-z8"
             style="background-color: white; border: 4px dashed #fa4f4f; padding: 16px 32px 38px 32px;" @fadeInUp>
          <h4>Checkout Our games</h4>
          <div fxLayout fxLayoutAlign="space-between center" fxLayoutGap="26px" *ngFor="let gameRecord of gameRecords">
            <span style="">{{gameRecord.Game.name}}</span>
            <button mat-stroked-button (click)="play(gameRecord.Game.name)" [disabled]="!colyseus.isReady">
              {{colyseus.isReady ? 'Multiplayer' : "Sorry, can't play while server is down"}}
            </button>
            <button mat-stroked-button (click)="playSingleplayer(gameRecord.Game.name)">
              Single Player
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LobbyPageComponent {
  gameRecords = getAllGames();

  constructor(private router: Router, private route: ActivatedRoute, public colyseus: ColyseusService) {
  }

  async play(gameName: string) {
    const room = await this.colyseus.joinWhenReady('base-room', {
      accessToken: localStorage.getItem('access_token'),
      gameName,
    });

    this.router.navigate([gameName, 'rooms', room.id], {relativeTo: this.route});
  }

  playSingleplayer(gameName: string) {
    this.router.navigate([gameName, 'singleplayer'], {relativeTo: this.route});
  }
}
