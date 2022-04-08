import {App} from "models";

export const hoverCard = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("hoverCard", async (params) => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {opponent} = gameController.getPlayers($game, username);
    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("hoverCard", params);
  });
};
