import { ColorType } from 'src/app/models/color.model';

export enum BlockType {
    FIGURE = 'FIGURE',
    EMPTY = 'EMPTY',
    FILLED = 'FILLED',
    WALL = 'WALL'
}

export class Block {

    i: number;

    j: number;

    color: ColorType;

    type: BlockType;

    constructor(i: number, j: number, color: ColorType, type: BlockType) {
        this.i = i;
        this.j = j;
        this.color = color;
        this.type = type;
        return this;
    }

    setColor(color: ColorType): Block {
        this.color = color;
        return this;
    }

    setPosition(i: number, j: number): Block {
        this.i = i;
        this.j = j;
        return this;
    }

    reset(): void {
        this.color = ColorType.GREY;
        this.type = BlockType.EMPTY;
    }

}
