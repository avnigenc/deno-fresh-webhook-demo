import { IChannelMessage } from "../interfaces/index.ts";

export class EventSourceServiceClass {
  subscribeMessages(
    roomId: string,
    onMessage: (message: IChannelMessage) => void,
  ) {
    const events = new EventSource(`/api/v1/ws?roomId=${roomId}`);

    const listener = ({ data }: MessageEvent) => {
      const msg = JSON.parse(data) as IChannelMessage;
      onMessage(msg);
    };

    events.addEventListener("message", listener);

    return {
      unsubscribe() {
        events.removeEventListener("message", listener);
      },
    };
  }
}

export const EventSourceService = new EventSourceServiceClass();
