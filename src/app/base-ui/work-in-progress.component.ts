import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'et-work-in-progress',
  template: '<span class="wip-label mat-elevation-z2" title="work in progress">Work in Progress</span>',
  styles: [`
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
export class WorkInProgressComponent {}
