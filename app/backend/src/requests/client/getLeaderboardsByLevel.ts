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
    ).map(({username, lv, avatarId}) => ({username, lv, avatarId}));

    const byElo = (await playersDb
      .find()
      .limit(100)
      .sort({
        "games.ranked.elo": -1
      })
      .toArray()
    ).map(({username, games: {
      ranked: {elo}
    }, avatarId}) => ({username, elo, avatarId}));

    const byDMT = (await eosApi.rpc.get_table_rows({
      code: "somgame11111",
      scope: "somgame11111",
      table: "players",
      limit: 100
    })).rows.sort((a, b) => {
      const aDmt = a.wallet.find((token: string) => token.includes("DMT"));
      const bDmt = b.wallet.find((token: string) => token.includes("DMT"));

      return parseInt(bDmt) - parseInt(aDmt);
    }).map((player) => {
      const {username} = player;
      const dmt = player.wallet.find((token: string) => token.includes("DMT"));

      return {username, dmt};
    });

    socket.emit("getLeaderboardsByLevel", {byLevel, byElo, byDMT} as any);
  });
};

export {getLeaderboardsByLevel};
