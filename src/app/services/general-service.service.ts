import { Injectable } from '@angular/core';
import { getDefaultFigures } from '../modules/tetris/models/figure.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private figures: number[][][];

  constructor(
  ) {
    this.figures = getDefaultFigures();
  }

  getFigures(): number[][][] { return this.figures; }

  addFigure(figure: number[][]): void { this.figures.push(figure); }

}
