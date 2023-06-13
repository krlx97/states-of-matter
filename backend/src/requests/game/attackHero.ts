import {EffectId} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";

const attackHero: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("attackHero", async (params) => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {attacker} = params;
    const {$game, player, opponent} = getGameData;
    const playerMinion = player.minion[attacker];
    const opponentHero = opponent.hero;

    if (!playerMinion) {
      return;
    }

    const multiStrikeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);

    if (!playerMinion.canAttack) {
      if (multiStrikeBuff && !multiStrikeBuff.data.hasAtacked) {
        multiStrikeBuff.data.hasAttacked = true;
      } else {
        return error("This card can't attack anymore this turn.");
      }
    } else {
      playerMinion.canAttack = false;
    }

    const {trap} = opponent;

    if (trap && trap.effect === EffectId.MIRRORS_EDGE) {
      triggerEffect.mirrorsEdge({
        player,
        opponent,
        minion: playerMinion,
        trap
      });

      if (await gameEngine.isGameOver($game)) { return; }
    }

    if (trap && trap.effect === EffectId.RETRIBUTION) {
      gameEngine.triggerEffect.retribution({player, field: attacker});
    }

    if (trap && trap.effect === EffectId.FROSTBITE) {
      gameEngine.triggerEffect.frostbite({minion: playerMinion, player: opponent, trap: trap});
    }

    if (trap && trap.effect === EffectId.RUSTY_NEEDLE) {
      gameEngine.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }

    if (trap && trap.effect === EffectId.NOXIOUS_FUMES) {
      const field = attacker;
      triggerEffect.noxiousFumes({opponent: player, minion: playerMinion, field});
    }

    if (trap && trap.effect === EffectId.EXPLOSIVE) {
      const field = attacker;
      triggerEffect.explosive({player, opponent, trap, field});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameEngine.triggerEffect.corrosiveTouch({opponent});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
      triggerEffect.rampage({minion: playerMinion});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.BACKSTAB)) {
      triggerEffect.backstab({opponent, minion: playerMinion});
    }

    opponentHero.health -= playerMinion.damage;

    if (await gameEngine.isGameOver($game)) {
      return;
    }

    await gameEngine.saveGame($game);
  });
};

export {attackHero};
