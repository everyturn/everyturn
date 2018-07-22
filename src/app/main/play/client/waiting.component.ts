import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'et-waiting',
  template: `
    <strong style="color: rgb(250, 79, 79);">Waiting for players</strong>
    <div class="dot-wave">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `,
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent {}
