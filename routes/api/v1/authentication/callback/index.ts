import { HandlerContext, Handlers } from "$fresh/server.ts";

import GitHubUser from "../../../../../interfaces/github-user.interface.ts";

import { GithubService } from "../../../../../services/github.service.ts";
import { RedisService } from "../../../../../services/redis.service.ts";
import { SessionService } from "../../../../../services/session.service.ts";

export const handler: Handlers = {
  async GET(request: Request, _: HandlerContext) {
    const code = new URLSearchParams(request.url).get("code") as string;

    await GithubService.getAccessToken(code);
    const gitHubUser = await GithubService.getUser();

    const user = await RedisService.get<GitHubUser>(gitHubUser.id.toString());
    if (!user) {
      await RedisService.set(
        gitHubUser.id.toString(),
        JSON.stringify(gitHubUser),
      );
    }

    const sessionId = crypto.randomUUID();
    await RedisService.set(sessionId, gitHubUser.id.toString(), 36000);

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
