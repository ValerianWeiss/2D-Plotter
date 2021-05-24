import { Logger, LogMessageId } from './LogService';
import SerialPort, { PortInfo } from 'serialport';

const MESSAGE_SEPERATOR = '\n';

type onMessageCb = (message: string) => void;
type onOpenCb = () => void;
type onCloseCb = () => void;
type Err = Error | null | undefined;

export enum MessageType {
  MOVE_XY = 'M',
  MOVE_Z = 'Z'
}

export default class SerialComService {
  public static isOpen = false;
  private static onMessageCbs = new Map<MessageType, onMessageCb[]>();
  private static messageBuffer = '';
  private static serialPort: SerialPort;

  public static getPorts(): Promise<PortInfo[]> {
    return SerialPort.list();
  }

  public static openPort(path: string, onOpenCb?: onOpenCb) {
    SerialComService.initSerialPort(path);
    SerialComService.onProtOpen(path, onOpenCb);
    SerialComService.onPortData();
  }

  private static onProtOpen(path: string, onOpenCb?: onOpenCb) {
    SerialComService.serialPort.on('open', () => {
      Logger.info(
        `Serial connection to port ${path} open`,
        LogMessageId.CO_SERIAL_PORT_CON_OPEN
      );
      SerialComService.isOpen = true;
      if (onOpenCb) onOpenCb();
    });
  }

  private static onPortData() {
    SerialComService.serialPort.on('readable', () => {
      const data = SerialComService.serialPort.read();
      SerialComService.messageBuffer += data ? data : '';
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
    const infoMessage = `Controller message: '${message}'`;
    Logger.info(infoMessage, LogMessageId.CO_SERIAL_PORT_MSG);

    const type = SerialComService.getMessageType(message);
    const cbs = SerialComService.onMessageCbs.get(type) || [];
    cbs.forEach(cb => cb(message));
  }

  private static getMessageType(message: string): MessageType {
    const type = message.charAt(0);

    switch (type) {
      case MessageType.MOVE_XY:
        return MessageType.MOVE_XY;
      case MessageType.MOVE_Z:
        return MessageType.MOVE_Z;
      default:
        Logger.warn(
          `Received an invalid message type: ${type}`,
          LogMessageId.CO_SERIAL_PORT_INVLD_MSG_TYPE
        );
        throw new Error(`Received an invalid message type: ${type}`);
    }
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
        SerialComService.onMessageCbs = new Map();
        SerialComService.messageBuffer = '';
        if (cb) cb();
        Logger.debug(
          `Closed serial port ${SerialComService.serialPort.path}`,
          LogMessageId.CO_SERIAL_PORT_CON_CLOSE
        );
      }
    });
  }

  public static addMessageHandler(cb: onMessageCb, type: MessageType) {
    const cbs = SerialComService.onMessageCbs.get(type);
    if (cbs) {
      cbs.push(cb);
    } else {
      SerialComService.onMessageCbs.set(type, [cb]);
    }
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
