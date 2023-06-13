import type { Socket } from "socket.io";
import type { SocketRequests } from "../requests/index.js";
import type { SocketResponses } from "../responses/index.js";
type SocketRequest = (socket: Socket<SocketRequests, SocketResponses>, error: (msg: string) => void) => void;
export type { SocketRequest };
