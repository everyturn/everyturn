import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentationPageComponent } from './documentation-page.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: DocumentationPageComponent,
    }]),
    MaterialModule,
  ],
  declarations: [DocumentationPageComponent]
})
export class DocumentationModule {
}
