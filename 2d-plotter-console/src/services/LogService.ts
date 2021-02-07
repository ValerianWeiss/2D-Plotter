import * as fs from 'fs';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3
}

export class Logger {
  private static _logLevel: LogLevel;
  private static _logFilePath: string;

  public static init(logLevel: LogLevel, logFilePath: string): void {
    Logger._logLevel = logLevel;
    Logger._logFilePath = logFilePath;
  }

  public static debug(message: string, messageId?: string): void {
    this.log(message, LogLevel.DEBUG, messageId);
  }

  public static info(message: string, messageId?: string): void {
    this.log(message, LogLevel.INFO, messageId);
  }

  public static warn(message: string, messageId?: string): void {
    this.log(message, LogLevel.WARNING, messageId);
  }

  public static error(message: string, messageId?: string): void {
    this.log(message, LogLevel.ERROR, messageId);
  }

  private static log(
    message: string,
    logLevel: LogLevel,
    messageId?: string
  ): void {
    if (this.hasToBeLogged(logLevel)) {
      const logMessage = this.buildLogMessage(message, logLevel, messageId);
      fs.appendFile(this._logFilePath, logMessage, (error: unknown) => {
        if (error) {
          console.error(
            `logging error occurred while writing to the logfile: ${this._logFilePath}.\n${error}`
          );
        }
      });
    }
  }

  private static hasToBeLogged(logLevel: LogLevel): boolean {
    return logLevel >= this._logLevel;
  }

  private static buildLogMessage(
    message: string,
    logLevel: LogLevel,
    messageId?: string
  ): string {
    const dateStr: string = new Date().toISOString();
    const logLevelStr = LogLevel[logLevel].padEnd(8, ' ');
    const fullMessage = messageId ? `[${messageId}] ${message}` : message;
    return `${dateStr} ${logLevelStr} ${fullMessage}\n`;
  }
}

export const enum LogMessageId {
  CO_STARTED = 'console.000',
  MW_CREATE_WS_CONNECTION = 'console.001',
  MW_CONNECTED_WITH_MW = 'console.002',
  MW_ON_ERROR = 'console.003'
}
