import Cmd from './Cmd';
import MessageType from '../MessageType';

export enum ZDirection {
  UP = '1',
  DOWN = '0'
}

export default class MoveZCmd extends Cmd {
  private direction: ZDirection;

  public constructor(direction: ZDirection) {
    super();
    this.direction = direction;
  }

  public serialize(): string {
    return `${MessageType.MOVE_Z}${this.direction}`;
  }
}
