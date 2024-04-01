import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const selectDeck: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("selectDeck", async (params) => {
    const {deckId} = params;

    if (deckId < 0 || deckId > 3) {
      return error("Invalid deck.");
    }

    const $playerUpdate = await mongo.$players.updateOne({socketId}, {
      $set: {deckId}
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("selectDeck", {deckId});
  });
};

export {selectDeck};
