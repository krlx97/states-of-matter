import {PlayerStatus} from "@som/shared/enums";
import {casualQueuePlayersDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const joinCasualQueue: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("joinCasualQueue", async () => {
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {name, lv} = player;
    const casualQueuePlayers = await casualQueuePlayersDb.find().toArray();

    for (const opponent of casualQueuePlayers) {
      if (opponent.lv < lv - 100 || opponent.lv < lv + 100) {
        const deleteCasualQueuePlayer = await casualQueuePlayersDb.deleteOne({
          username: opponent.username
        });

        if (!deleteCasualQueuePlayer.deletedCount) { return; }

        // await gameEngine.startGame("casual", opponent.username, name);
        await gameEngine.gamePopup(opponent.username, name);

        return;
      }
    }

    const insertCasualQueuePlayer = await casualQueuePlayersDb.insertOne({username: name, lv});
    const updatedPlayer = await playersDb.findOneAndUpdate({socketId}, {
      $set: {
        status: PlayerStatus.IN_CASUAL_QUEUE
      }
    }, {
      returnDocument: "after"
    });

    if (!insertCasualQueuePlayer.insertedId || !updatedPlayer.value) { return; }

    socket.emit("joinCasualQueue");
  });
};

export {joinCasualQueue};
