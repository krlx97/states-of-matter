import {EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const attackHero: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("attackHero", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {attacker} = params;
    const {$game, player, opponent} = getGameData;
    const playerMinion = player.minion[attacker];
    const opponentHero = opponent.hero;
    const animations: any[] = [];

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
      animations.push(...effect.mirrorsEdge({
        player,
        playerMinion,
        opponent,
        opponentTrap: trap
      }));

      if (await gameHelpers.isGameOver($game)) { return; }
    }

    if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET) {
      animations.push(...effect.ricochet({
        player,
        playerMinion,
        opponent,
        opponentTrap: opponent.trap
      }));
    }

    if (trap && trap.effect === EffectId.RETRIBUTION) {
      gameHelpers.effect.retribution({player, field: attacker});
    }

    if (trap && trap.effect === EffectId.FROSTBITE) {
      animations.push(...effect.frostbite({
        player,
        playerMinion,
        playerMinionField: attacker,
        opponent,
        opponentTrap: trap
      }));
    }

    if (trap && trap.effect === EffectId.RUSTY_NEEDLE) {
      gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }

    if (trap && trap.effect === EffectId.NOXIOUS_FUMES) {
      const field = attacker;
      effect.noxiousFumes({opponent: player, minion: playerMinion, field});
    }

    if (trap && trap.effect === EffectId.EXPLOSIVE) {
      const field = attacker;
      effect.explosive({player, opponent, trap, field});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameHelpers.effect.corrosiveTouch({opponent});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
      effect.rampage({minion: playerMinion});
    }

    if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.BACKSTAB)) {
      effect.backstab({opponent, minion: playerMinion}); // only trigger, handle animation here
    }

    opponentHero.health -= playerMinion.damage;

    if (await gameHelpers.isGameOver($game)) {
      return;
    }

    await gameHelpers.saveGame($game);
  });
};

export {attackHero};
