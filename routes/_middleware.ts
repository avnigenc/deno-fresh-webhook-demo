import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { SessionService } from "../services/index.ts";
import { IGitHubUser } from "../interfaces/index.ts";
import { RedisService } from "../services/redis.service.ts";

interface State {
  user: IGitHubUser | undefined;
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

    context.state.user = await RedisService.get<IGitHubUser>(githubUserId!);
  }

  return await context.next();
}
