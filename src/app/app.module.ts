import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'welcome',
        loadChildren: './welcome/welcome.module#WelcomeModule'
      },
      {
        path: 'app',
        loadChildren: './main/main.module#MainModule'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome',
      }
    ]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
