import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { BaseUiModule } from './base-ui/base-ui.module';

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'welcome',
        loadChildren: './welcome/welcome.module#WelcomeModule'
      },
      {
        path: 'play',
        loadChildren: './main/main.module#MainModule'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome',
      }
    ]),

    AuthModule,
    BaseUiModule,
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
