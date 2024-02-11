import {CardKlass, CardType, EffectId} from "@som/shared/enums";
import {Animations} from "@som/shared/types/game";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";

const attack: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("attack", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {attacked, attacker} = params;
    const {$game, player, opponent} = getGameData;
    const playerMinion = player.field[attacker];
    const opponentMinion = opponent.field[attacked];
    const opponentTrap = opponent.trap;
    const animations: Animations = [];

    if (!playerMinion) {
      return error("Players minion not found.");
    }

    if (!opponentMinion) {
      return error("Opponents minion not found.");
    }

    const fields: ["hero", "a", "b", "c", "d"] = ["hero", "a", "b", "c", "d"];
    const selected = fields.find((field) => field === attacked);

    if (!selected) {
      return error("Error");
    }

    fields.splice(fields.indexOf(selected), 1);

    for (const field of fields) {
      const fieldCard = opponent.field[field];

      if (fieldCard) {
        const taunt = fieldCard.buffs.find((buff) => buff.id === EffectId.TAUNT);
        const marksmanship = playerMinion.buffs.find((buff) => buff.id === EffectId.MARKSMANSHIP);

        if (taunt && !marksmanship) {
          return error("Cannot attack this minion/hero, other has taunt.");
        }
      }
    }

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


    let isAttackNegated = false;

    if (opponentTrap && opponentTrap.effect === EffectId.MIRRORS_EDGE) {
      animations.push(
        ...effect.mirrorsEdge({player, playerMinion, opponent, opponentTrap})
      );

      if (await gameHelpers.isGameOver($game, animations)) { return; }

      isAttackNegated = true;
    }

    if (opponentTrap && opponentTrap.effect === EffectId.RICOCHET) {
      animations.push(
        ...effect.ricochet({player, playerMinion, opponent, opponentTrap})
      );

      isAttackNegated = true;
    }

    if (opponentTrap && opponentTrap.effect === EffectId.FROSTBITE) {
      animations.push(...effect.frostbite({
        player,
        playerMinion,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap && opponentTrap.effect === EffectId.RUSTY_NEEDLE) {
      gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }

    if (opponentTrap && opponentTrap.effect === EffectId.NOXIOUS_FUMES) {
      animations.push(...effect.noxiousFumes({
        player,
        playerMinion,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap && opponentTrap.effect === EffectId.EXPLOSIVE) {
      animations.push(...effect.explosive({
        player,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap && opponentTrap.effect === EffectId.CONSTRICTION) {
      animations.push(
        ...effect.constriction({player, playerMinion, opponent, opponentTrap, playerMinionField: attacker})
      );
    }


    if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameHelpers.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameHelpers.effect.corrosiveTouch({opponent});
      if (await gameHelpers.isGameOver($game)) {
        return;
      }
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (playerMinion.damage > opponentMinion.health) {
        gameHelpers.effect.overpower({opponent, damage: playerMinion.damage - opponentMinion.health});
        if (await gameHelpers.isGameOver($game)) {
          return;
        }
      }
    }

    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameHelpers.effect.corrosiveTouch({opponent: player});
      if (await gameHelpers.isGameOver($game)) {
        return;
      }
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (opponentMinion.damage > playerMinion.health) {
        gameHelpers.effect.overpower({opponent, damage: opponentMinion.damage - playerMinion.health});
        if (await gameHelpers.isGameOver($game)) {
          return;
        }
      }
    }


    if (!isAttackNegated) {
      gameHelpers.deductHealth(player, playerMinion, opponentMinion.damage.current, attacker);
      animations.push({
        type: "DAMAGE",
        field: attacker,
        damageTaken: opponentMinion.damage,
        name: player.name
      });

      gameHelpers.deductHealth(opponent, opponentMinion, playerMinion.damage);
      animations.push({
        type: "DAMAGE",
        field: attacked,
        damageTaken: playerMinion.damage,
        name: opponent.name
      });
    }

    if (playerMinion.health <= 0 || (playerMinion.health === 1 && opponentMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
      if (player.trap && player.trap.effect === EffectId.LAST_STAND) {
        gameHelpers.effect.lastStand({minion: playerMinion, opponent: player, trap: player.trap})
      } else {
        const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
        if (player.trap && player.trap.effect === EffectId.REFLECTION) {
          gameHelpers.effect.reflection({player, opponent, trap: player.trap});
        }

        gameHelpers.moveToGraveyard(player, playerMinion, attacker);
        animations.push({
          type: "DEATH",
          field: attacker,
          name: player.name
        });
        if (hasSelfDescturctDebuff) {
          gameHelpers.effect.selfDestruct({player});
          if (await gameHelpers.isGameOver($game)) {
            return;
          }
        }

        if (hasAcidicDeathBuff) {
          effect.acidicDeath({player, opponent});
        }

        (Object.keys(player.minion) as Array<keyof typeof player.minion>).forEach((key) => {
          const minion = player.minion[key];
          if (!minion) { return; }
          if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
            gameHelpers.effect.risingFury({minionCard: minion});
          }
          if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
            if (playerMinion.klass === CardKlass.LIQUID) {
              const minion = gameHelpers.getRandomMinion(player);
              if (!minion) {return; }
              minion.health += 3;
            }
          }
        });
      }
    } else {
      if (playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
        effect.rampage({minion: playerMinion});
      }
    }

    if (opponentMinion.health <= 0 || (opponentMinion.health === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
      if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
        gameHelpers.effect.lastStand({minion: opponentMinion, opponent, trap: opponent.trap})
      } else {
        const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
        if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
          gameHelpers.effect.reflection({player: opponent, opponent: player, trap: opponent.trap});
        }
        gameHelpers.moveToGraveyard(opponent, opponentMinion, attacked);
        animations.push({
          type: "DEATH",
          field: attacked,
          name: opponent.name
        });
        if (hasSelfDescturctDebuff) {
          gameHelpers.effect.selfDestruct({player});
          if (await gameHelpers.isGameOver($game)) {
            return;
          }
        }

        if (hasAcidicDeathBuff) {
          effect.acidicDeath({player, opponent});
        }
      }

      (Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>).forEach((key) => {
        const minion = opponent.minion[key];
        if (!minion) { return; }
        if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
          gameHelpers.effect.risingFury({minionCard: minion});
        }
        if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
          if (opponentMinion.klass === CardKlass.LIQUID) {
            const minion = gameHelpers.getRandomMinion(opponent);
            if (!minion) {return; }
            minion.health += 3;
          }
        }
      });
    } else {
      if (opponentMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
        effect.rampage({minion: opponentMinion});
      }
    }

    // $game.battleLogs.push(attacked, attacker, playerMinion.id, opponentMinion.id);

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {attack};
