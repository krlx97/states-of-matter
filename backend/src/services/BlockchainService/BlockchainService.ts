import settings from "../../settings.js";
import Service from "../Service.js";

import type {
  GetTableRowsResult,
  PushTransactionArgs,
  ReadOnlyTransactResult,
} from "eosjs/dist/eosjs-rpc-interfaces";

import type {TransactResult} from "eosjs/dist/eosjs-api-interfaces";
// import type {Game, Lobby, Player} from "models"

class BlockchainService extends Service {
  // public async findPlayer (username: string): Promise<Player | undefined> {
  //   const {contractAccount} = settings.eos;
  //   let table!: GetTableRowsResult;

  //   try {
  //     table = await this._apis.eos.rpc.get_table_rows({
  //       code: contractAccount,
  //       scope: contractAccount,
  //       table: "players",
  //       lower_bound: username,
  //       upper_bound: username,
  //       limit: 1
  //     });
  //   } catch (error) {
  //     this._handleError(error);
  //   }

  //   return table.rows[0];
  // }

  // public async findLobby (lobby_id: number): Promise<Lobby | undefined> {
  //   const {contractAccount} = settings.eos;
  //   let table!: GetTableRowsResult;

  //   try {
  //     table = await this._apis.eos.rpc.get_table_rows({
  //       code: contractAccount,
  //       scope: contractAccount,
  //       table: "lobbies",
  //       lower_bound: lobby_id,
  //       upper_bound: lobby_id
  //     });
  //   } catch (error) {
  //     this._handleError(error);
  //   }

  //   return table.rows[0];
  // }

  // public async findGame (game_id: number): Promise<Game | undefined> {
  //   const {contractAccount} = settings.eos;
  //   let table!: GetTableRowsResult;

  //   try {
  //     table = await this._apis.eos.rpc.get_table_rows({
  //       code: contractAccount,
  //       scope: contractAccount,
  //       table: "games",
  //       lower_bound: game_id,
  //       upper_bound: game_id
  //     });
  //   } catch (error) {
  //     this._handleError(error);
  //   }

  //   return table.rows[0];
  // }

  public async transact (
    action: string,
    data: object
  ): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> {
    const {contractAccount} = settings.eos;
    let transaction!: TransactResult | ReadOnlyTransactResult | PushTransactionArgs;

    try {
      transaction = await this._apis.eos.transact({
        actions: [{
          account: contractAccount,
          name: action,
          authorization: [{
            actor: contractAccount,
            permission: "active"
          }],
          data
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      });
    } catch (error) {
      this._handleError(error);
    }

    return transaction;
  }
}

export default BlockchainService;
