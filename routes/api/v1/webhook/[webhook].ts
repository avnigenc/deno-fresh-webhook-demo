import { HandlerContext, Handlers } from "$fresh/server.ts";
import { v4 as uuidV4 } from "std/uuid/mod.ts";
import { RedisService } from "../../../../services/redis.service.ts";
import { RoomChannel } from "../../../../services/index.ts";
import { IGitHubUser } from "../../../../interfaces/index.ts";
import { sizeof } from "https://deno.land/x/sizeof@v1.0.3/mod.ts";

// `/api/v1/webhook/{webhookId}`
export const handler: Handlers = async (
  request: Request,
  context: HandlerContext,
) => {
  const webhookId = context.params?.webhook;
  if (!webhookId) return context.renderNotFound();
  if (!uuidV4.validate(webhookId)) return context.renderNotFound();

  const userId = await RedisService.get<IGitHubUser>(webhookId);
  const user = await RedisService.get<IGitHubUser>(userId);
  if (!user) return context.renderNotFound();

  const requestId = crypto.randomUUID();
  const channel = RoomChannel.join(user.uuid);

  let headers = {};
  request.headers.forEach((value: string, key: string) => headers[key] = value);

  let query = {};
  new URL(request.url).searchParams.forEach((value: string, key: string) =>
    query[key] = value
  );

  let body;
  if (request.method !== "GET" && request.method !== "OPTIONS") {
    body = await request.json();
  }

  if (channel?.open) {
    channel.sendText({
      requestId,
      method: request.method,
      timestamp: Date.now(),
      message: request.url,
      host: context.remoteAddr,
      size: sizeof(request),
      headers,
      body,
      query,
    });

    channel.close();
  }

  return new Response(
    JSON.stringify({ requestId }),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
};
