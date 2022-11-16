import { useEffect, useReducer, useState } from "preact/hooks";

import Authenticate from "./Authenticate.tsx";
import { IChannelMessage, IConfig, IGitHubUser } from "../interfaces/index.ts";
import { EventSourceService } from "../services/index.ts";
import { List } from "../components/index.ts";

export default function Hero(props: { user: IGitHubUser | undefined }) {
  const [calls, addCall] = useReducer<IChannelMessage[], IChannelMessage>(
    (calls, call) => [call, ...calls],
    [],
  );

  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >(undefined);

  const [selectedRequest, setSelectedRequest] = useState<
    IChannelMessage | undefined
  >(undefined);

  const [appUrl, setAppUrl] = useState<
    string | undefined
  >(undefined);

  const [config, setConfig] = useState<
    { clientId: string; callbackUrl: string } | undefined
  >(undefined);

  useEffect(() => {
    if (!props.user) {
      getConfigs().catch();
    }

    let subscription: { unsubscribe(): void };

    if (props.user) {
      setAppUrl(`${window.location.href}api/v1/webhook/${props.user.uuid}`);

      Notification.requestPermission().catch();

      subscription = EventSourceService
        .subscribeMessages(
          props.user.uuid,
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

  const getConfigs = async () => {
    const response = await fetch(
      "/api/v1/configs?key=GITHUB_OAUTH_CLIENT_ID&key=GITHUB_OAUTH_CALLBACK_URL",
    );

    const { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CALLBACK_URL } = await response
      .json() as Partial<IConfig>;

    setConfig({
      clientId: GITHUB_OAUTH_CLIENT_ID as string,
      callbackUrl: GITHUB_OAUTH_CALLBACK_URL as string,
    });
  };

  const copyToClipboard = () => {
    if (props?.user && appUrl) {
      navigator.clipboard.writeText(appUrl).catch();

      setAppUrl("copied..");
      setTimeout(() => {
        setAppUrl(`${window.location.href}api/v1/webhook/${props?.user?.uuid}`);
      }, 1000);
    }
  };

  const handleSelectedRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setSelectedRequest(
      (calls as IChannelMessage[]).find((call: IChannelMessage) =>
        call.requestId === requestId
      ),
    );
  };

  return (
    <main>
      <div class="px-6 lg:px-8">
        {props.user === undefined && (
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
                  {config &&
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
          <>
            <div className="text-center py-4 lg:px-4">
              {appUrl && (
                <div
                  onClick={copyToClipboard}
                  className="p-2 border items-center text-indigo-400 leading-none lg:rounded-full flex lg:inline-flex cursor-pointer"
                  role="alert"
                >
                  <span className="flex rounded-full text-indigo-100 bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
                    Copy
                  </span>
                  <span className="font-semibold mr-2 text-left flex-auto">
                    {appUrl}
                  </span>
                </div>
              )}
            </div>
            <div className="sm:pt-20 sm:pb-40">
              <div className="container mx-auto">
                <div className="flex">
                  <div className="flex-initial px-4 py-2 m-2">
                    <List calls={calls} onClick={handleSelectedRequest} />
                  </div>

                  {selectedRequestId && (
                    <div className="w-full text-gray-700 text-center px-4 py-2 m-2">
                      <div className="grid">
                        <div className="w-full bg-white rounded-lg border shadow-md sm:p-8">
                          <div className="flex">
                            <div className="flex-none">
                              <section className="antialiased bg-gray-100 text-gray-600">
                                <div className="flex flex-col justify-center h-full">
                                  <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border">
                                    <header className="px-5 py-4 border-b border-gray-100">
                                      <h2 className="font-semibold text-gray-800">
                                        request details
                                      </h2>
                                    </header>
                                    <div className="p-3">
                                      <div className="overflow-x-auto">
                                        <table className="table-auto">
                                          <tbody className="text-sm divide-y divide-gray-100">
                                            {selectedRequest && (
                                              <>
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        method
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {selectedRequest.method}
                                                    </div>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        request id
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {selectedRequest
                                                        .requestId}
                                                    </div>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        timestamp
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {selectedRequest
                                                        .timestamp} - {new Date(
                                                        selectedRequest
                                                          .timestamp,
                                                      ).toISOString()}
                                                    </div>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        size
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {selectedRequest.size
                                                        .size}
                                                    </div>
                                                  </td>
                                                </tr>
                                              </>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col justify-center h-full pt-4">
                                  <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border">
                                    <header className="px-5 py-4 border-b border-gray-100">
                                      <h2 className="font-semibold text-gray-800">
                                        headers
                                      </h2>
                                    </header>
                                    <div className="p-3">
                                      <div className="overflow-x-auto">
                                        <table className="table-auto">
                                          <tbody className="text-sm divide-y divide-gray-100">
                                            {selectedRequest &&
                                              Object.entries(
                                                selectedRequest.headers,
                                              ).map(([key, value]) => (
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        {key}
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {value}
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedRequest && selectedRequest.body && (
                                  <div className="flex flex-col justify-center h-full pt-4">
                                    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border">
                                      <header className="px-5 py-4 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-800">
                                          body
                                        </h2>
                                      </header>
                                      <div className="p-3">
                                        <div className="overflow-x-auto">
                                          <table className="table-auto">
                                            <tbody className="text-sm divide-y divide-gray-100">
                                              {selectedRequest &&
                                                Object.entries(
                                                  selectedRequest.body,
                                                ).map(([key, value]) => (
                                                  <tr>
                                                    <td className="p-2 whitespace-nowrap">
                                                      <div className="flex items-center">
                                                        <div className="font-medium text-gray-800">
                                                          {key}
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                      <div className="text-left">
                                                        {value}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-col justify-center h-full pt-4">
                                  <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border">
                                    <header className="px-5 py-4 border-b border-gray-100">
                                      <h2 className="font-semibold text-gray-800">
                                        query
                                      </h2>
                                    </header>
                                    <div className="p-3">
                                      <div className="overflow-x-auto">
                                        <table className="table-auto">
                                          <tbody className="text-sm divide-y divide-gray-100">
                                            {selectedRequest &&
                                              Object.entries(
                                                selectedRequest.query,
                                              ).map(([key, value]) => (
                                                <tr>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="font-medium text-gray-800">
                                                        {key}
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">
                                                      {value}
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
