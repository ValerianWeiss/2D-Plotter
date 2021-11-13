import Position from '@/classes/Position';
import CmdResponse from './CmdResponse';

export default class GetCurrPosCmdResponse extends CmdResponse {
  public currentPosition: Position;

  public constructor(message: string) {
    super(message);
    const xPosStr = `0x${message.substring(2, 6)}`;
    const yPosStr = `0x${message.substring(6, 10)}`;
    const zPosStr = `0x${message.substring(2, 6)}`;
    const x = parseInt(xPosStr);
    const y = parseInt(yPosStr);
    const z = parseInt(zPosStr);
    this.currentPosition = new Position(x, y, z);
  }
}
