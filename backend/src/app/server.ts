import {createServer} from "http";
import express from "express";
import {Server} from "socket.io";
import type {Responses} from "@som/shared/types/responses";
import type {Requests} from "@som/shared/types/requests";

const app = express();
const http = createServer(app);

const io = new Server<Requests, Responses>(http, {
  cors: {
    origin: "*"
  },
  serveClient: false,
  transports: ["websocket"],
  allowUpgrades: false
});

const server = {app, http, io};

export {server};
