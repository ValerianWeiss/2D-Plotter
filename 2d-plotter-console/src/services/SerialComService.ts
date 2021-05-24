import { Logger, LogMessageId } from './LogService';
import SerialPort, { PortInfo } from 'serialport';

const MESSAGE_SEPERATOR = '\n';

type onMessageCb = (message: string) => void;
type onOpenCb = () => void;
type onCloseCb = () => void;
type Err = Error | null | undefined;

export enum MessageType {
  DEFAULT = '0'
}

export default class SerialComService {
  public static isOpen = false;
  private static onMessageCbs = new Map<MessageType, onMessageCb>();
  private static messageBuffer = '';
  private static serialPort: SerialPort;

  public static getPorts(): Promise<PortInfo[]> {
    return SerialPort.list();
  }

  public static openPort(
    path: string,
    onOpenCb?: onOpenCb,
    onMessageCb?: onMessageCb,
    messageType?: MessageType
  ) {
    SerialComService.initSerialPort(path);
    SerialComService.onProtOpen(path, onOpenCb, onMessageCb, messageType);
    SerialComService.onPortData();
  }

  private static onProtOpen(
    path: string,
    onOpenCb?: onOpenCb,
    onMessageCb?: onMessageCb,
    messageType?: MessageType
  ) {
    SerialComService.serialPort.on('open', () => {
      Logger.info(
        `Serial connection to port ${path} open`,
        LogMessageId.CO_SERIAL_PORT_CON_OPEN
      );
      SerialComService.isOpen = true;
      if (onOpenCb) onOpenCb();
      if (onMessageCb) {
        SerialComService.addMessageHandler(onMessageCb, messageType);
      }
    });
  }

  private static onPortData() {
    SerialComService.serialPort.on('data', (data: Buffer) => {
      const str = data.toString();
      console.log('on data', str);
      SerialComService.messageBuffer += str;
      const buffer = SerialComService.messageBuffer;

      if (buffer.includes(MESSAGE_SEPERATOR)) {
        const messages = buffer.split(MESSAGE_SEPERATOR);
        const unclosedMessage = messages.pop();
        SerialComService.messageBuffer = unclosedMessage ? unclosedMessage : '';
        messages.forEach(message => SerialComService.onMessage(message));
      }
    });
  }

  public static onMessage(message: string) {
    // TODO: Introduce message parsing and just execute callbacks for the type
    // of the incoming message
    Logger.info(
      `Controller message: '${message}'`,
      LogMessageId.CO_SERIAL_PORT_MSG
    );
    SerialComService.onMessageCbs.forEach(cb => cb(message));
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

  public static closePort(cb?: onCloseCb) {
    SerialComService.serialPort.close((error: Err) => {
      if (error) {
        Logger.warn(
          `Could not close serial port ${SerialComService.serialPort.path}`,
          LogMessageId.CO_SERIAL_PORT_CON_CLOSE_ERROR
        );
      } else {
        if (cb) cb();
        Logger.debug(
          `Closed serial port ${SerialComService.serialPort.path}`,
          LogMessageId.CO_SERIAL_PORT_CON_CLOSE
        );
      }
    });
  }

  public static addMessageHandler(cb: onMessageCb, type?: MessageType) {
    if (!type) type = MessageType.DEFAULT;
    SerialComService.onMessageCbs.set(type, cb);
  }

  public static write(message: string) {
    message += MESSAGE_SEPERATOR;
    SerialComService.serialPort.write(Buffer.from(message), (error: Err) => {
      if (error) {
        Logger.error(
          `Serial port write error occurred: ${error}`,
          LogMessageId.CO_SERIAL_PORT_WRITE_ERROR
        );
      }
    });
  }
}
