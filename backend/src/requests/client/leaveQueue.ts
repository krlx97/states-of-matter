import {QueueId} from "@som/shared/enums";
import {mongo} from "apis";
import {leaveCasualQueue, leaveRankedQueue} from "helpers/client";
import type {SocketRequest} from "@som/shared/types/backend";

const leaveQueue: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("leaveQueue", async () => {
    const $player = await mongo.players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }
    if (!$player.queueId) {
      return error("You are not in a queue.");
    }

    const {name} = $player;

    if ($player.queueId === QueueId.CASUAL) {
      leaveCasualQueue(name);
    } else if ($player.queueId === QueueId.RANKED) {
      leaveRankedQueue(name);
    }

    socket.emit("leaveQueue");
  });
};

export {leaveQueue};
