import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const setDeckKlass: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("setDeckKlass", async (params) => {
    const {deckId, klass} = params;
    const $updatePlayer = await playersDb.updateOne({
      socketId,
      "decks.id": deckId
    }, {
      $set: {
        "decks.$.klass": klass
      }
    });

    if (!$updatePlayer.modifiedCount) { return; }

    socket.emit("setDeckKlass", {deckId, klass});
  });
};

export {setDeckKlass};
