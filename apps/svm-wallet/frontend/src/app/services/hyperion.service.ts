import {Injectable} from "@angular/core";
import HyperionSocketClient from "@eosrio/hyperion-stream-client";

@Injectable({
  providedIn: "root"
})
export class HyperionService {
  public readonly client = new HyperionSocketClient("https://testnet.telos.net", {
    async: false
  });
}
