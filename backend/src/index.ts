import {createServer} from "http";
import {Api, JsonRpc} from "eosjs";
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig.js";
import {MongoClient} from "mongodb";
import fetch from "node-fetch";
import {Server} from "socket.io";

import settings from "./settings.js";
import requests from "./requests/index.js";

import {
  BlockchainService,
  ChatService,
  GameService,
  IoService,
  LobbyService,
  PlayerService
} from "./services/index.js";

import type {Apis, Services} from "./models/index.js";

const {
  mongo: {uri},
  eos: {endpoint, contractKey},
  socket: {opts},
  server: {port}
} = settings;

const httpServer = createServer();
const socketioServer = new Server(httpServer, opts);

const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");

const rpc = new JsonRpc(endpoint, {fetch});
const signatureProvider = new JsSignatureProvider([contractKey]);
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const eosApi = new Api({rpc, signatureProvider, textDecoder, textEncoder});

const requestKeys = Object.keys(requests) as Array<keyof typeof requests>;

socketioServer.on("connection", (socket) => {
  const apis: Apis = {
    eos: eosApi,
    mongo: mongoDb,
    socket,
    io: socketioServer
  };

  const services: Services = {
    blockchainService: new BlockchainService(apis),
    chatService: new ChatService(apis, "chats"),
    gameService: new GameService(apis, "games"),
    ioService: new IoService(apis),
    lobbyService: new LobbyService(apis, "lobbies"),
    playerService: new PlayerService(apis, "players")
  };

  requestKeys.forEach((request) => {
    socket.on(request, (params: any) => { //how to specify request params type?
      requests[request](services, params);
    });
  });
});

httpServer.listen(port);
