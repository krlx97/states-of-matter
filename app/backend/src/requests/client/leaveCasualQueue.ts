import { PlayerStatus } from "@som/shared/enums";
import {casualQueuePlayersDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const leaveCasualQueue: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("leaveCasualQueue", async () => {
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {username} = player;
    const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
      casualQueuePlayersDb.deleteOne({username}),
      playersDb.updateOne({username}, {
        $set: {
          status: PlayerStatus.ONLINE
        }
      })
    ]);

    if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) { return; }

    socket.emit("leaveCasualQueue");
  });
};

export {leaveCasualQueue};
