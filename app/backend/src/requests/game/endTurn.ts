import type {App} from "models";

export const endTurn = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("endTurn", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    if ($game.currentPlayer !== username) { return; }

    const {opponent} = gameController.getPlayers($game, username);
    const {hero, minion} = opponent;

    await gameController.drawCard(gameId, opponent);

    hero.mana = 100;

    const minionKeys = Object.keys(minion) as Array<keyof typeof minion>;

    minionKeys.forEach((key) => {
      const Minion = minion[key];
      if (!Minion) { return; }
      Minion.hasAttacked = false;
      Minion.hasTriggeredEffect = false;
    });

    $game.currentPlayer = opponent.username;

    await gameController.saveGame($game);
  });
};
