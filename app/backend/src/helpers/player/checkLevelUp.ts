import {playersDb} from "apis/mongo";
import {ioServer} from "apis/server";
import {getXpRequired} from "./getXpRequired";
import type {Player} from "@som/shared/types/mongo";
import { eosApi } from "apis/eos";

const checkLevelUp = async (player: Player): Promise<void> => {
  const {username, socketId} = player;
  const xpRequired = getXpRequired(player.lv);

  if (player.xp <= xpRequired) { return; }

  const xp = player.xp - xpRequired;

  await playersDb.updateOne({username}, {
    $inc: {
      lv: 1
    },
    $set: {xp}
  });

  await eosApi.transact({
    actions: [{
      account: "somgame11111",
      name: "flushtoken",
      authorization: [{
        actor: "somgame11111",
        permission: "active"
      }],
      data: {
        username, quantity: "1 DMTTEST"
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })

  ioServer.to(socketId).emit("levelUp", {xp});
};

export {checkLevelUp};
