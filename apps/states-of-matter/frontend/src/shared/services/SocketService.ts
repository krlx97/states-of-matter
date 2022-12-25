import {io, type Socket} from "socket.io-client";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

export class SocketService {
  public readonly socket: Socket<SocketResponses, SocketRequests> = io("ws://127.0.0.1:4201", {
    transports: ['websocket'],
    upgrade: false,
    forceNew: false
  });
}
