import Cmd from './Cmd';
import CmdType from './CmdType';

export default class XYCmd extends Cmd {
  public top: boolean;
  public right: boolean;
  public bottom: boolean;
  public left: boolean;
  public stepWidth: number;

  public constructor(
    top: boolean,
    right: boolean,
    bottom: boolean,
    left: boolean,
    stepWidth: number
  ) {
    super();
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.stepWidth = stepWidth;
  }

  private serializeSetpWidth(): string {
    return this.stepWidth.toString().padStart(5, '0');
  }

  public serialize(): string {
    const type = CmdType.MOVE_XY;
    const stepWidth = this.serializeSetpWidth();
    const top = this.serializeBool(this.top);
    const right = this.serializeBool(this.right);
    const bottom = this.serializeBool(this.bottom);
    const left = this.serializeBool(this.left);
    return `${type}${stepWidth}${top}${right}${bottom}${left}${this.CMD_SEP}`;
  }
}
