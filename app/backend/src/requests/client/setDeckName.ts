import type {SocketRequest} from "models";

export const setDeckName: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("setDeckName", async (params) => {
    const {id, name} = params;
    const $updatePlayer = await $players.updateOne({
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
