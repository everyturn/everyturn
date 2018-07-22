import { Component, OnInit } from '@angular/core';
import { fadeInUp } from '../animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ColyseusService } from '../colyseus.service';

@Component({
  animations: [fadeInUp],
  template: `
    <section fxLayout fxFlexFill fxLayoutAlign="center center">
      <div style="min-height: 80%">
        <div fxLayout="column" fxLayoutAlign="start center" class="mat-elevation-z8"
             style="background-color: white; border: 4px dashed #fa4f4f; padding: 16px 32px 38px 32px;" @fadeInUp>
          <h4>Checkout Our games</h4>
          <div fxLayout fxLayoutAlign="space-between center" fxLayoutGap="26px">
            <span style="">Tic Tac Toe</span>
            <button mat-stroked-button (click)="play()" [disabled]="!colyseus.isReady">
              {{colyseus.isReady ? 'Multiplayer' : "Sorry, can't play while server is down"}}
            </button>
            <button mat-stroked-button (click)="playSinglePlayer()">
              Single Player
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LobbyPageComponent {
  constructor(private router: Router, private route: ActivatedRoute, public colyseus: ColyseusService) {
  }

  async play() {
    const room = await this.colyseus.joinWhenReady('base-room');

    this.router.navigate(['../rooms', room.id], {relativeTo: this.route});
  }

  playSinglePlayer() {
    this.router.navigate(['../singleplayer'], {relativeTo: this.route});
  }
}
