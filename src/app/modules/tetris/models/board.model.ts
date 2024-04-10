import { ColorType } from 'src/app/models/color.model';
import { Utils } from 'src/app/utils/utils';
import { Block, BlockType } from './block.model';
import { Figure, FigureMovements, IFigureBlock } from './figure.model';

export class Board {

    private localHeight: number;

    private localWidth: number;

    private localBlocks: Block[][];

    private localFigure: Figure;

    constructor(height: number, width: number) {
        this.localHeight = height;
        this.localWidth = width;
        this.localBlocks = this.initializeBoard(this.localHeight, this.localWidth);
        return this;
    }

    get blocks(): Block[][] { return this.localBlocks; }

    get figure(): Figure { return this.localFigure; }

    set figure(figure: Figure) { this.localFigure = figure; this.setFigureStartPosition(); }

    moveFigure(movement: FigureMovements): void {
        if (movement === FigureMovements.LEFT) {
            this.moveFigureLeft();
        }
        if (movement === FigureMovements.RIGHT) {
            this.moveFigureRight();
        }
        if (movement === FigureMovements.DOWN) {
            this.moveFigureDown();
        }
        if (movement === FigureMovements.ROTATE) {
            this.moveFigureRotate();
        }
    }

    checkRows(): void {
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);

        for (let row = this.localHeight - 2; row >= 0; row--) {
            let isRowFull = false;
            for (let j = 1; j <= this.localWidth - 2; j++) {
                isRowFull = isRowFull || (blocks[row][j].type === BlockType.EMPTY);
            }
            if (!isRowFull) {
                blocks[row].filter((cell) => cell.type !== BlockType.WALL).forEach((cell) => cell.reset());
                for (let i = (row - 1); i >= 0; i--) {
                    for (let j = 1; j <= this.localWidth - 2; j++) {
                        if (blocks[i][j].type === BlockType.FILLED) {
                            blocks[i + 1][j] =  new Block(i, j, blocks[i][j].color, blocks[i][j].type);
                            blocks[i][j].reset();
                        }
                    }
                }
                row = row + 1;
            }
        }
        this.localBlocks = blocks;
    }

    private moveFigureRotate(): void {
        if (!this.localFigure) { return; }
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);
        const blocksRotated: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);
        const figureBlocks: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);
        const figureBlocksRotated: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);

        const { size } = this.localFigure;
        const startI = figureBlocks[0][0].boardI;
        const startJ = figureBlocks[0][0].boardJ;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                blocksRotated[i + startI][j + startJ].reset();
                figureBlocksRotated[i][j].hasElement = false;
                const cell = blocks[i + startI][j + startJ];
                const next = blocks[(size - 1) - j + startI][i + startJ];
                if (next.type === BlockType.FIGURE) {
                    blocksRotated[i + startI][j + startJ].color = blocks[(size - 1) - j + startI][i + startJ].color;
                    blocksRotated[i + startI][j + startJ].type = blocks[(size - 1) - j + startI][i + startJ].type;
                    figureBlocksRotated[i][j].hasElement = figureBlocks[(size - 1) - j][i].hasElement;
                }
                if (next.type !== BlockType.FIGURE && next.type !== BlockType.EMPTY) {
                    return;
                }
            }
        }
        this.localFigure.figureBlocks = figureBlocksRotated;
        this.localBlocks = blocksRotated;
    }

    private moveFigureDown(): void {
        if (!this.localFigure) { return; }
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);
        const figureBlocks: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);

        const { size } = this.localFigure;
        let elementMoved = false;
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                const cell = figureBlocks[i][j];
                if (cell.boardJ > 0 && cell.boardJ < this.localWidth
                    && cell.boardI >= 0 && cell.boardI < this.localHeight - 1) {
                    const nextCell = blocks[cell.boardI + 1][cell.boardJ];
                    if (cell.hasElement && nextCell.type === BlockType.EMPTY) {
                        blocks[cell.boardI + 1][cell.boardJ].color = this.localFigure.color;
                        blocks[cell.boardI + 1][cell.boardJ].type = BlockType.FIGURE;
                        blocks[cell.boardI][cell.boardJ].reset();
                        elementMoved = true;
                    }
                    if (cell.hasElement && (nextCell.type === BlockType.WALL || nextCell.type === BlockType.FILLED)) {
                        this.localFigure = null as any;
                        this.resetBlocks(BlockType.FIGURE, BlockType.FILLED);
                        this.checkRows();
                        return;
                    }
                }
            }
        }
        if (elementMoved) { figureBlocks.forEach((row) => row.forEach((cell) => cell.boardI++)); }
        this.localFigure.figureBlocks = figureBlocks;
        this.localBlocks = blocks;
    }

    private moveFigureLeft(): void {
        if (!this.localFigure) { return; }
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);
        const figureBlocks: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);

        const { size } = this.localFigure;
        let elementMoved = false;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = figureBlocks[i][j];
                if (cell.boardJ > 0 && cell.boardJ < this.localWidth
                    && cell.boardI >= 0 && cell.boardI < this.localHeight - 1) {
                    const nextCell = blocks[cell.boardI][cell.boardJ - 1];
                    if (cell.hasElement && nextCell.type === BlockType.EMPTY) {
                        blocks[cell.boardI][cell.boardJ - 1].color = this.localFigure.color;
                        blocks[cell.boardI][cell.boardJ - 1].type = BlockType.FIGURE;
                        blocks[cell.boardI][cell.boardJ].reset();
                        elementMoved = true;
                    }
                    if (cell.hasElement && (nextCell.type === BlockType.WALL || nextCell.type === BlockType.FILLED)) {
                        return;
                    }
                }
            }
        }
        if (elementMoved) { figureBlocks.forEach((row) => row.forEach((cell) => cell.boardJ--)); }
        this.localFigure.figureBlocks = figureBlocks;
        this.localBlocks = blocks;
    }

    private moveFigureRight(): void {
        if (!this.localFigure) { return; }
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);
        const figureBlocks: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);

        const { size } = this.localFigure;
        let elementMoved = false;
        for (let i = 0; i < size; i++) {
            for (let j = size - 1; j >= 0; j--) {
                const cell = figureBlocks[i][j];
                if (cell.boardJ > 0 && cell.boardJ < this.localWidth
                    && cell.boardI >= 0 && cell.boardI < this.localHeight - 1) {
                    const nextCell = blocks[cell.boardI][cell.boardJ + 1];
                    if (cell.hasElement && nextCell.type === BlockType.EMPTY) {
                        blocks[cell.boardI][cell.boardJ + 1].color = this.localFigure.color;
                        blocks[cell.boardI][cell.boardJ + 1].type = BlockType.FIGURE;
                        blocks[cell.boardI][cell.boardJ].reset();
                        elementMoved = true;
                    }
                    if (cell.hasElement && (nextCell.type === BlockType.WALL || nextCell.type === BlockType.FILLED)) {
                        return;
                    }

                }
            }
        }
        if (elementMoved) { figureBlocks.forEach((row) => row.forEach((cell) => cell.boardJ++)); }
        this.localFigure.figureBlocks = figureBlocks;
        this.localBlocks = blocks;
    }

    private setFigureStartPosition(): void {
        if (!this.localFigure) { return; }
        const blocks: Block[][] = this.deepCopyBlocks(this.localBlocks, this.localHeight, this.localWidth);

        const { size } = this.localFigure;
        const { startJ, endJ } = this.getFigureJPosition(size);

        if (!this.localFigure.figureBlocks) { this.localFigure.initializeFigureBlocks(startJ); }
        const figureBlocks: IFigureBlock[][] = Utils.clone(this.localFigure.figureBlocks);

        const index = figureBlocks[size - 1][0].boardJ + 1;
        let lastRowHasElement = false;

        for (let i = size - 1; i >= 0; i--) {
            const rowHasElement = figureBlocks[i].reduce((flag, next) => flag || next.hasElement, false);
            if (lastRowHasElement === true && rowHasElement === false) { break; }
            lastRowHasElement = rowHasElement;
            for (let temp = (size - 1) - i; temp >= 0; temp--) {
                for (let j = startJ; j <= endJ; j++) {
                    if (blocks[temp][j].type === BlockType.EMPTY
                        && figureBlocks[i + temp][j - startJ].hasElement) {
                        blocks[temp][j].type = BlockType.FIGURE;
                        blocks[temp][j].color = this.localFigure.color;
                        if (temp - 1 >= 0) {
                            blocks[temp - 1][j].reset();
                        }
                    }
                    if (blocks[temp][j].type === BlockType.FILLED && figureBlocks[i + temp][j - startJ].hasElement) {
                        alert('END GAME'); return;
                    }
                }
            }
            figureBlocks.forEach((row) => row.forEach((cell) => cell.boardI++));
        }
        this.localFigure.figureBlocks = figureBlocks;
        this.localBlocks = blocks;
    }

    private getFigureJPosition(size: number): { startJ: number; endJ: number } {
        let startJ: number;
        let endJ: number;
        if (this.localWidth % 2 === 0) {
            // board even size
            if (this.localFigure.size % 2 === 0) {
                // figure even size
                startJ = (this.localWidth / 2) - (size / 2);
            } else {
                // figure odd size
                startJ = (this.localWidth / 2) - Math.ceil(size / 2);
            }
        } else {
            // board odd size
            if (this.localFigure.size % 2 === 0) {
                // figure even size
                startJ = Math.ceil(this.localWidth / 2) - (size / 2);
            } else {
                // figure odd size
                startJ = Math.ceil(this.localWidth / 2) - Math.ceil(size / 2);
            }
        }
        endJ = startJ + size - 1;
        return { startJ, endJ };
    }

    private initializeBoard(height: number, width: number): Block[][] {
        const rows: Block[][] = [];
        for (let i = 0; i < height; i++) {
            const row: Block[] = [];
            for (let j = 0; j < width; j++) {
                const color = (i !== height - 1 && j !== 0 && j !== width - 1) ? ColorType.GREY : ColorType.BLACK;
                const type = (i !== height - 1 && j !== 0 && j !== width - 1) ? BlockType.EMPTY : BlockType.WALL;
                row.push(new Block(i, j, color, type));
            }
            rows.push(row);
        }
        return rows;
    }

    private resetBlocks(target: BlockType, to: BlockType): void {
        for (let i = 0; i < this.localHeight; i++) {
            for (let j = 0; j < this.localWidth; j++) {
                if (this.blocks[i][j].type === target) {
                    this.blocks[i][j].type = to;
                }
            }
        }
    }

    private deepCopyBlocks(localBlocks: Block[][], height: number, width: number): Block[][] {
        const blocks: Block[][] = [];
        for (let i = 0; i < height; i++) {
            blocks.push([]);
            for (let j = 0; j < width; j++) {
                blocks[i][j] = new Block(i, j, localBlocks[i][j].color, localBlocks[i][j].type);
            }
        }
        return blocks;
    }

}
