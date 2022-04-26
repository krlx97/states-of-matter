import {Effect} from "@som/shared/enums";
import type {App} from "models";

export const attackMinion = (app: App): void => {
  const {controllers, services} = app;
  const {gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("attackMinion", async (params) => {
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
        console.log("triggered")
      }
    }

    if (playerMinion.health <= 0) {
      if (playerMinion.effects.includes(Effect.GREED)) {
        await gameController.drawCard(gameId, player);
      }

      playerMinion.health = playerMinion.maxHealth;

      player.graveyard.push(playerMinion);
      player.minion[attacker] = undefined;
    }

    if (opponentMinion.health <= 0) {
      opponentMinion.health = opponentMinion.maxHealth;

      opponent.graveyard.push(opponentMinion);
      opponent.minion[attacked] = undefined;
    }

    await gameController.saveGame($game);
  });
};
