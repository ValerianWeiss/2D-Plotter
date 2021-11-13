import Cmd from './Cmd';
import CmdType from './CmdType';

export default class MoveXYCmd extends Cmd {
  public stepWidth: number;
  public xTargetPos: number;
  public yTargetPos: number;

  public constructor(xTargetPos: number, yTargetPos: number, stepWidth = 1) {
    super();
    this.stepWidth = stepWidth;
    this.xTargetPos = xTargetPos;
    this.yTargetPos = yTargetPos;
  }

  public serialize(): string {
    const type = CmdType.MOVE_XY;
    const stepWidth = this.serializeInt(this.stepWidth);
    const xTargetPos = this.serializeInt(this.xTargetPos);
    const yTargetPos = this.serializeInt(this.yTargetPos);
    return `${type}${xTargetPos}${yTargetPos}${stepWidth}${this.CMD_SEP}`;
  }
}
