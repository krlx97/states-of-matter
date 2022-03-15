import type {Server, Socket} from "socket.io";
import type {SocketResponses} from "@som/shared/interfaces/responses";
import type {SocketRequests} from "@som/shared/interfaces/requests";

export class SocketService {
  public readonly io: Server<SocketRequests, SocketResponses>;
  public readonly socket: Socket<SocketRequests, SocketResponses>;
  public readonly socketId: string;

  constructor (io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.socketId = socket.id;
  }
}
