export enum MessageType {
  MOVE_XY = 'M',
  MOVE_Z = 'Z',
  SET_ORIGIN = 'O',
  CURR_POS = 'P',
  LOG = 'L'
}

export const getMessageType = (messageType: string): MessageType => {
  switch (messageType) {
    case MessageType.MOVE_XY:
      return MessageType.MOVE_XY;
    case MessageType.MOVE_Z:
      return MessageType.MOVE_Z;
    case MessageType.SET_ORIGIN:
      return MessageType.SET_ORIGIN;
    case MessageType.CURR_POS:
      return MessageType.CURR_POS;
    case MessageType.LOG:
      return MessageType.LOG;
  }
  throw new Error(`Invalid message type: ${messageType}`);
};

export default MessageType;
