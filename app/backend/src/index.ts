import {createServer} from "http";
import process from "process";

import {Api, JsonRpc} from "eosjs";
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig.js";
import {MongoClient} from "mongodb";
import fetch from "node-fetch";
import {Server} from "socket.io";

import settings from "settings";
import {GameController} from "controllers";
import {requests} from "requests";
import {EosService, MongoService, SocketService} from "services";
import type {Controllers, Services} from "models";

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

const eosApi = new Api({
  rpc: new JsonRpc(endpoint, {fetch}),
  signatureProvider: new JsSignatureProvider([contractKey]),
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

const eosService = new EosService(eosApi);
const mongoService = new MongoService(mongoDb);

ioServer.on("connection", (socket): void => {
  const socketService = new SocketService(ioServer, socket);
  const services: Services = {eosService, mongoService, socketService};

  const gameController = new GameController(services);
  const controllers: Controllers = {gameController};

  requests.forEach((request): void => request({services, controllers}));
});

process.on("unhandledRejection", async (reason, promise) => {
  const occuredAt = Date.now();

  await mongoDb.collection("errors").insertOne({occuredAt, promise, reason});

  console.log("Error!\n", {reason, promise});
});

httpServer.listen(port);
