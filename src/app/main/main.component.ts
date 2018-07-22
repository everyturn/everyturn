import { Component } from '@angular/core';
import { ColyseusService } from './colyseus.service';

@Component({
  template: `
    <div fxLayout="column" style="height: 100%;">
      <mat-toolbar fxFlex="none" class="mat-elevation-z6" style="z-index: 1" fxLayout fxLayoutAlign="space-between center">
        <a mat-button disableRipple routerLink="./lobby" style="font-variant-caps: small-caps;
                                                  font-weight: bold;
                                                  letter-spacing: 0.23em;
                                                  font-size: 1.22em;
                                                  color: #2583b9;">
          EveryTurn
        </a>
        <mat-icon [title]="colyseus.readyState" class="not_connected" *ngIf="!colyseus.isReady">
          cloud_off
        </mat-icon>
      </mat-toolbar>
      <div fxFlex style="min-width: 100%;
                         overflow-x: auto;
                         /*noinspection CssUnknownTarget*/
                         background-image: url('/assets/background.png');
                         background-size: cover;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .not_connected {
      color: #357cb2;
      animation: 6s ease-out infinite opacityPulse;
      opacity: 1;
    }
  `]
})
export class MainComponent {
  constructor(public colyseus: ColyseusService) {
  }
}
