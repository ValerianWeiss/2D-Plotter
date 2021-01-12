export default class SerialComService {
  private static _port = 3000;
  private static _url = 'ws://localhost';
  private static _socket: WebSocket;

  public static getSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (SerialComService._socket) {
        resolve(SerialComService._socket);
      } else {
        SerialComService._socket = new WebSocket(
          `${SerialComService._url}:${SerialComService._port}`
        );

        SerialComService._socket.onopen = () => {
          console.log('connected to ws server');
          resolve(SerialComService._socket);
        };

        SerialComService._socket.onerror = error => {
          reject(error);
        };
      }
    });
  }
}
