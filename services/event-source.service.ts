import { IChannelMessage } from "../interfaces/channel-message.interface.ts";

export default class EventSourceServiceClass {
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
        console.log("unsubscribed", events.url);
        events.removeEventListener("message", listener);
      },
    };
  }
}

export const EventSourceService = new EventSourceServiceClass();
