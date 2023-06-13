import {createServer} from "http";
import {Server} from "socket.io";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

const http = createServer();
const io = new Server<SocketRequests, SocketResponses>(http, {
  cors: {
    origin: "*"
  },
  serveClient: false,
  transports: ["websocket"],
  allowUpgrades: false
});

const server = {http, io};

export {server};
