import {eosApi, findNFT, leap} from "apis/eos";
import { randomInt } from "crypto";
import type {SocketEvent} from "models";

const mint: SocketEvent = (socket): void => {
  socket.on("mint", async (params) => {
    const rand = randomInt(1, 4);

    const transaction = await leap.transact({
      contract: "eternisvm131",
      action: "mint",
      permission: "active",
      data: {
        i: rand,
        ...params
      }
    });

    if (!transaction) {
      socket.emit("notification", "Error while signing mint action.");
      return;
    }

    const table = await eosApi.rpc.get_table_rows({
      code: "eterninft131",
      scope: "eterninft131",
      table: "config"
    });

    if (!table.rows.length) {
      socket.emit("notification", "NFT was minted, but there was an error updating your UI. Please relog.");
    }

    const nft = await findNFT(table.rows[0].last_serial);

    socket.emit("mint", {nft});
  });
};

export {mint};
