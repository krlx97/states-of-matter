import type {App} from "models";

export const attackHero = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("attackHero", async (params) => {
    const {attacker} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {player, opponent} = gameController.getPlayers($game, username);
    const playerMinion = player.minion[attacker];
    const opponentHero = opponent.hero;

    if (!playerMinion) { return; }
    if (playerMinion.hasAttacked) { return; }

    // playerMinion.health -= opponentHero.damage;
    opponentHero.health -= playerMinion.damage;
    playerMinion.hasAttacked = true;

    if (await gameController.isGameOver($game)) { return; }

    // if (playerMinion.health <= 0) {
    //   player.graveyard.push(playerMinion);
    //   player.minion[attacker] = undefined;
    // }

    const savedGame = await gameController.saveGame($game);

    if (!savedGame) { return; }

    socket.emit("attackHero|player", {attacker});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("attackHero|opponent", {attacker});
  });
};
