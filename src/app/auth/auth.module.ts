import { NgModule } from '@angular/core';
import { AuthCallbackComponent } from './auth-callback.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: 'callback',
      component: AuthCallbackComponent,
    }])
  ],
  declarations: [AuthCallbackComponent],
  exports: [AuthCallbackComponent],
})
export class AuthModule {
}
