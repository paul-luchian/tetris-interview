
const clone = (data: any) => JSON.parse(JSON.stringify(data));

const random = (args1: number, args2?: number): number => {
    if (typeof(args2) === 'undefined') {
        args2 = args1;
        args1 = 0;
    }
    return Math.floor(Math.random() * (args2 - args1) + args1);
};

export const Utils: {
    clone: (data: any) => any;
    random: (args1: number, args2?: number) => number;
} = {
    clone,
    random
};
