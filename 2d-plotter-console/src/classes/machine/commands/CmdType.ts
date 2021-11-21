export enum CmdType {
  MOVE_XY = 'M',
  MOVE_Z = 'Z',
  SET_ORIGIN = 'O',
  CURR_POS = 'P'
}

export const getCmdType = (cmdType: string): CmdType => {
  switch (cmdType) {
    case 'M':
      return CmdType.MOVE_XY;
    case 'Z':
      return CmdType.MOVE_Z;
    case 'O':
      return CmdType.SET_ORIGIN;
    case 'P':
      return CmdType.CURR_POS;
  }
  throw new Error(`Invalid command type: ${cmdType}`);
};

export default CmdType;
