import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const saveDeck: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("saveDeck", async (params) => {
    const {cards} = params;
    const player = await playersDb.findOne({socketId});

    if (!player) { return; }

    const {deckId} = player;
    const $updatePlayer = await playersDb.updateOne({
      socketId,
      "decks.id": deckId
    }, {
      $set: {
        "decks.$.cards": cards
      }
    });

    if (!$updatePlayer.modifiedCount) { return; }

    socket.emit("saveDeck", {cards});
  });
};

export {saveDeck};
