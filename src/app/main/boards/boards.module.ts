import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicTacToeBoardComponent } from './tic-tac-toe-board.component';
import { NgxInitModule } from 'ngx-init';
import { FlexLayoutModule } from '@angular/flex-layout';

const BOARDS: {readonly [gameName: string]: any} = {'tic-tac-toe': TicTacToeBoardComponent};
const BOARD_COMPONENTS = [TicTacToeBoardComponent];// would have used Object.values(BOARDS) but it breaks Angular's static analysis

export function getGameBoardByName(gameName: string) {
  return BOARDS[gameName];
}

@NgModule({
  declarations: BOARD_COMPONENTS,
  imports: [
    CommonModule,
    FlexLayoutModule,
    NgxInitModule,
  ],
  exports: BOARD_COMPONENTS,
  entryComponents: BOARD_COMPONENTS
})
export class BoardsModule {
}
