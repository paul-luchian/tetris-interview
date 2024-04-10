import { Utils } from '../utils/utils';

export enum ColorType {
    RED = 'red',
    BLUE = 'blue',
    GREEN = 'green',
    YELLOW = 'yellow',
    BLACK = 'black',
    WHITE = 'white',
    BROWN = 'brown',
    ORANGE = 'orange',
    GREY = 'grey'
}

export const randomColor = (): ColorType => {
    switch (Utils.random(7)) {
        case 0: return ColorType.RED;
        case 1: return ColorType.BLUE;
        case 2: return ColorType.GREEN;
        case 3: return ColorType.YELLOW;
        case 4: return ColorType.WHITE;
        case 5: return ColorType.BROWN;
        case 6: return ColorType.ORANGE;
        default: return ColorType.GREY;
    }
};
