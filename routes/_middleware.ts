import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { SessionService } from "../services/session.service.ts";
import { RedisService } from "../services/redis.service.ts";
import GitHubUser from "../interfaces/github-user.interface.ts";

interface State {
  user: GitHubUser | undefined;
}

export async function handler(
  request: Request,
  context: MiddlewareHandlerContext<State>,
) {
  const sessionId = SessionService.get(request.headers);

  if (sessionId) {
    const githubUserId = await RedisService.get<string>(sessionId);

    if (!githubUserId) {
      context.state.user = undefined;
      return await context.next();
    }

    const user = await RedisService.get(githubUserId!);
    context.state.user = <GitHubUser> user;
  }

  return await context.next();
}
