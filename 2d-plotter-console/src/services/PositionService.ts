import GetCurrPosCmd from '@/classes/machine/commands/GetCurrPosCmd';
import CurrentPositionResponse from '@/classes/machine/responses/CurrentPositionResponse';
import MessageType from '@/classes/machine/MessageType';
import SerialComService from './SerialComService';
import EventBus from 'js-event-bus';

export default class PositionService {
  public static eventBus = new EventBus();

  public static fetchCurrentPosition(): Promise<CurrentPositionResponse> {
    return new Promise(resolve => {
      const messageHandler = (message: string) => {
        PositionService.eventBus.emit('onGetCurrPosRes', null, message);
      };
      SerialComService.addMessageHandler(MessageType.CURR_POS, messageHandler);
      PositionService.eventBus.once('onGetCurrPosRes', (message: string) => {
        SerialComService.removeMessageHandler(
          MessageType.CURR_POS,
          messageHandler
        );
        resolve(new CurrentPositionResponse(message));
      });
      const message = new GetCurrPosCmd().serialize();
      SerialComService.send(message);
    });
  }
}
