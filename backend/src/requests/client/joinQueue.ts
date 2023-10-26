import {GameType, PlayerStatus, QueueId} from "@som/shared/enums";
import {mongo} from "app";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const joinQueue: SocketRequest = (socket, error): void => {
  const {$casualQueuePlayers, $players, $rankedQueuePlayers} = mongo;
  const socketId = socket.id;

  socket.on("joinQueue", async (params) => {
    const {queueId} = params;

    if (!(queueId in QueueId) || queueId === QueueId.NONE) {
      return error("Invalid queue selected.");
    }

    const $player = await $players.findOne({socketId});

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
      const opponents = await $casualQueuePlayers.find().toArray();

      for (const opponent of opponents) { // maybe create an interval and loop every 20 seconds for matchmaking
        if (opponent.level < level - 100 || opponent.level < level + 100) {
          const $casualQueuePlayerDelete = await $casualQueuePlayers.deleteOne({
            name: opponent.name
          });
          const $playerUpdate = await $players.updateOne({
            name: opponent.name
          }, {
            $set: {
              queueId: QueueId.NONE
            }
          });
          const $playerUpdate2 = await $players.updateOne({
            name
          }, {
            $set: {
              queueId: QueueId.NONE
            }
          });

          if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
            return error("Failed removing player from queue after match found.");
          }

          await gameHelpers.gamePopup(GameType.CASUAL, opponent.name, name);

          return;
        }
      }

      const $casualQueuePlayerInsert = await $casualQueuePlayers.insertOne({name, level});

      if (!$casualQueuePlayerInsert.insertedId) {
        return error("Failed to insert player in the queue.");
      }
    } else if (queueId === QueueId.RANKED) {
      const opponents = await $rankedQueuePlayers.find().toArray();

      for (const opponent of opponents) {
        if (opponent.elo < elo - 11250 || opponent.elo < elo + 11250) {
          const $casualQueuePlayerDelete = await $rankedQueuePlayers.deleteOne({
            name: opponent.name
          });
          const $playerUpdate = await $players.updateOne({
            name: opponent.name
          }, {
            $set: {
              queueId: QueueId.NONE
            }
          });
          const $playerUpdate2 = await $players.updateOne({
            name
          }, {
            $set: {
              queueId: QueueId.NONE
            }
          });

          if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
            return error("Failed removing player from queue after match found.");
          }

          await gameHelpers.gamePopup(GameType.RANKED, opponent.name, name);

          return;
        }
      }

      const inserted = await $rankedQueuePlayers.insertOne({name, elo});

      if (!inserted.insertedId) {
        return error("Failed to insert player in the queue.");
      }
    }

    const $playerUpdate = await $players.updateOne({socketId}, {
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
