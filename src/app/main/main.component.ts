import { Component } from '@angular/core';
import { ColyseusService } from './colyseus.service';
import { AuthService } from '../auth/auth.service';
import { Auth0UserProfile } from 'auth0-js';

@Component({
  template: `
    <div fxLayout="column" style="height: 100%;">
      <mat-toolbar fxFlex="none" class="mat-elevation-z6" style="z-index: 1" fxLayout fxLayoutAlign="start center" fxLayoutGap="16px">
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
        <span fxFlex></span>
        <ng-container [ngSwitch]="auth.isAuthenticated()">
          <ng-container *ngSwitchCase="false">
            <span>Hello stranger!</span>
            <button mat-raised-button (click)="login()" color="accent">Login for more fun</button>
          </ng-container>
          <ng-container *ngSwitchCase="true">
            <span [ngSwitch]="!!profile" fxLayout fxLayoutAlign="start center" fxLayoutGap="16px">
              <ng-container *ngSwitchCase="true">
                <span fxLayout fxLayoutAlign="start center" fxLayoutGap="8px">
                  <img [src]="profile?.picture" height="32px" width="32px" style="border-radius: 50%; border: 2px solid white;">
                  <span>Hello {{profile?.nickname}}!</span>
                </span>
                <button mat-stroked-button (click)="logout()">Logout</button>
              </ng-container>
              <ng-container *ngSwitchCase="false">Loading profile...</ng-container>
            </span>
            <span></span>
          </ng-container>
        </ng-container>
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
      margin-top: 3px;
      animation: 6s ease-out infinite opacityPulse;
      opacity: 1;
    }
  `]
})
export class MainComponent {
  profile: Auth0UserProfile;

  constructor(public auth: AuthService, public colyseus: ColyseusService) {
    if (auth.isAuthenticated()) {

      auth.scheduleRenewal(); // todo move this somewhere higher

      this.auth.getProfile().then((profile) => {
        this.profile = profile;
      });
    }
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
