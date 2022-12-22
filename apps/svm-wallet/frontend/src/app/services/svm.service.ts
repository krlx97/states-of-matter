import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AES, enc} from "crypto-js";
import {Api, JsonRpc} from "eosjs";
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig.js";

declare const eosjs_ecc: any;

@Injectable({
  providedIn: "root"
})
export class SvmService {
  public constructor (private readonly _matSnackBar: MatSnackBar) {}

  private readonly _handle = (error: Error) => {
    const message = error.message.replace("assertion failure with message: ", "");

    this._matSnackBar.open(`Error: ${message}`, "OK");
  };

  public readonly fees = new Map<string, string>([
    ["TLOS", "0.1000 TLOS"],
    ["VMT", "0.1000 VMT"],
    ["SPS", "0.1000 VMT"]
  ]);

  public readonly contractAccount = "eternisvm131";
  public readonly api = new Api({
    rpc: new JsonRpc("https://testnet.telos.net"),
    signatureProvider: new JsSignatureProvider(["5J9QDGDDjK7H4tUdChmfANqWGrXvKDRK1KXB5dXcjActcs5E9wD"]),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  public async push (name: string, data: any) {
    const {contractAccount} = this;
    const transaction = await this.api.transact({
      actions: [{
        account: contractAccount,
        name,
        authorization: [{
          actor: contractAccount,
          permission: "active"
        }],
        data
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    }).catch(this._handle);

    return transaction;
  }

  public encrypt (privateKey: string, password: string): string {
    return AES.encrypt(privateKey, password).toString();
  }

  public decrypt (privateKeyHash: string, password: string): string {
    return AES.decrypt(privateKeyHash, password).toString(enc.Utf8);
  }

  public sign (nonce: string, privateKey: string): string {
    return eosjs_ecc.sign(nonce, privateKey)
  }

  public async randomKey (): Promise<string> {
    return await eosjs_ecc.randomKey()
  }

  public privateToPublic (privateKey: string): string {
    return eosjs_ecc.privateToPublic(privateKey)
  }

  public isValidPrivate (privateKey: string): boolean {
    return eosjs_ecc.isValidPrivate(privateKey);
  }
}
