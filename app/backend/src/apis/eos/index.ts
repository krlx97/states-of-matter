import {Api, JsonRpc} from "eosjs";
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig.js";
import fetch from "node-fetch";
import settings from "settings";

import type {
  GetTableRowsResult,
  PushTransactionArgs,
  ReadOnlyTransactResult
} from "eosjs/dist/eosjs-rpc-interfaces";

import type {TransactResult} from "eosjs/dist/eosjs-api-interfaces";

const {
  eos: {endpoint, contractKey}
} = settings;

export const eosApi = new Api({
  rpc: new JsonRpc(endpoint, {fetch}),
  signatureProvider: new JsSignatureProvider([contractKey]),
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

const findGame = async (game_id: number): Promise<any | undefined> => {
  const {contractAccount} = settings.eos;
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: contractAccount,
      scope: contractAccount,
      table: "games",
      lower_bound: game_id,
      upper_bound: game_id,
      limit: 1
    });
  } catch (error) {
    console.error(error);
  }

  return table.rows[0];
};

const findLobby = async (lobby_id: number): Promise<any | undefined> => {
  const {contractAccount} = settings.eos;
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: contractAccount,
      scope: contractAccount,
      table: "lobbies",
      lower_bound: lobby_id,
      upper_bound: lobby_id,
      limit: 1
    });
  } catch (error) {
    console.error(error);
  }

  return table.rows[0];
};

const findPlayer = async (username: string): Promise<any | undefined> => {
  const {contractAccount} = settings.eos;
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: contractAccount,
      scope: contractAccount,
      table: "players",
      lower_bound: username,
      upper_bound: username,
      limit: 1
    });
  } catch (error) {
    console.error(error);
  }

  return table.rows[0];
};


const transact = async (action: string, data: object): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> => {
  const {contractAccount} = settings.eos;

  return await eosApi.transact({
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
};

export {findGame, findLobby, findPlayer, transact};
