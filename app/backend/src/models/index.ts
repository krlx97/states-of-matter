import type {GameController} from "controllers";
import type {EosService, MongoService, SocketService} from "services";

export interface Controllers {
  gameController: GameController;
}

export interface Services {
  eosService: EosService;
  mongoService: MongoService;
  socketService: SocketService;
}

export interface App {
  controllers: Controllers;
  services: Services;
}
