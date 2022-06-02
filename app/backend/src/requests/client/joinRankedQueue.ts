import { PlayerStatus } from "@som/shared/enums";
import {rankedQueuePlayersDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const joinRankedQueue: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("joinRankedQueue", async () => {
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {username, games} = player;
    const {elo} = games.ranked;
    const rankedQueuePlayers = await rankedQueuePlayersDb.find().toArray();

    for (const opponent of rankedQueuePlayers) {
      if (opponent.elo < elo - 1000 || opponent.elo < elo + 1000) {
        const deleteRankedQueuePlayer = await rankedQueuePlayersDb.deleteOne({
          username: opponent.username
        });

        if (!deleteRankedQueuePlayer.deletedCount) { return; }

        await gameEngine.startGame("ranked", opponent.username, username);

        return;
      }
    }

    const insertRankedQueuePlayer = await rankedQueuePlayersDb
      .insertOne({username, elo});

    const updatedPlayer = await playersDb.findOneAndUpdate({socketId}, {
      $set: {
        status: PlayerStatus.IN_RANKED_QUEUE
      }
    }, {
      returnDocument: "after"
    });

    if (!insertRankedQueuePlayer.insertedId || !updatedPlayer.value) { return; }

    socket.emit("joinRankedQueue");
  });
};

export {joinRankedQueue};
