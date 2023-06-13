import {CardKlass, EffectId} from "@som/shared/enums";
import gameEngine from "helpers/game";
import type {SocketRequest} from "@som/shared/types/backend";
import { getRandomMinion } from "helpers/game/getRandomMinion";
import { deductHealth } from "helpers/game/deductHealth";
import { deductHealth2 } from "helpers/game/deductHealth2";
import { insertDebuff } from "helpers/game/insertDebuff";

const attackMinion: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {triggerEffect} = gameEngine;

  socket.on("attackMinion", async (params) => {
    const [getGameData, getGameError] = await gameEngine.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {attacked, attacker} = params;
    const {$game, player, opponent} = getGameData;
    const playerMinion = player.minion[attacker];
    const opponentMinion = opponent.minion[attacked];
    const animate = []; // push sequences and emit with saveGame, loop animate on frontend, play all animations, and overwrite game state.

    if (!playerMinion) {
      return error("Players minion not found.");
    }

    if (!opponentMinion) {
      return error("Opponents minion not found.");
    }

    // check if any of the opposing minions has Taunt, and whether the player minion has Marksmanship
    // return error if not

    if (
      opponentMinion.buffs.find((buff) => buff.id === EffectId.STEALTH) &&
      !playerMinion.buffs.find((buff) => buff.id === EffectId.SHADOWSTRIKE)
    ) {
      return error("Can't attack minion with stealth.");
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

    if (opponent.trap && opponent.trap.effect === EffectId.MIRRORS_EDGE) {
      triggerEffect.mirrorsEdge({
        player,
        opponent,
        minion: playerMinion,
        trap: opponent.trap
      });

      animate.push({
        type: 1,
        field: "hero",
        damage: playerMinion.damage
      });

      if (await gameEngine.isGameOver($game)) { return; }
    }

    let ricochetData: any = [];

    if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET) {
      ricochetData = triggerEffect.ricochet({
        player,
        opponent,
        minionCard: playerMinion,
        trapCard: opponent.trap
      });
    }

    if (opponent.trap && opponent.trap.effect === EffectId.FROSTBITE) {
      gameEngine.triggerEffect.frostbite({minion: playerMinion, player: opponent, trap: opponent.trap});

      animate.push({
        type: 0,
        field: attacker,
        text: "+Frostbite"
      });
    }

    if (opponent.trap && opponent.trap.effect === EffectId.RUSTY_NEEDLE) {
      insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }

    if (opponent.trap && opponent.trap.effect === EffectId.NOXIOUS_FUMES) {
      triggerEffect.noxiousFumes({opponent: player, minion: playerMinion, field: attacker});
    }

    if (opponent.trap && opponent.trap.effect === EffectId.EXPLOSIVE) {
      triggerEffect.explosive({player, opponent, trap: opponent.trap, field: attacker});
    }

    if (opponent.trap && opponent.trap.effect === EffectId.CONSTRICTION) {
      triggerEffect.constriction({player, opponent, trap: opponent.trap, minion: playerMinion});
    }

    // remove this?
    const attackerDamage = playerMinion.damage;
    const attackedDamage = opponentMinion.damage;

    if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameEngine.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameEngine.triggerEffect.corrosiveTouch({opponent});
      if (await gameEngine.isGameOver($game)) {
        return;
      }
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (playerMinion.damage > opponentMinion.health) {
        gameEngine.triggerEffect.overpower({opponent, damage: playerMinion.damage - opponentMinion.health});
        if (await gameEngine.isGameOver($game)) {
          return;
        }
      }
    }

    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameEngine.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameEngine.triggerEffect.corrosiveTouch({opponent: player});
      if (await gameEngine.isGameOver($game)) {
        return;
      }
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (opponentMinion.damage > playerMinion.health) {
        gameEngine.triggerEffect.overpower({opponent, damage: opponentMinion.damage - playerMinion.health});
        if (await gameEngine.isGameOver($game)) {
          return;
        }
      }
    }

    deductHealth(player, opponent, playerMinion, opponentMinion);

    animate.push({
      type: 1,
      field: attacked,
      damage: playerMinion.damage
    });

    if (ricochetData.length && ricochetData[0] !== true) {
      deductHealth(player, opponent, opponentMinion, playerMinion);

      animate.push({
        type: 1,
        field: attacker,
        damage: opponentMinion.damage
      });
    }

    if (playerMinion.health <= 0 || (playerMinion.health === 1 && opponentMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
      if (player.trap && player.trap.effect === EffectId.LAST_STAND) {
        gameEngine.triggerEffect.lastStand({minion: playerMinion, opponent: player, trap: player.trap})
      } else {
        const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
        if (player.trap && player.trap.effect === EffectId.REFLECTION) {
          gameEngine.triggerEffect.reflection({player, opponent, trap: player.trap});
        }

        gameEngine.moveToGraveyard(player, playerMinion, attacker);

        if (hasSelfDescturctDebuff) {
          gameEngine.triggerEffect.selfDestruct({player});
          if (await gameEngine.isGameOver($game)) {
            return;
          }
        }

        if (hasAcidicDeathBuff) {
          triggerEffect.acidicDeath({player, opponent});
        }

        (Object.keys(player.minion) as Array<keyof typeof player.minion>).forEach((key) => {
          const minion = player.minion[key];
          if (!minion) { return; }
          if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
            gameEngine.triggerEffect.risingFury({minionCard: minion});
          }
          if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
            if (playerMinion.klass === CardKlass.LIQUID) {
              const minion = getRandomMinion(player);
              if (!minion) {return; }
              minion.health += 3;
            }
          }
        });
      }
    } else {
      if (playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
        triggerEffect.rampage({minion: playerMinion});
      }
    }

    if (opponentMinion.health <= 0 || (opponentMinion.health === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
      if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
        gameEngine.triggerEffect.lastStand({minion: opponentMinion, opponent, trap: opponent.trap})
      } else {
        const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
        if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
          gameEngine.triggerEffect.reflection({player: opponent, opponent: player, trap: opponent.trap});
        }
        gameEngine.moveToGraveyard(opponent, opponentMinion, attacked);

        if (hasSelfDescturctDebuff) {
          gameEngine.triggerEffect.selfDestruct({player});
          if (await gameEngine.isGameOver($game)) {
            return;
          }
        }

        if (hasAcidicDeathBuff) {
          triggerEffect.acidicDeath({player, opponent});
        }
      }

      (Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>).forEach((key) => {
        const minion = opponent.minion[key];
        if (!minion) { return; }
        if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
          gameEngine.triggerEffect.risingFury({minionCard: minion});
        }
        if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
          if (opponentMinion.klass === CardKlass.LIQUID) {
            const minion = getRandomMinion(opponent);
            if (!minion) {return; }
            minion.health += 3;
          }
        }
      });
    } else {
      if (opponentMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
        triggerEffect.rampage({minion: opponentMinion});
      }
    }

    // await gameEngine.floatingText($game, player.name, attacked, attacker, opponentMinion.damage, playerMinion.damage);
    // $game.battleLogs.push(attacked, attacker, playerMinion.id, opponentMinion.id);

    await gameEngine.attackMinionSave($game, player.name, attacker, attacked, attackerDamage, attackedDamage);
  });
};

export {attackMinion};
