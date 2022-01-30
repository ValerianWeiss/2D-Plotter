import MessageType, { getMessageType } from '../MessageType';

export default class MachineResponse {
  public messageType: MessageType;
  public successful: boolean;

  public constructor(message: string) {
    this.messageType = getMessageType(message[0]);
    this.successful = message[1] == '0';
  }
}
