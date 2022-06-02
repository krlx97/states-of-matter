import {createServer} from "http";
import {Server} from "socket.io";
import settings from "settings";
import type {SocketResponses} from "@som/shared/types/responses";
import type {SocketRequests} from "@som/shared/types/requests";

const {socket: {opts}} = settings;
const httpServer = createServer();
const ioServer = new Server<SocketRequests, SocketResponses>(httpServer, opts);

export {httpServer, ioServer};
