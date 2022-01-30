import Position from '@/classes/Position';
import MachineResponse from './MachineResponse';

export default class CurrentPositionResponse extends MachineResponse {
  public currentPosition: Position;

  public constructor(message: string) {
    super(message);
    const xPosStr = message.substring(2, 7);
    const yPosStr = message.substring(7, 12);
    const zPosStr = message.substring(12, 17);
    const x = this.parseSignedInt(xPosStr);
    const y = this.parseSignedInt(yPosStr);
    const z = this.parseSignedInt(zPosStr);
    this.currentPosition = new Position(x, y, z);
  }
}
