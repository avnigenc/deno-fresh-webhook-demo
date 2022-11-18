import { HandlerContext, Handlers } from "$fresh/server.ts";
import { SessionService } from "../../../../../services/index.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const url = new URL(request.url);
    const headers = new Headers(request.headers);
    SessionService.delete(headers, "sessionId", url.hostname);
    headers.set("location", "/");
    return new Response(null, { headers, status: 307 });
  },
};
