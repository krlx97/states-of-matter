import Service from "../Service.js";
import type {Player} from "../PlayerService/PlayerService.models";

class IoService extends Service {
  public get socketId (): string {
    return this._apis.socket.id;
  }

  public async getSocketIds(players: string[]): Promise<string[]> {
    let socketIds!: Array<string>;

    try {
      socketIds = await this._apis.mongo.collection<Player>("players")
        .find({username: {$in: players}})
        .project<Player>({_id: 0, socketId: 1})
        .map(({socketId}) => socketId)
        .toArray();
    } catch (error) {
      this._handleError(error);
    }

    return socketIds;
  }

  public emit (event: string, params?: object): void {
    this._apis.socket.emit(event, params);
  }

  public emitTo (socket_id: string | string[], event: string, params?: object): void {
    this._apis.io.to(socket_id).emit(event, params);
  }

  public on (event: string, cb: () => void): void {
    this._apis.socket.on(event, cb);
  }

  public notification (msg: string): void {
    this._apis.socket.emit("notification", {msg});
  }
}

export default IoService;
