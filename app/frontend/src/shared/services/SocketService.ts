import {io, type Socket} from "socket.io-client";
import type {SocketResponses} from "@som/shared/interfaces/responses";
import type {SocketRequests} from "@som/shared/interfaces/requests";

export class SocketService {
  readonly socket: Socket<SocketResponses, SocketRequests>;

  constructor () {
    this.socket = io("ws://localhost:4200");
  }
}
