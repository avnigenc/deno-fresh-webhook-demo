import { useEffect, useReducer, useState } from "preact/hooks";

import Authenticate from "./Authenticate.tsx";
import GitHubUser from "../interfaces/github-user.interface.ts";
import { EventSourceService } from "../services/event-source.service.ts";
import { IChannelMessage } from "../interfaces/channel-message.interface.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import List from "../components/List.tsx";

export default function Hero(props: { user: GitHubUser | null }) {
  const { user } = props;

  const [calls, addCall] = useReducer<IChannelMessage[], IChannelMessage>(
    (calls, call) => [call, ...calls],
    [],
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>(undefined);

  const [config, setConfig] = useState<
    { clientId: string; callbackUrl: string } | undefined
  >(undefined);

  useEffect(() => {
    if (!props.user) {
      callConfigs().catch();
    }

    let subscription: { unsubscribe(): void };

    if (props.user) {
      Notification.requestPermission().catch();

      subscription = EventSourceService
        .subscribeMessages(
          props.user.id.toString(),
          (channelMessage: IChannelMessage) => {
            if (Notification.permission === "granted") {
              new Notification(
                `New request!`,
                {
                  body: `new request received: ${channelMessage.requestId}`,
                },
              );
            }

            addCall(channelMessage);
          },
        );
    }

    return () => subscription.unsubscribe();
  }, []);

  const callConfigs = async () => {
    const promises = await Promise.all(
      [
        "/api/v1/configs?key=GITHUB_OAUTH_CLIENT_ID",
        "/api/v1/configs?key=GITHUB_OAUTH_CALLBACK_URL",
      ].map((endpoint) => fetch(endpoint)),
    );

    const [r, t] = promises;
    const clientId = await r.text();
    const callbackUrl = await t.text();

    setConfig({ clientId, callbackUrl });
  };

  return (
    <div class="isolate bg-white flex flex-col h-screen justify-start">
      <Header />
      <main>
        <div class="px-6 lg:px-8">
          {props.user === null && (
            <div class="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div>
                  <h1 class="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    organise your webhooks
                  </h1>
                  <div className="mt-8 flex justify-center">
                    <a href="https://fresh.deno.dev">
                      <img
                        width="156"
                        height="30"
                        src="https://fresh.deno.dev/fresh-badge.svg"
                        alt="Made with Fresh"
                      />
                    </a>
                  </div>
                  <p class="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    deno - fresh `learning/demo` project
                  </p>

                  <div class="mt-8 flex justify-center">
                    {!user && config &&
                      (
                        <Authenticate
                          client_id={config?.clientId}
                          redirect_uri={config?.callbackUrl}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {props.user && (
            <div class="sm:pt-20 sm:pb-40">
              <div class="container mx-auto">
                <div class="flex">
                  <div class="flex-initial px-4 py-2 m-2">
                    <List calls={calls} onClick={setSelectedRequestId} />
                  </div>

                  { selectedRequestId && (
                    <div className="flex-initial text-gray-700 text-center px-4 py-2 m-2">
                      <div className="w-full mx-auto grid">
                        <div className="w-full bg-white rounded-lg border shadow-md sm:p-8">
                          {selectedRequestId}
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}