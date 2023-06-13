import {PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo} from "apis";
import {joinCasualQueue, joinRankedQueue} from "helpers/client";
import type {SocketRequest} from "@som/shared/types/backend";

const joinQueue: SocketRequest = (socket, error): void => {
  const {players} = mongo;
  const socketId = socket.id;

  socket.on("joinQueue", async (params) => {
    const {queueId} = params;

    if (!(queueId in QueueId) || queueId === QueueId.NONE) {
      return error("Invalid queue selected.");
    }

    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }
    if ($player.queueId) {
      return error("You are already in a queue.");
    }
    if ($player.lobbyId) {
      return error("Can't join queue while in lobby.");
    }
    if ($player.gameId) {
      return error("Can't join queue while in game.");
    }
    if ($player.gamePopupId) {
      return error("Can't join queue while in game popup.");
    }

    const {name, level, elo} = $player;

    if (queueId === QueueId.CASUAL) {
      joinCasualQueue(name, level);
    } else if (queueId === QueueId.RANKED) {
      joinRankedQueue(name, elo);
    }

    const $playerUpdate = await players.updateOne({socketId}, {
      $set: {
        status: PlayerStatus.IN_QUEUE,
        queueId
      }
    })

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("joinQueue", {queueId});
  });
};

export {joinQueue};
