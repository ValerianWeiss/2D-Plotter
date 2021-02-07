import { Logger, LogMessageId } from './LogService';
export default class SerialComService {
  private static _port = 3000;
  private static _url = 'ws://localhost';
  private static _socket: WebSocket;

  public static getSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (SerialComService._socket) {
        resolve(SerialComService._socket);
      } else {
        Logger.debug(
          `Creating new websocket connection with url: ${SerialComService._url}:${SerialComService._port}`,
          LogMessageId.MW_CREATE_WS_CONNECTION
        );

        SerialComService._socket = new WebSocket(
          `${SerialComService._url}:${SerialComService._port}`
        );

        SerialComService._socket.onopen = () => {
          Logger.info(
            'Connected to the com server websocket',
            LogMessageId.MW_CONNECTED_WITH_MW
          );
          resolve(SerialComService._socket);
        };

        SerialComService._socket.onerror = error => {
          Logger.error(
            `Error occured while connecting to the com server websocket: ${JSON.stringify(
              error
            )}`,
            LogMessageId.MW_ON_ERROR
          );
          reject(error);
        };
      }
    });
  }
}
