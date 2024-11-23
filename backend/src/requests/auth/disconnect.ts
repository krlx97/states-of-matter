import {PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const disconnect: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("disconnect", async () => {
    const $player = await mongo.$players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    const {name} = $player;

    $player.socketId = "";
    $player.status = PlayerStatus.OFFLINE;

    if ($player.queueId === QueueId.CASUAL) {
      const $casualQueuePlayerDelete = await mongo
        .$casualQueuePlayers
        .deleteOne({name});

      if (!$casualQueuePlayerDelete.deletedCount) {
        return error("Error removing player from queue");
      }
    } else if ($player.queueId === QueueId.RANKED) {
      const $rankedQueuePlayerDelete = await mongo
        .$rankedQueuePlayers
        .deleteOne({name});

      if (!$rankedQueuePlayerDelete.deletedCount) {
        return error("Error removing player from queue");
      }
    }

    $player.queueId = QueueId.NONE;

    const $playerReplace = await mongo.$players.replaceOne({socketId}, $player);

    if (!$playerReplace.modifiedCount) {
      return error("Error updating player.");
    }

    const {status} = $player;
    server.io.emit("updateFriend", {name, status});
  });
};

export {disconnect};
