import {io} from "socket.io-client";

class SocketService {
  private readonly _socket = io("ws://localhost:4200");

  get socketId () {
    return this._socket.id;
  }

  public emit (event: string, data: object = {}): void {
    this._socket.emit(event, data);
  }

  public listenToResponses (responses): void {
    Object.keys(responses).forEach((response) => {
      this._socket.on(response, (params = {}) => {
        responses[response](params);
      });
    });
  };
}

const socketService = new SocketService();

export default socketService;
