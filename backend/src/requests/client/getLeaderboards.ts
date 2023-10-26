import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

/**
  * Call the below functionality once per hour / day, sort & store in mongodb.
  * On signin event query the mongodb for sorted leaderboards and emit.
  * Frontend should be able to re-query on leaderboards change (emit to all?).
  * This event should then be removed.
**/

const getLeaderboards: SocketRequest = (socket, error): void => {
  const {$accounts, $players} = mongo;

  socket.on("getLeaderboards", async () => {
    const byLevel = (await $players
      .find()
      .limit(100)
      .sort({
        level: -1
      })
      .toArray()
    ).map(({name, level}) => ({name, level, avatarId: 1}));

    for (let i = 0; i < byLevel.length; i += 1) {
      const $account = await $accounts.findOne({name: byLevel[i].name});
      if (!$account) { return; }
      const {avatarId} = $account;
      byLevel[i].avatarId = avatarId;
    }

    const byElo = (await $players
      .find()
      .limit(100)
      .sort({
        elo: -1
      })
      .toArray()
    ).map(({name, elo}) => ({name, elo, avatarId: 1}));

    for (let i = 0; i < byElo.length; i += 1) {
      const $account = await $accounts.findOne({name: byElo[i].name});
      if (!$account) { return; }
      const {avatarId} = $account;
      byElo[i].avatarId = avatarId;
    }

    socket.emit("getLeaderboards", {byLevel, byElo});
  });
};

export {getLeaderboards};
