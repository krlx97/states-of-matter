import type {App} from "models";

export const joinCasualQueue = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$players, $casualQueue} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("joinCasualQueue", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, lv} = $player;

    const allPlayersInQueue = await $casualQueue.find().toArray();

    for (const player of allPlayersInQueue) {
      if (player.lv < lv - 10 || player.lv < lv + 10) {
        await gameController.startGame(player.username, username);
        return;
      }
    }

    const insertedPlayerInQueue = await $casualQueue.insertOne({username, lv});

    if (!insertedPlayerInQueue.insertedId) { return; }
  });
};
