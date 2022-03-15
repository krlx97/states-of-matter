import type {SocketRequest} from "models";

export const selectDeck: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("selectDeck", async (params) => {
    const {deckId} = params;
    const updatePlayer = await $players.updateOne({socketId}, {
      $set: {deckId}
    });

    if (!updatePlayer.modifiedCount) { return; }

    socket.emit("selectDeck", {deckId});
  });
};
