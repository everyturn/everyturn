import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'et-welcome-page',
  template: `    
    <div style="padding: 30px;" fxFlexFill fxLayout fxLayoutAlign="center">
      <span class="mat-headline">A welcome/landing page will soon be here. For now just go directly <a routerLink="/play">to the app</a>!</span>
    </div>
  `,
  styles: []
})
export class WelcomePageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
