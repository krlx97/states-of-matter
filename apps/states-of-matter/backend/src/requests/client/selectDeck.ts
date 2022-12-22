import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const selectDeck: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("selectDeck", async (params) => {
    const {deckId} = params;
    const $updatePlayer = await playersDb.updateOne({socketId}, {
      $set: {deckId}
    });

    if (!$updatePlayer.modifiedCount) { return; }

    socket.emit("selectDeck", {deckId});
  });
};

export {selectDeck};
