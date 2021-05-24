import * as fs from 'fs';
import Logging from '@/components/Logging.vue';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3
}

export class Logger {
  public static logLevel: LogLevel;
  public static logFilePath: string;
  public static sessionLogs: string[];
  private static _loggingVue: Logging;

  public static init(logLevel: LogLevel, logFilePath: string): void {
    Logger.logLevel = logLevel;
    Logger.logFilePath = logFilePath;
    Logger.sessionLogs = [];
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

  public static registerLoggingVue(vue: Logging) {
    this._loggingVue = vue;
  }

  private static log(
    message: string,
    logLevel: LogLevel,
    messageId?: string
  ): void {
    if (this.hasToBeLogged(logLevel)) {
      const logMessage = this.buildLogMessage(message, logLevel, messageId);
      this.writeLogToFile(logMessage);
      this.writeLogToSessionLogs(logMessage);
    }
  }

  private static hasToBeLogged(logLevel: LogLevel): boolean {
    return logLevel >= this.logLevel;
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

  private static writeLogToFile(logMessage: string) {
    fs.appendFile(this.logFilePath, logMessage, (error: unknown) => {
      if (error) {
        console.error(
          `logging error occurred while writing to the logfile: ${this.logFilePath}.\n${error}`
        );
      }
    });
  }

  private static writeLogToSessionLogs(logMessage: string) {
    if (this._loggingVue) {
      this._loggingVue.$emit('appendLog', logMessage);
    }
  }
}

export const enum LogMessageId {
  CO_STARTED = 'console.000',
  MW_CREATE_WS_CONNECTION = 'console.001',
  MW_CONNECTED_WITH_MW = 'console.002',
  MW_ON_ERROR = 'console.003',
  CO_LOGGING_COULD_NOT_READ_LOGFILE = 'console.004',
  CO_SERIAL_PORT_CON_ERROR = 'console.005',
  CO_SERIAL_NONE_PORT_FOUND = 'console.006',
  CO_SERIAL_PORT_CON_OPEN = 'console.007',
  CO_SERIAL_PORT_CON_CLOSE = 'console.008',
  CO_SERIAL_PORT_CON_CLOSE_ERROR = 'console.009',
  CO_SERIAL_PORT_WRITE_ERROR = 'console.010',
  CO_SERIAL_PORT_MSG = 'console.011',
  CO_SERIAL_PORT_INVLD_MSG_TYPE = 'console.012',
  CO_INVLD_CMD_COUNT_QUEUE = 'console.013'
}
