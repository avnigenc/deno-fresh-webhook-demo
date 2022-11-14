import { HandlerContext, Handlers } from "$fresh/server.ts";
import { RoomChannel } from "../../../../services/channel.service.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId") as string;
    const channel = RoomChannel.join(roomId);

    let stream: any;

    if (channel?.open) {
      try {
        stream = new ReadableStream({
          start: (controller) => {
            channel.onMessage((message) => {
              const body = `data: ${JSON.stringify(message)}\n\n`;
              controller.enqueue(body);
            });
          },
          cancel() {
            channel.close();
          },
        });
      } catch (e) {
        console.log(e.message);
      }
    }

    if (stream) {
      return new Response(
        stream.pipeThrough(
          new TextEncoderStream(),
        ),
        {
          headers: { "content-type": "text/event-stream" },
        },
      );
    }

    return new Response();
  },
};
