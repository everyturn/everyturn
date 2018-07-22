import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyPageComponent } from './lobby/lobby-page.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { DebugComponent } from './play/client/debug/debug.component';
import { MainComponent } from './main.component';
import { WaitingComponent } from './play/client/waiting.component';
import { PlayerListItemComponent } from './play/client/player-list/player-list-item.component';
import { PlayerListComponent } from './play/client/player-list/player-list.component';
import { MultiplayerPageComponent } from './play/multiplayer-page.component';
import { SingleplayerPageComponent } from './play/singleplayer-page.component';
import { BoardsModule } from './boards/boards.module';
import { ClientComponent } from './play/client/client.component';
import { UtilsModule } from '../utils/utils.module';
import { DynamicModule } from 'ng-dynamic-component';
import { RoomComponent } from './play/client/room.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: MainComponent,
      children: [
        {
          path: 'lobby',
          component: LobbyPageComponent,
        },
        {
          path: 'rooms/:roomId',
          component: MultiplayerPageComponent,
        },
        {
          path: 'singleplayer',
          component: SingleplayerPageComponent,
        },
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'lobby',
        },
      ]
    }]),
    MaterialModule,
    BoardsModule,
    UtilsModule,

    DynamicModule.withComponents(null),
  ],
  declarations: [
    LobbyPageComponent, DebugComponent, MainComponent, WaitingComponent, ClientComponent, RoomComponent,
    PlayerListItemComponent, PlayerListComponent, MultiplayerPageComponent, SingleplayerPageComponent,
  ]
})
export class MainModule {
}
