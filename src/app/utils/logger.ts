import { environment } from 'src/environments/environment';

export enum LoggerType {
    ERROR = 'ERROR',
    LOG = 'LOG',
    ALERT = 'ALERT',
}

const message = (type: LoggerType, args: any[]): void => {
    if (!environment.log) { return; }
    if (type === LoggerType.LOG) {
        console.log(...args); return;
    }
    if (type === LoggerType.ERROR) {
        console.error(...args); return;
    }
    if (type === LoggerType.ALERT) {
        alert(...args); return;
    }
};

export const log = (...args: any) => {
    message(LoggerType.LOG, args);
};
export const error = (...args: any) => {
    message(LoggerType.ERROR, args);
};
export const alert = (...args: any) => {
    message(LoggerType.ALERT, args);
};

export const LOGGER: {
    message: (type: LoggerType, ...args: any) => void;
    log: (...args: any) => void;
    error: (...args: any) => void;
    alert: (...args: any) => void;
} = {
    message,
    log,
    error,
    alert,
};
