import GetCurrPosCmd from '@/classes/machine/commands/GetCurrPosCmd';
import CurrentPositionResponse from '@/classes/machine/responses/CurrentPositionResponse';
import SerialComService from './SerialComService';
import EventBus from 'js-event-bus';

export default class PositionService {
  public static eventBus = new EventBus();

  public static fetchCurrentPosition(): Promise<CurrentPositionResponse> {
    return new Promise(resolve => {
      PositionService.eventBus.once('onGetCurrPosRes', (message: string) => {
        resolve(new CurrentPositionResponse(message));
      });
      const message = new GetCurrPosCmd().serialize();
      SerialComService.send(message);
    });
  }
}
