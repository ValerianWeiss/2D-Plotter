import Cmd from './Cmd';
import CmdType from './CmdType';

export default class SetOriginCmd extends Cmd {
  public serialize(): string {
    return `${CmdType.SET_ORIGIN}`;
  }
}
