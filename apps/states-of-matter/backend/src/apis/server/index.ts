import {createServer} from "http";
import {Server} from "socket.io";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

const httpServer = createServer();
const ioServer = new Server<SocketRequests, SocketResponses>(httpServer, {
  cors: {
    origin: "*"
  },
  serveClient: false,
  transports: ["websocket"],
  allowUpgrades: false
});

export {httpServer, ioServer};
