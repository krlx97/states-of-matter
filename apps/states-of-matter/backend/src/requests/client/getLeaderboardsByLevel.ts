import {eosApi} from "apis/eos";
import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const getLeaderboardsByLevel: SocketEvent = (socket): void => {
  socket.on("getLeaderboardsByLevel", async () => {
    const byLevel = (await playersDb
      .find()
      .limit(100)
      .sort({
        lv: -1
      })
      .toArray()
    ).map(({name: username, lv, avatarId}) => ({username, lv, avatarId: 1}));

    const byElo = (await playersDb
      .find()
      .limit(100)
      .sort({
        "games.ranked.elo": -1
      })
      .toArray()
    ).map(({name: username, games: {
      ranked: {elo}
    }, avatarId}) => ({username, elo, avatarId: 1}));

    const byDMT = (await eosApi.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "accounts",
      limit: 100
    })).rows.sort((a, b) => {
      // console.log(a);
      let aStake: any = a.tokens.fungible.find((token: any) => token.key.sym.includes("VMT"));
      let bStake: any = b.tokens.fungible.find((token: any) => token.key.sym.includes("VMT"));

      let aVal = "0.0000 VMT";
      let bVal = "0.0000 VMT";

      console.log(aStake);

      if (aStake) {
        aVal = aStake.value.staked;
      }

      if (bStake) {
        bVal = bStake.value.staked;
      }
      // if (!aVal) { aVal = "0.0000 VMT"; }
      // if (!bVal) { bVal = "0.0000 VMT"; }


      return parseInt(bVal) - parseInt(aVal);
    }).map((player) => {
      const {name} = player.profile;
      const dmt = player.tokens.fungible.find((token: any) => token.key.sym.includes("VMT"));

      let val = "0.0000 VMT";

      if (dmt) {
        val = dmt.value.staked;
      }

      return {username: name, dmt: val};
    });

    socket.emit("getLeaderboardsByLevel", {byLevel, byElo, byDMT} as any);
  });
};

export {getLeaderboardsByLevel};
