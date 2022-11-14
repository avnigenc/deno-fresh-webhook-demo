import { HandlerContext, Handlers } from "$fresh/server.ts";
import { ConfigService, IConfig } from "../../../../services/config.service.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key") as keyof IConfig;
    return new Response(ConfigService.get(key) as string, {});
  },
};
