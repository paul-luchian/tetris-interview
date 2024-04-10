import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TetrisRoutingModule } from './tetris-routing.module';
import { TetrisComponent } from './components/tetris.component';
import { BoardComponent } from './components/board/board.component';
import { BlockComponent } from './components/block/block.component';


@NgModule({
  declarations: [
    TetrisComponent,
    BoardComponent,
    BlockComponent
  ],
  imports: [
    CommonModule,
    TetrisRoutingModule
  ]
})
export class TetrisModule { }
