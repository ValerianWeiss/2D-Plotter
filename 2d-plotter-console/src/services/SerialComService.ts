import { Logger, LogMessageId } from './LogService';
import SerialPort, { PortInfo } from 'serialport';

export default class SerialComService {
  public static isOpen = false;
  private static serialPort: SerialPort;

  public static getPorts(): Promise<PortInfo[]> {
    return SerialPort.list();
  }

  public static openPort(path: string, cb?: () => void) {
    SerialComService.initSerialPort(path);
    SerialComService.serialPort.on('open', () => {
      Logger.info(
        `Serial connection to port ${path} open`,
        LogMessageId.CO_SERIAL_PORT_CON_OPEN
      );
      SerialComService.isOpen = true;
      if (cb) cb();
    });
  }

  public static closePort(cb?: () => void) {
    SerialComService.serialPort.close((error: Error | null | undefined) => {
      if (error) {
        Logger.warn(
          `Could not close serial port ${SerialComService.serialPort.path}`,
          LogMessageId.CO_SERIAL_PORT_CON_CLOSE_ERROR
        );
      } else {
        Logger.debug(
          `Could not close serial port ${SerialComService.serialPort.path}`,
          LogMessageId.CO_SERIAL_PORT_CON_CLOSE
        );
        if (cb) cb();
      }
    });
  }

  public static initSerialPort(path: string): void {
    this.serialPort = new SerialPort(
      path,
      {
        baudRate: 9600,
        dataBits: 8, // defaults for Arduino serial communication
        parity: 'none',
        stopBits: 1,
        lock: false
      },
      error => {
        if (error) {
          Logger.error(
            `Could not connect to serial port ${path}. Error: ${error}`,
            LogMessageId.CO_SERIAL_PORT_CON_ERROR
          );
          throw error;
        }
      }
    );
  }
}
