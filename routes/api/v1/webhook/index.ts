import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(__: Request, _: HandlerContext) {
    return new Response("ok");
  },
};
