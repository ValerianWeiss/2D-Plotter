import CmdType, { getCmdType } from '../commands/CmdType';

export default class CmdResponse {
  public cmdType: CmdType;
  public successful: boolean;

  public constructor(message: string) {
    this.cmdType = getCmdType(message[0]);
    this.successful = message[1] == '0';
  }
}
