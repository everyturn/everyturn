import { Component } from '@angular/core';
import { Board } from './board';


export interface ITicTacToeMoves {
  clickCell(args: number): void;
}

@Component({
  template: `
    <div style="height: 100%; width: 100%;" fxLayout fxLayoutAlign="center center">
      <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="16px">
        <table class="tic-tac-toe-board">
          <tr *ngFor="let i of [0, 1, 2]">
            <ng-container *ngFor="let j of [0, 1, 2]">
              <td *ngxInit="3 * i + j as id" [ngClass]="{active: isCellActive(id)}" (click)="onClick(id)">{{G.cells[id]}}</td>
            </ng-container>
          </tr>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./tic-tac-toe-board.component.scss'],
})
export class TicTacToeBoardComponent extends Board<{ cells: number[] }, ITicTacToeMoves> {
  onClick(id) {
    if (this.isCellActive(id)) {
      this.moves.clickCell(id);
    }
  }

  isCellActive(id) {
    return this.isActive && this.G.cells[id] === null;
  }
}
