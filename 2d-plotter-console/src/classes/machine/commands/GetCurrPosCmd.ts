import Cmd from './Cmd';
import CmdType from './CmdType';

export default class GetCurrPosCmd extends Cmd {
  public serialize(): string {
    return `${CmdType.CURR_POS}`;
  }
}
