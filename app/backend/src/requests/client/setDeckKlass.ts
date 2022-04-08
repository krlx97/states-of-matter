import type {App} from "models";

export const setDeckKlass = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("setDeckKlass", async (params) => {
    const {deckId, klass} = params;
    const $updatePlayer = await $players.updateOne({
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
