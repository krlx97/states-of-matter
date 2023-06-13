import {io, type Socket} from "socket.io-client";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

class SocketService {
  public readonly socket: Socket<SocketResponses, SocketRequests> = io(
    /*"wss://api.eternitas.games"*/
    "ws://localhost:4201",
    {
      transports: ["websocket"],
      upgrade: false,
      forceNew: false
    }
  );
}

export {SocketService};
