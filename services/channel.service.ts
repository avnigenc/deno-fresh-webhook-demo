import { IChannelMessage } from "../interfaces/index.ts";

export default class RoomChannelClass {
  private channel: BroadcastChannel | undefined;

  constructor() {
    this.channel = undefined;
  }

  join(roomId: string) {
    this.channel = new BroadcastChannel(roomId);
    return this;
  }

  get open() {
    return this.channel !== undefined;
  }

  onMessage(handler: (message: IChannelMessage) => void) {
    if (this.channel) {
      const listener = (e: MessageEvent) => {
        handler(e.data);
      };

      this.channel.addEventListener("message", listener);

      return {
        unsubscribe: () => {
          (this.channel as BroadcastChannel).removeEventListener(
            "message",
            listener,
          );
        },
      };
    }
  }

  close() {
    if (this.channel) {
      this.channel.close();
    }
  }

  sendText(message: IChannelMessage) {
    if (this.channel) {
      this.channel.postMessage({
        ...message,
      });
    }
  }
}

export const RoomChannel = new RoomChannelClass();
