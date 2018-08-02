import { Component } from '@angular/core';
import { ColyseusService } from './colyseus.service';
import { AuthService } from '../auth/auth.service';
import { Auth0UserProfile } from 'auth0-js';

@Component({
  template: `
    <div fxLayout="column" style="height: 100%;">
      <span class="wip-label mat-elevation-z2" title="work in progress">Work in Progress</span>
      <mat-toolbar fxFlex="none" class="mat-elevation-z6" style="z-index: 1" fxLayout fxLayoutAlign="start center" fxLayoutGap="16px">
        <span fxFlex="64px"></span>
        <a mat-button disableRipple routerLink="." style="font-variant-caps: small-caps;
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
            <button mat-raised-button (click)="login()" color="accent">Show support by sigining up</button>
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
    .wip-label {
      color: #fff;
      background-color: #17a2b8;
      
      display: inline-block;
      padding: .25em .4em;
      font-size: 75%;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: .25rem;
      letter-spacing: .07em;

      position: absolute;
      width: 184px;
      top: 20px;
      left: -39px;
      z-index: 2;
      transform: rotateZ(-26deg);
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
