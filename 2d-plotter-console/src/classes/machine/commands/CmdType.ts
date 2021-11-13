export enum CmdType {
  MOVE_XY = 'M',
  MOVE_Z = 'Z',
  SET_ORIGIN = 'O',
  GET_CURR_POSS = 'P'
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
      return CmdType.GET_CURR_POSS;
  }
  throw new Error(`Invalid command type: ${cmdType}`);
};

export default CmdType;
