import Cmd from './Cmd';
import MessageType from '../MessageType';

export default class SetOriginCmd extends Cmd {
  public serialize(): string {
    return `${MessageType.SET_ORIGIN}`;
  }
}
