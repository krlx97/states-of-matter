import {io, type Socket} from "socket.io-client";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

export class SocketService {
  readonly socket: Socket<SocketResponses, SocketRequests>;

  constructor () {
    this.socket = io("ws://localhost:4200");
  }
}
