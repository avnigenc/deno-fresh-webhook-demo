type Props = {
  onClick: (requestId: string) => void;
  requestId: string;
  message: string;
  timestamp: number;
  method: string;
};

const getMethodColor = (method: string) => {
  let color;

  switch (method) {
    case "GET":
      color = "yellow";
      break;
    case "POST":
      color = "green";
      break;
    default:
      color = "gray";
  }

  return color;
};

export default function ListItem(
  { requestId, onClick, message, timestamp, method }: Props,
) {
  return (
    <li class="py-3 sm:py-4  cursor-pointer">
      <div
        class="flex items-center space-x-4"
        onClick={() => onClick(requestId)}
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            #{requestId} | {message}
          </p>
          <p class="text-sm text-gray-500 truncate text-gray-400">
            {new Date(timestamp).toISOString()}
          </p>
        </div>
        <div class="flex-shrink-0"></div>
        <div class="inline-flex items-center text-base font-semibold text-gray-900">
          <span
            class={`bg-${getMethodColor(method)}-100 text-${
              getMethodColor(method)
            }-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-${
              getMethodColor(method)
            }-200 dark:text-${getMethodColor(method)}-900`}
          >
            {method}
          </span>
        </div>
      </div>
    </li>
  );
}
