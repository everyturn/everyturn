import { AfterViewChecked, Directive, EmbeddedViewRef, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[etNoCheck]',
})
export class NoCheckDirective implements AfterViewChecked {
  private view: EmbeddedViewRef<never>;

  constructor(private template: TemplateRef<never>, private vcRef: ViewContainerRef) {
    this.view = this.vcRef.createEmbeddedView(this.template);
  }

  ngAfterViewChecked(): void {
    this.view.detach();
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NoCheckDirective],
  exports: [NoCheckDirective],
})
export class UtilsModule { }
