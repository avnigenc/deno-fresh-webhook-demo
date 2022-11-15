import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(request: Request, _: HandlerContext) {
    const url = new URL(request.url);
    const keys = url.searchParams.getAll("key") as string[];

    const configs = keys
      .map(Deno.env.get)
      .reduce(
        (previousValue, currentValue, currentIndex) => ({
          ...previousValue,
          [keys[currentIndex]]: currentValue,
        }),
        {},
      );

    return new Response(JSON.stringify(configs), {
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
