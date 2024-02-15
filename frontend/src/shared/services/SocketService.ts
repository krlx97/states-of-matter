import {io, type Socket} from "socket.io-client";
import type {Responses} from "@som/shared/types/responses";
import type {Requests} from "@som/shared/types/requests";

const socket: Socket<Responses, Requests> = io(
  "wss://som.eternitas.games",
  // "ws://localhost:4201",
  {
    transports: ["websocket"],
    upgrade: false,
    forceNew: false
  }
);

const socketService = {socket};

export {socketService};
