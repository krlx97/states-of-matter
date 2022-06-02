import {PlayerStatus} from "@som/shared/enums";
import {rankedQueuePlayersDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const leaveRankedQueue: SocketEvent = (socket): void => {
  socket.on("leaveRankedQueue", async () => {
    const socketId = socket.id;
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {username} = player;
    const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
      rankedQueuePlayersDb.deleteOne({username}),
      playersDb.updateOne({username}, {
        $set: {
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (
      !deleteRankedQueuePlayer.deletedCount ||
      !updatePlayer.modifiedCount
    ) { return; }

    socket.emit("leaveRankedQueue");
  });
};

export {leaveRankedQueue};
