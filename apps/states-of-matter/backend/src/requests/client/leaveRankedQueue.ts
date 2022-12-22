import {PlayerStatus} from "@som/shared/enums";
import {rankedQueuePlayersDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const leaveRankedQueue: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("leaveRankedQueue", async () => {
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {name} = player;
    const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
      rankedQueuePlayersDb.deleteOne({username: name}),
      playersDb.updateOne({name}, {
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
