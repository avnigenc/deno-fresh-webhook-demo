import { HandlerContext, Handlers } from "$fresh/server.ts";
import { IConfig } from "../../../../interfaces/index.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key") as keyof IConfig;
    return new Response(Deno.env.get(key) as string, {});
  },
};
