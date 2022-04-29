import {Effect} from "@som/shared/enums";
import type {App} from "models";

export const attackHero = (app: App): void => {
  const {controllers, services} = app;
  const {effectController, gameController} = controllers;
  const {mongoService, socketService} = services;
  const {$games, $players} = mongoService;
  const {socket, socketId} = socketService;

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

    opponentHero.health -= playerMinion.damage;

    if (await gameController.isGameOver($game)) { return; }

    playerMinion.hasAttacked = true;

    effectController.charge(playerMinion);

    await gameController.saveGame($game);
  });
};
