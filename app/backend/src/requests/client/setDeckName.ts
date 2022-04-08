import type {App} from "models";

export const setDeckName = (app: App): void => {
  const {services} = app;
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
