export interface IChannelMessage {
  requestId: string;
  message: string;
  method: "GET" | "POST";
  timestamp: number;
  headers: { [key: string]: string };
  body: Body;
  query: URLSearchParams;
  size: {
    GiB: number;
    KiB: number;
    MiB: number;
    bytesize: number;
    size: string;
  };
  host: Deno.Addr;
}
