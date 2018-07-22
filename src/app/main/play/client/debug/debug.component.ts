import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'et-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  @Output() close = new EventEmitter();
  @Output() step = new EventEmitter();
}
