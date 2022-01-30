import GetCurrPosCmd from '@/classes/machine/commands/GetCurrPosCmd';
import CurrentPositionResponse from '@/classes/machine/responses/CurrentPositionResponse';
import MessageType from '@/classes/machine/MessageType';
import SerialComService from './SerialComService';
import EventBus from 'js-event-bus';

export default class PositionService {
  private static eventBus = new EventBus();

  public static fetchCurrentPosition(): Promise<CurrentPositionResponse> {
    return new Promise((resolve, reject) => {
      const messageHandler = (message: string) => {
        PositionService.eventBus.emit('onGetCurrPosRes', null, message);
      };

      SerialComService.addMessageHandler(MessageType.CURR_POS, messageHandler);

      const timeout = setTimeout(() => {
        PositionService.eventBus.detachAll();
        PositionService.removeMessageHandler(messageHandler);
        reject();
      }, 2000);

      PositionService.eventBus.once('onGetCurrPosRes', (message: string) => {
        PositionService.removeMessageHandler(messageHandler);
        clearTimeout(timeout);
        resolve(new CurrentPositionResponse(message));
      });

      const message = new GetCurrPosCmd().serialize();
      SerialComService.send(message);
    });
  }

  private static removeMessageHandler(handler: (message: string) => void) {
    SerialComService.removeMessageHandler(MessageType.CURR_POS, handler);
  }
}
