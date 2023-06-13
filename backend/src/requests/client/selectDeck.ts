import {mongo} from "apis";
import type {SocketRequest} from "@som/shared/types/backend";

const selectDeck: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {players} = mongo;

  socket.on("selectDeck", async (params) => {
    const {deckId} = params;

    if (deckId < 0 || deckId > 3) {
      return error("Invalid deck range.");
    }

    const $playerUpdate = await players.updateOne({socketId}, {
      $set: {deckId}
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Failed to set deck id.");
    }

    socket.emit("selectDeck", {deckId});
  });
};

export {selectDeck};
