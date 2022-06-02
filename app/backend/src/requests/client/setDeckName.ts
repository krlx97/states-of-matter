import {playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const setDeckName: SocketEvent = (socket): void => {
  const socketId = socket;

  socket.on("setDeckName", async (params) => {
    const {id, name} = params;
    const $updatePlayer = await playersDb.updateOne({
      socketId,
      "decks.id": id
    }, {
      $set: {
        "decks.$.name": name
      }
    });

    if (!$updatePlayer.modifiedCount) { return; }

    socket.emit("setDeckName", {id, name});
  });
};

export {setDeckName};
