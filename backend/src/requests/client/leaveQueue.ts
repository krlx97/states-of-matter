import {PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const leaveQueue: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$casualQueuePlayers, $players, $rankedQueuePlayers} = mongo;

  socket.on("leaveQueue", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }
    if (!$player.queueId) {
      return error("You are not in a queue.");
    }

    const {name} = $player;

    if ($player.queueId === QueueId.CASUAL) {
      const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
        $casualQueuePlayers.deleteOne({name}),
        $players.updateOne({name}, {
          $set: {
            status: PlayerStatus.ONLINE,
            queueId: 0
          }
        })
      ]);

      if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
        return error("Error removing player from queue.");
      }
    } else if ($player.queueId === QueueId.RANKED) {
      const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
        $rankedQueuePlayers.deleteOne({name}),
        $players.updateOne({name}, {
          $set: {
            status: PlayerStatus.ONLINE,
            queueId: 0
          }
        })
      ]);

      if (!deleteRankedQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
        return error("Error removing player from queue.");
      }
    }

    socket.emit("leaveQueue");
    server.io.emit("updateFriend", {name, status: PlayerStatus.ONLINE});
  });
};

export {leaveQueue};
