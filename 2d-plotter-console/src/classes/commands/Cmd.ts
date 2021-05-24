export default abstract class Cmd {
  protected CMD_SEP = '\r\n';

  abstract serialize(): string;

  protected serializeBool(bool: boolean): string {
    return bool ? '1' : '0';
  }
}
