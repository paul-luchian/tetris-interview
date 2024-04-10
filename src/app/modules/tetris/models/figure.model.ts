import { ColorType, randomColor } from 'src/app/models/color.model';
import { LOGGER } from 'src/app/utils/logger';
import { Utils } from 'src/app/utils/utils';

export enum FigureMovements {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    ROTATE = 'ROTATE',
}

export interface IFigureBlock {
    boardI: number;
    boardJ: number;
    hasElement: boolean;
}

export class Figure {

    private figureBlocksLocal: IFigureBlock[][];

    private matrixLocal: number[][];

    private sizeLocal: number;

    private localColor: ColorType;

    static random(figures: number[][][]): Figure {
        const figureNumber = Utils.random(figures.length);
        const figure: number[][] = figures[figureNumber];
        LOGGER.log(`[GENERATED] figure${figureNumber + 1} `, figure);
        return new Figure(figure, randomColor());
    }

    constructor(matrix: number[][], color: ColorType) {
        this.matrixLocal = matrix;
        this.localColor = color;
        this.sizeLocal = this.matrixLocal.length;
        return this;
    }

    get size(): number { return this.sizeLocal; }

    get matrix(): number[][] { return this.matrixLocal; }

    get color(): ColorType { return this.localColor; }

    get figureBlocks(): IFigureBlock[][] { return this.figureBlocksLocal; }

    set figureBlocks(data: IFigureBlock[][]) { this.figureBlocksLocal = data; }

    initializeFigureBlocks(startJ: number): void {
        const boardRows: IFigureBlock[][] = [];
        for (let i = 0; i < this.sizeLocal; ++i) {
            const boardRow: IFigureBlock[] = [];
            for (let j = 0; j < this.sizeLocal; ++j) {
                const hasElement = !!this.matrixLocal[i][j];
                boardRow.push({
                    boardI: -this.sizeLocal + i,
                    boardJ: startJ + j,
                    hasElement
                });
            }
            boardRows.push(boardRow);
        }
        this.figureBlocksLocal = boardRows;
    }
}

export const getDefaultFigures = (): number[][][] => {
    return [getFigure1(), getFigure2(), getFigure3(), getFigure4(), getFigure5(), getFigure6(), getFigure7()];
};
// -- -- --
// -- xx --
// xx xx xx
export const getFigure1 = (): number[][] => ([[0, 0, 0], [0, 1, 0], [1, 1, 1]]);
// -- -- --
// -- xx xx
// xx xx --
export const getFigure2 = (): number[][] => ([[0, 0, 0], [0, 1, 1], [1, 1, 0]]);
// -- -- --
// xx xx --
// -- xx xx
export const getFigure3 = (): number[][] => ([[0, 0, 0], [1, 1, 0], [0, 1, 1]]);
// xx -- --
// xx xx xx
// -- -- --
export const getFigure4 = (): number[][] => ([[1, 0, 0], [1, 1, 1], [0, 0, 0]]);
// -- -- xx
// xx xx xx
// -- -- --
export const getFigure5 = (): number[][] => ([[0, 0, 1], [1, 1, 1], [0, 0, 0]]);
// -- -- --
// xx xx --
// xx xx --
export const getFigure6 = (): number[][] => ([[0, 0, 0], [1, 1, 0], [1, 1, 0]]);
// -- xx -- --
// -- xx -- --
// -- xx -- --
// -- xx -- --
export const getFigure7 = (): number[][] => ([[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]);
