import { Logger, LogMessageId } from './LogService';
import SerialPort, { PortInfo } from 'serialport';

export default class SerialComService {
  public static serialPort: SerialPort;
  public static isOpen: boolean;

  public static getPorts(): Promise<PortInfo[]> {
    return SerialPort.list();
  }

  public static initSerialPort(path: string): void {
    this.serialPort = new SerialPort(
      path,
      {
        baudRate: 9600,
        dataBits: 8, // defaults for Arduino serial communication
        parity: 'none',
        stopBits: 1
      },
      error => {
        if (error) {
          Logger.error(
            `Could not connect to serial port ${path}. Error: ${error}`,
            LogMessageId.CO_SERIAL_PORT_CON_ERROR
          );
          throw error
        }
      }
    );
  }
}
