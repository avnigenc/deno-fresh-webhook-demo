export interface IChannelMessage {
  requestId: string;
  message: string;
  method: "GET" | "POST";
  timestamp: number;
}
