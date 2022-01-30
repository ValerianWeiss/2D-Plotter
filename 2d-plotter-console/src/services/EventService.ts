import EventBus, { EventCallback } from 'js-event-bus';

export enum Event {
  SET_ORIGIN = 'SET_ORIGIN'
}

export default class EventService {
  private static eventBus = new EventBus();

  public static emit(event: string, data?: unknown) {
    this.eventBus.emit(event, data);
  }

  public static on(event: string, cb: EventCallback) {
    this.eventBus.on(event, cb);
  }
}
