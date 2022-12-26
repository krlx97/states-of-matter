import {io, type Socket} from "socket.io-client";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

export class SocketService {
  public readonly socket: Socket<SocketResponses, SocketRequests> = io("wss://api.eternitas.games", {
    transports: ['websocket'],
    upgrade: false,
    forceNew: false
  });
}
