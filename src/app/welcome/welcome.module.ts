import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: WelcomePageComponent,
    }]),
    MaterialModule,
  ],
  declarations: [WelcomePageComponent]
})
export class WelcomeModule { }
