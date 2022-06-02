import {Effect} from "@som/shared/enums";
import {gamesDb, playersDb} from "apis/mongo";
import gameEngine from "helpers/game";
import type {SocketEvent} from "models";

const attackMinion: SocketEvent = (socket): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("attackMinion", async (params) => {
    const {attacked, attacker} = params;
    const $player = await playersDb.findOne({socketId});

    if (!$player) { return; }

    const {username, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== username) { return; }

    const {player, opponent} = gameEngine.getPlayers($game, username);
    const playerMinion = player.minion[attacker];
    const opponentMinion = opponent.minion[attacked];

    if (!playerMinion || !opponentMinion) { return; }
    if (!playerMinion.canAttack) { return; }

    playerMinion.canAttack = false;
    triggerEffect.multiStrike(playerMinion);

    if (opponent.trap && opponent.trap.effects.includes(Effect.MIRRORS_EDGE)) {
      player.hero.health -= playerMinion.damage;

      if (await gameEngine.isGameOver($game)) { return; }

      opponent.graveyard.push(opponent.trap);
      opponent.trap = undefined;

      return await gameEngine.saveGame($game);
    }

    playerMinion.health -= opponentMinion.damage;
    opponentMinion.health -= playerMinion.damage;

    if (playerMinion.health <= 0) {
      playerMinion.health = playerMinion.maxHealth;

      player.graveyard.push(playerMinion);
      player.minion[attacker] = undefined;
    }

    if (opponentMinion.health <= 0) {
      opponentMinion.health = opponentMinion.maxHealth;

      opponent.graveyard.push(opponentMinion);
      opponent.minion[attacked] = undefined;
    }

    await gameEngine.saveGame($game);
  });
};

export {attackMinion};
