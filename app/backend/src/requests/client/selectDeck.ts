import type {App} from "models";

export const selectDeck = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("selectDeck", async (params) => {
    const {deckId} = params;
    const $updatePlayer = await $players.updateOne({socketId}, {
      $set: {deckId}
    });

    if (!$updatePlayer.modifiedCount) { return; }

    socket.emit("selectDeck", {deckId});
  });
};
