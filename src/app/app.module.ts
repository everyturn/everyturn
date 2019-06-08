import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { WelcomePageComponent } from './base-ui/welcome-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { WorkInProgressComponent } from './base-ui/work-in-progress.component';

@NgModule({
  declarations: [
    RootComponent,
    WelcomePageComponent,
    WorkInProgressComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: WelcomePageComponent,
      },
      {
        path: 'play',
        loadChildren: './main/main.module#MainModule'
      },
      {
        path: 'documentation',
        loadChildren: './documentation/documentation.module#DocumentationModule'
      }
    ]),

    AuthModule,

    FlexLayoutModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
