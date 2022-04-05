import type {EosService, GameEngine, MongoService, SocketService} from "services";

export interface Services {
  eosService: EosService;
  mongoService: MongoService;
  socketService: SocketService;
  gameEngine: GameEngine;
}

export type SocketRequest = (services: Services) => void;
