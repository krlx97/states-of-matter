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
  signatureProvider: new JsSignatureProvider([contractKey, "5JwPpzMAXT3PR1tZLMgXfNMVYdQ8EiwPsyseobU6VEY3Qp6djbE"]),
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

enum Contract {
  wallet = "eternisvm131",
  som = "eternisom141"
}

interface TransactParams {
  contract: string;
  permission: string;
  action: string;
  data: any;
}

class Leap {
  // async find () {
  //   let table!: GetTableRowsResult;

  //   try {
  //     table = await eosApi.rpc.get_table_rows({
  //       code: contractAccount,
  //       scope: contractAccount,
  //       table: "accounts",
  //       lower_bound: username,
  //       upper_bound: username,
  //       limit: 1
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   return table.rows[0];
  // }

  async transact (params: TransactParams) {
    const {contract, permission, action, data} = params;

    return await eosApi.transact({
      actions: [{
        account: contract,
        name: action,
        authorization: [{
          actor: contract,
          permission
        }],
        data
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    });
  }
}

export const leap = new Leap();

const findNFT = async (serial: number): Promise<any> => {
  const nft = await eosApi.rpc.get_table_rows({
    code: "eterninft131",
    scope: "eterninft131",
    table: "items",
    lower_bound: serial,
    upper_bound: serial
  }).catch(console.log);

  if (!nft) { return; }

  const nfttags = await eosApi.rpc.get_table_rows({
    code: "eterninft131",
    scope: nft.rows[0].group,
    table: "sharedtags",
  }).catch(console.log);

  const nftattrs = await eosApi.rpc.get_table_rows({
    code: "eterninft131",
    scope: nft.rows[0].group,
    table: "sharedattrs",
  }).catch(console.log);

  if (!nfttags || !nftattrs) { return; }

  const tags: any = {};
  const attrs: any = [];

  nfttags.rows.forEach((row) => {
    tags[row.tag_name] = row.content;
  });

  nftattrs.rows.forEach((row) => attrs.push(row));

  return {serial, tags, attrs};
};

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

interface EternitasAccountProfile {
  nonce: number;
  publicKey: string;
  name: string;
  joinedAt: number;
  avatarId: number;
  isActivated: number;
}

interface EternitasAccountTokensFungible {
  key: {
    sym: string;
    contract: string;
  };
  value: {
    total: string;
    liquid: string;
    staked: string;
    unstaking: string;
    claimable: Array<{key: number, value: string}>;
  };
}

interface EternitasAccount {
  profile: EternitasAccountProfile;
  tokens: {
    fungible: Array<EternitasAccountTokensFungible>;
    nonFungible: {
      serials: Array<number>;
    }
  }
}

export const findAccount = async (name: string): Promise<EternitasAccount | undefined> => {
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "accounts",
      lower_bound: name,
      upper_bound: name,
      limit: 1
    });
  } catch (error) {
    console.error(error);
  }

  if (!table.rows.length) {
    return undefined;
  }

  return table.rows[0];
};
export const findSOM = async (name: string): Promise<any | undefined> => {
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: "eternisom141",
      scope: "eternisom141",
      table: "players",
      lower_bound: name,
      upper_bound: name,
      limit: 1
    });
  } catch (error) {
    console.error(error);
  }

  if (!table.rows.length) { return; }

  return table.rows[0];
};

const findPlayer = async (username: string): Promise<any | undefined> => {
  const {contractAccount} = settings.eos;
  let table!: GetTableRowsResult;

  try {
    table = await eosApi.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "accounts",
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

export {findNFT, findGame, findLobby, findPlayer, transact};
