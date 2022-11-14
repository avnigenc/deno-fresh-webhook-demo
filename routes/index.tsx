import { PageProps } from "$fresh/src/server/types.ts";
import { Head } from "$fresh/runtime.ts";
import { HandlerContext, Handlers } from "$fresh/src/server/types.ts";

import Hero from "../islands/Hero.tsx";

import GitHubUser from "../interfaces/github-user.interface.ts";

export const handler: Handlers = {
  GET(_: Request, context: HandlerContext) {
    return context.render(context.state.user);
  },
};

export default function Home(props: PageProps<GitHubUser | null>) {
  return (
    <>
      <Head>
        <title>Webhook manager</title>
      </Head>
      <div class="p-4 mx-auto max-w">
        <Hero user={props?.data ? props?.data : null} />
      </div>
    </>
  );
}
