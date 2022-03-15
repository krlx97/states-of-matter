import type {SocketRequest} from "models";

export const saveDeck: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("saveDeck", async (params) => {
    const {cards} = params;
    const player = await $players.findOne({socketId});

    if (!player) { return; }

    const {deckId} = player;
    const updatePlayer = await $players.updateOne({
      socketId,
      "decks.id": deckId
    }, {
      $set: {
        "decks.$.cards": cards
      }
    });

    if (!updatePlayer.modifiedCount) { return; }

    socket.emit("saveDeck", {cards});
  });
};
