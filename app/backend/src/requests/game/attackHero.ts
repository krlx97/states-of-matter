import {Effect} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const attackHero: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("attackHero", async (params) => {
    const $player = await playersDb.findOne({socketId});
    const {attacker} = params;

    if (!$player) { return; }

    const {username, gameId} = $player;
    const game = await gamesDb.findOne({gameId});

    if (!game) { return; }
    if (game.currentPlayer !== username) { return; }

    const {player, opponent} = gameEngine.getPlayers(game, username);
    const playerMinion = player.minion[attacker];
    const opponentHero = opponent.hero;

    if (!playerMinion) { return; }
    if (!playerMinion.canAttack) { return; }

    playerMinion.canAttack = false;
    triggerEffect.multiStrike(playerMinion);

    if (opponent.trap && opponent.trap.effects.includes(Effect.MIRRORS_EDGE)) {
      player.hero.health -= playerMinion.damage;

      if (await gameEngine.isGameOver(game)) { return; }

      opponent.graveyard.push(opponent.trap);
      opponent.trap = undefined;

      return await gameEngine.saveGame(game);
    }

    opponentHero.health -= playerMinion.damage;

    if (await gameEngine.isGameOver(game)) { return; }

    await gameEngine.saveGame(game);
  });
};

export {attackHero};
