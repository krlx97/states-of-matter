import {Effect} from "@som/shared/enums";
import type {App} from "models";

export const attackMinion = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {io, socket, socketId} = socketService;

  socketService.socket.on("attackMinion", async (params) => {
    const {attacked, attacker} = params;
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await $games.findOne({gameId});

    if (!$game) { return; }

    const {player, opponent} = gameController.getPlayers($game, username);
    const playerMinion = player.minion[attacker];
    const opponentMinion = opponent.minion[attacked];

    if (!playerMinion || !opponentMinion) { return; }
    if (playerMinion.hasAttacked) { return; }

    playerMinion.health -= opponentMinion.damage;
    opponentMinion.health -= playerMinion.damage;
    playerMinion.hasAttacked = true;

    if (!playerMinion.hasTriggeredEffect) {
      if (playerMinion.effects.includes(Effect.CHARGE)) {
        playerMinion.hasAttacked = false;
        playerMinion.hasTriggeredEffect = true;
      }
    }

    if (playerMinion.health <= 0) {
      playerMinion.health = playerMinion.maxHealth;

      player.graveyard.push(playerMinion);
      player.minion[attacker] = undefined;
    }

    if (opponentMinion.health <= 0) {
      playerMinion.health = playerMinion.maxHealth;

      opponent.graveyard.push(opponentMinion);
      opponent.minion[attacked] = undefined;
    }

    const savedGame = await gameController.saveGame($game);

    if (!savedGame) { return; }

    socket.emit("attackMinion|player", {attacked, attacker});

    const $opponent = await $players.findOne({
      username: opponent.username
    });

    if (!$opponent || !$opponent.socketId) { return; }

    io.to($opponent.socketId).emit("attackMinion|opponent", {attacked, attacker});
  });
};
