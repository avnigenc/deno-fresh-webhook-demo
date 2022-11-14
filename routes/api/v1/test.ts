import { HandlerContext, Handlers } from "$fresh/server.ts";
import { RoomChannel } from "../../../services/channel.service.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const channel = RoomChannel.join("22678635");

    if (channel?.open) {
      channel.sendText({
        method: Math.random() < 0.5 ? "GET" : "POST",
        requestId: crypto.randomUUID().split("-")[0],
        message: "message",
        timestamp: Date.now(),
      });

      channel.close();
    }

    return new Response("ok", {});
  },
};
