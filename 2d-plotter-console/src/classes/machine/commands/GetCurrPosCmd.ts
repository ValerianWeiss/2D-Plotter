import Cmd from './Cmd';
import MessageType from '../MessageType';

export default class GetCurrPosCmd extends Cmd {
  public serialize(): string {
    return `${MessageType.CURR_POS}`;
  }
}
