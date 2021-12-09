import type {Apis} from "../models";

class Service {
  protected readonly _apis: Apis;

  constructor (apis: Apis) {
    this._apis = apis;
  }

  protected _handleError (error: unknown): void {
    console.error(error);
    this._apis.socket.emit("notification", {msg: JSON.stringify(error)});
  }
}

export default Service;
