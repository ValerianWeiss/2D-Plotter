export default abstract class Cmd {
  protected CMD_SEP = '\r\n';

  abstract serialize(): string;

  protected serializeBool(bool: boolean): string {
    return bool ? '1' : '0';
  }

  protected serializeInt(num: number): string {
    return num.toString(16).padStart(4, '0');
  }
}
