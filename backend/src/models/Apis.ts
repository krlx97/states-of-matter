import type {Api} from "eosjs";
import type {Db} from "mongodb";
import type {Server, Socket} from "socket.io";

interface Apis {
  eos: Api;
  io: Server;
  mongo: Db;
  socket: Socket;
}

export type {Apis};
