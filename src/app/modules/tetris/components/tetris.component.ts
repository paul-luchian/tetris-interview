import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BOARD } from 'src/app/models/general.const';
import { GeneralService } from 'src/app/services/general-service.service';
import { Board } from '../models/board.model';
import { Figure, FigureMovements } from '../models/figure.model';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss']
})
export class TetrisComponent implements OnInit {

  board: Board;

  redraw$: Observable<void>;

  private redrawEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private generalService: GeneralService
  ) {
    this.redraw$ = this.redrawEmitter.asObservable();
  }

  ngOnInit(): void {
    this.board = new Board(BOARD.height, BOARD.width);
    this.nextEpoch();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.board.figure) { return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.code)) { return; }
    let movement!: FigureMovements;
    if (event.code === 'ArrowLeft') { movement = FigureMovements.LEFT; }
    if (event.code === 'ArrowRight') { movement = FigureMovements.RIGHT; }
    if (event.code === 'ArrowDown') { movement = FigureMovements.DOWN; }
    if (event.code === 'ArrowUp') { movement = FigureMovements.ROTATE; }
    this.board.moveFigure(movement);
  }

  private nextEpoch(): void {
    if (!this.board.figure) { this.board.figure = this.generateFigure(); }
    this.redrawEmitter.emit();

    setTimeout(() => {
      this.board.moveFigure(FigureMovements.DOWN);
      this.nextEpoch();
    }, 1000);
  }

  private generateFigure(): Figure {
    const newFigure: Figure = Figure.random(this.generalService.getFigures());
    return newFigure;
  }

}
