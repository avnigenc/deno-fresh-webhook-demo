import { HandlerContext, Handlers } from "$fresh/server.ts";

import { IGitHubUser } from "../../../../../interfaces/index.ts";

import {
  GithubService,
  SessionService,
} from "../../../../../services/index.ts";
import { RedisService } from "../../../../../services/redis.service.ts";

export const handler: Handlers = {
  async GET(request: Request, _: HandlerContext) {
    const code = new URLSearchParams(request.url).get("code") as string;

    await GithubService.getAccessToken(code);
    const gitHubUser = await GithubService.getUser();

    const gitHubUserId = gitHubUser.id.toString();
    const user = await RedisService.get<IGitHubUser>(gitHubUserId);
    if (!user) {
      await RedisService.set(
        gitHubUserId,
        JSON.stringify(gitHubUser),
      );
    }

    const sessionId = crypto.randomUUID();
    await RedisService.set(sessionId, gitHubUserId, 36000);

    const url = new URL(request.url);
    const headers = new Headers();
    SessionService.set(headers, url.hostname, sessionId);
    headers.set("location", "/");

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
