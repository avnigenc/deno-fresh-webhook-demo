import { PageProps } from "$fresh/src/server/types.ts";
import { HandlerContext, Handlers } from "$fresh/src/server/types.ts";

import Hero from "../islands/Hero.tsx";

import { IGitHubUser } from "../interfaces/index.ts";
import { Footer, Header, Toast } from "../components/index.ts";

export const handler: Handlers = {
  GET(_: Request, context: HandlerContext) {
    return context.render(context.state.user);
  },
};

export default function Home(props: PageProps<IGitHubUser | null>) {
  return (
    <>
      <div class="p-4 mx-auto max-w">
        <div className="isolate bg-white flex flex-col h-screen justify-start">
          <Header active={props.url.pathname} isAuthenticated={!!props.data} />
          <Hero user={props?.data ? props?.data : undefined} />
          <Footer />
        </div>
      </div>
    </>
  );
}
