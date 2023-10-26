import type {Socket} from "socket.io";
import type {Requests} from "../requests/index.js";
import type {Responses} from "../responses/index.js";

type SocketRequest = (
  socket: Socket<Requests, Responses>,
  error: (msg: string) => void
) => void;

export type {SocketRequest};
