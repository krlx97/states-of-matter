import {EffectId} from "@som/shared/enums";
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

    const {name, gameId} = $player;
    const $game = await gamesDb.findOne({gameId});

    if (!$game) { return; }
    if ($game.currentPlayer !== name) { return; }

    const {player, opponent} = gameEngine.getPlayers($game, name);
    const playerMinion = player.minion[attacker];
    const opponentMinion = opponent.minion[attacked];

    if (!playerMinion || !opponentMinion) { return; }
    if (!playerMinion.canAttack) { return; }

    playerMinion.canAttack = false;
    triggerEffect.multiStrike(playerMinion);

    if (opponent.trap && opponent.trap.effect === EffectId.MIRRORS_EDGE) {
      player.hero.health -= playerMinion.damage;

      if (await gameEngine.isGameOver($game)) { return; }

      opponent.graveyard.push(opponent.trap);
      opponent.trap = undefined;

      return await gameEngine.saveGame($game);
    }

    playerMinion.health -= opponentMinion.damage;
    opponentMinion.health -= playerMinion.damage;

    await gameEngine.floatingText($game, player.name, attacked, attacker, opponentMinion.damage, playerMinion.damage);
    gameEngine.battleLog($game, player, opponent, attacked, attacker, playerMinion.id, opponentMinion.id);

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
