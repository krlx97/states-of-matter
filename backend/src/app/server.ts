import {createServer} from "http";
import {Server} from "socket.io";
import type {Responses} from "@som/shared/types/responses";
import type {Requests} from "@som/shared/types/requests";

const http = createServer();

const io = new Server<Requests, Responses>(http, {
  cors: {
    origin: "*"
  },
  serveClient: false,
  transports: ["websocket"],
  allowUpgrades: false
});

const server = {http, io};

export {server};
