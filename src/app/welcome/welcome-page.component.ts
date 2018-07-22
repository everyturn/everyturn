import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'et-welcome-page',
  template: `
    <div>
      welcome-page works!

      <a routerLink="/app">go to app</a>
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
