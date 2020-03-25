import {ILogger} from "../interface/ILogger";
import {injectable} from "inversify";
import "reflect-metadata";

// tslint:disable:no-console

@injectable()
export class Logger implements ILogger {

    public constructor() {
        console.clear();
    }

    private static getCurrentTimestamp(): string {
        return new Date().toISOString();
    }

    public log(message: string): void {
        console.log(`[LOG ${Logger.getCurrentTimestamp()}]: ${message}`);
    }

}