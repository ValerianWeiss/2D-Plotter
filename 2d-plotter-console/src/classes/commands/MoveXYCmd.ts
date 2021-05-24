import Cmd from './Cmd';
import CmdType from './CmdType';

export default class XYCmd extends Cmd {
  public up: boolean;
  public right: boolean;
  public down: boolean;
  public left: boolean;
  public stepWidth: number;

  public constructor(
    up: boolean,
    right: boolean,
    down: boolean,
    left: boolean,
    stepWidth: number
  ) {
    super();
    this.up = up;
    this.right = right;
    this.down = down;
    this.left = left;
    this.stepWidth = stepWidth;
  }

  private serializeSetpWidth(): string {
    return this.stepWidth.toString().padStart(5, '0');
  }

  public serialize(): string {
    const type = CmdType.MOVE_XY;
    const stepWidth = this.serializeSetpWidth();
    const up = this.serializeBool(this.up);
    const right = this.serializeBool(this.right);
    const down = this.serializeBool(this.down);
    const left = this.serializeBool(this.left);
    return `${type}${stepWidth}${up}${right}${down}${left}${this.CMD_SEP}`;
  }
}
