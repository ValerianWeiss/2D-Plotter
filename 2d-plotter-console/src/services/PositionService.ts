import GetCurrPosCmd from '@/classes/machine/commands/GetCurrPosCmd';
import GetCurrPosCmdResponse from '@/classes/machine/responses/GetCurrPosCmdResponse';
import SerialComService from './SerialComService';
import EventBus from 'js-event-bus';

export default class PositionService {
  public static eventBus = new EventBus();

  public static fetchCurrentPosition(): Promise<GetCurrPosCmdResponse> {
    return new Promise(resolve => {
      PositionService.eventBus.once('onGetCurrPosRes', (message: string) => {
        resolve(new GetCurrPosCmdResponse(message));
      });
      const message = new GetCurrPosCmd().serialize();
      SerialComService.send(message);
    });
  }
}
