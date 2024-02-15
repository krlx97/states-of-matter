import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

/**
  * Call the below functionality once per hour / day, sort & store in mongodb.
  * On signin event query the mongodb for sorted leaderboards and emit.
  * Frontend should be able to re-query on leaderboards change (emit to all?).
  * This event should then be removed.
**/

const getLeaderboards: SocketRequest = (socket, error): void => {
  const {$leaderboards} = mongo;

  socket.on("getLeaderboards", async () => {
    const $ = await $leaderboards.findOne({});

    if (!$) {
      socket.emit("getLeaderboards", {byLevel: [], byElo: []});
    } else {
      const {level, elo} = $;
      socket.emit("getLeaderboards", {byLevel: level, byElo: elo});
    }
  });
};

export {getLeaderboards};
