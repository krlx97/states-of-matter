import type {EosService, MongoService, SocketService} from "services";

export interface Services {
  eosService: EosService;
  mongoService: MongoService;
  socketService: SocketService;
}

export type SocketRequest = (services: Services) => void;
