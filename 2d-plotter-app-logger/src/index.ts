import * as fs from 'fs';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3    
}

export class Logger {
  private logLevel;
  private logFilePath;

  public constructor(logLevel: LogLevel, logFilePath: string) {
    this.logLevel = logLevel;
    this.logFilePath = logFilePath;        
}


  public debug(message: string, messageId?: string): void {
    this.log(message, LogLevel.DEBUG, messageId);
  }

  public info(message: string, messageId?: string): void {
    this.log(message, LogLevel.INFO, messageId);
  }

  public warn(message: string, messageId?: string): void {
    this.log(message, LogLevel.WARNING, messageId);
  }

  public error(message: string, messageId?: string): void {
    this.log(message, LogLevel.ERROR, messageId);
  }
  
  private log(message: string, logLevel: LogLevel, messageId?: string): void {
    if (this.hasToBeLogged(logLevel)) {
      let logMessage = this.buildLogMessage(message, logLevel, messageId);
      fs.appendFile(this.logFilePath, logMessage, error => {
        if (error) {
          console.log(`logging error occurred while writing to the logfile: ${this.logFilePath}.\n${error}`);
        }
      });
    }
  }

  private hasToBeLogged(logLevel: LogLevel): boolean {
    return logLevel >= this.logLevel;
  }

  private buildLogMessage(message: string, logLevel: LogLevel, messageId?: string): string {
    let dateStr: string = new Date().toISOString();
    let logLevelStr = LogLevel[logLevel].padEnd(8, ' ');
    let fullMessage = messageId ? `[${messageId}] ${message}` : message;
    return `${dateStr} ${logLevelStr} ${fullMessage}\n`
  }
}
