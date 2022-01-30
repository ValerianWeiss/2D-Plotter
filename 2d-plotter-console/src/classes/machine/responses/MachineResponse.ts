import MessageType, { getMessageType } from '../MessageType';

export default class MachineResponse {
  public messageType: MessageType;
  public successful: boolean;

  public constructor(message: string) {
    this.messageType = getMessageType(message[0]);
    this.successful = message[1] == '0';
  }

  protected parseSignedInt(str: string): number {
    const sign = str.substring(0, 1) == '-' ? -1 : 1;
    const num = `0x${str.substring(1)}`;
    return sign * parseInt(num);
  }
}
