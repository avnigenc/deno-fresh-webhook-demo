import { useRef } from "preact/hooks";

import { Loader } from "./Loader.tsx";
import { IChannelMessage } from "../interfaces/index.ts";
import { ListItem } from "./ListItem.tsx";

interface Props {
  onClick: (requestId: string) => void;
  calls: IChannelMessage[];
}

export function List({ onClick, calls }: Props) {
  const callContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 w-full max-w-md bg-white rounded-lg border shadow-md sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900">
          latest calls
        </h5>
        <Loader />
      </div>
      <div className="flow-root" ref={callContainer}>
        <ul role="list" className="divide-y divide-gray-300">
          {calls.length > 0 &&
            calls.map((
              { requestId, method, message, timestamp }: IChannelMessage,
            ) => (
              <ListItem
                timestamp={timestamp}
                requestId={requestId}
                method={method}
                message={message}
                onClick={() => onClick(requestId)}
              />
            ))}

          {calls.length === 0 && (
            <ListItem
              timestamp={Date.now()}
              requestId={"3176f67a"}
              method={"GET"}
              message={"my first webhook"}
              onClick={() => onClick("requestId")}
            />
          )}
        </ul>
      </div>
    </div>
  );
}
