import {createServer} from "http";
import {Api, JsonRpc} from "eosjs";
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig.js";
import {MongoClient} from "mongodb";
import fetch from "node-fetch";
import {Server} from "socket.io";

import settings from "settings";
import * as requests from "requests";
import {
  BlockchainService,
  ChatService,
  GameService,
  SocketService,
  LobbyService,
  PlayerService
} from "services";

import type {Apis, Services, SocketRequestParams} from "models";

const {
  mongo: {uri},
  eos: {endpoint, contractKey},
  socket: {opts},
  server: {port}
} = settings;

const httpServer = createServer();
const ioServer = new Server(httpServer, opts);

const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");

const rpc = new JsonRpc(endpoint, {fetch});
const signatureProvider = new JsSignatureProvider([contractKey]);
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const eosApi = new Api({rpc, signatureProvider, textDecoder, textEncoder});

const requestKeys = Object.keys(requests) as Array<keyof typeof requests>;

ioServer.on("connection", (socket): void => {
  const apis: Apis = {
    eos: eosApi,
    mongo: mongoDb,
    socket,
    io: ioServer
  };

  const services: Services = {
    blockchainService: new BlockchainService(apis),
    chatService: new ChatService(apis, "chats"),
    gameService: new GameService(apis, "games"),
    lobbyService: new LobbyService(apis, "lobbies"),
    playerService: new PlayerService(apis, "players"),
    socketService: new SocketService(apis)
  };

  requestKeys.forEach((request): void => {
    socket.on(request, (params: SocketRequestParams): void => {
      requests[request](services, params);
    });
  });
});

httpServer.listen(port);
