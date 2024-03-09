import {CardKlass, EffectId} from "@som/shared/enums";
import {Animations} from "@som/shared/types/game";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import { Field } from "@som/shared/types/mongo";

const attackMinion: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {effect} = gameHelpers;

  socket.on("attackMinion", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);

    if (!getGameData) {
      return error(getGameError);
    }

    const {attacked, attacker} = params;

    if (attacked === "hero" || attacker === "hero") {
      return error("Cannot attack hero.");
    }

    const {$game, player, opponent} = getGameData;
    const playerMinion = player.field[attacker];
    const opponentMinion = opponent.field[attacked];
    const opponentTrap = opponent.trap;
    let animations: Animations = [];

    if (!playerMinion) {
      return error("Players minion not found.");
    }

    if (!opponentMinion) {
      return error("Opponents minion not found.");
    }

    if (playerMinion.damage.current < 1) {
      return error("This unit can't attack.");
    }

    // ---------------- TAUNT CHECK ----------------------
    const fields: ["hero", "a", "b", "c", "d"] = ["hero", "a", "b", "c", "d"];
    let tauntFields = [];

    for (const field of fields) {
      const fieldCard = opponent.field[field];

      if (fieldCard) {
        const taunt = fieldCard.buffs.find(
          (buff): boolean => buff.id === EffectId.TAUNT
        );

        if (taunt) {
          tauntFields.push(field);
        }
      }
    }

    if (tauntFields.length) {
      const marksmanship = playerMinion.buffs.find(
        (buff): boolean => buff.id === EffectId.MARKSMANSHIP
      );

      if (!marksmanship && !tauntFields.includes(attacked)) {
        return error("Cannot attack this unit, other has taunt.");
      }
    }
    // -----------------------------------------------------

    // Check whether opponent minion has stealth
    if (
      opponentMinion.buffs.find((buff) => buff.id === EffectId.STEALTH) &&
      !playerMinion.buffs.find((buff) => buff.id === EffectId.SHADOWSTRIKE)
    ) {
      return error("Can't attack minion with stealth.");
    }

    // Check whether the player minion can attack
    if (!playerMinion.canAttack) {
      const blazeBuff = playerMinion.buffs.find(
        (buff): boolean => buff.id === EffectId.BLAZE
      );

      if (blazeBuff && !blazeBuff.data.hasAttackedTwice) {
        blazeBuff.data.hasAttackedTwice = true;
      } else {
        return error("This card can't attack anymore this turn.");
      }
    } else {
      playerMinion.canAttack = false;
    }

    let isAttackNegated = false;

    const elusiveBuff = playerMinion.buffs.find(
      (buff): boolean => buff.id === EffectId.ELUSIVE
    );

    if (opponentTrap?.effect === EffectId.MIRRORS_EDGE && !elusiveBuff) {
      animations.push(
        ...effect.mirrorsEdge({player, playerMinion, opponent, opponentTrap})
      );

      if (await gameHelpers.isGameOver($game, animations)) {
        return;
      }

      isAttackNegated = true;
    }

    if (opponentTrap?.effect === EffectId.RICOCHET && !elusiveBuff) {
      animations.push(
        ...effect.ricochet({player, playerMinion, opponent, opponentMinionField: attacked, opponentTrap})
      );

      isAttackNegated = true;
    }

    if (opponentTrap?.effect === EffectId.FROSTBITE) {
      animations.push(...effect.frostbite({
        player,
        playerMinion,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap?.effect === EffectId.RUSTY_NEEDLE) {
      gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }

    if (opponentTrap?.effect === EffectId.NOXIOUS_FUMES) {
      animations.push(...effect.noxiousFumes({
        player,
        playerMinion,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap?.effect === EffectId.EXPLOSIVE) {
      animations.push(...effect.explosive({
        player,
        playerMinionField: attacker,
        opponent,
        opponentTrap
      }));
    }

    if (opponentTrap?.effect === EffectId.CONSTRICTION) {
      animations.push(
        ...effect.constriction({player, playerMinion, opponent, opponentTrap, playerMinionField: attacker})
      );
    }

    if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameHelpers.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameHelpers.effect.corrosiveTouch({opponent});
      if (await gameHelpers.isGameOver($game, animations)) {
        return;
      }
    }
    if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (playerMinion.damage > opponentMinion.health) {
        gameHelpers.effect.overpower({opponent, damage: playerMinion.damage.current - opponentMinion.health.current});
        if (await gameHelpers.isGameOver($game, animations)) {
          return;
        }
      }
    }

    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
      gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
      gameHelpers.effect.corrosiveTouch({opponent: player});
      if (await gameHelpers.isGameOver($game, animations)) {
        return;
      }
    }
    if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
      if (opponentMinion.damage > playerMinion.health) {
        gameHelpers.effect.overpower({opponent, damage: opponentMinion.damage.current - playerMinion.health.current});
        if (await gameHelpers.isGameOver($game, animations)) {
          return;
        }
      }
    }

    if (!isAttackNegated) {
      // shake should play both animations simultaneously
      animations.push({
        type: "SHAKE",
        playerA: player.name,
        playerANumber: opponentMinion.damage.current,
        playerAField: attacker,
        playerB: opponent.name,
        playerBNumber: playerMinion.damage.current,
        playerBField: attacked
      });

      animations.push(...gameHelpers.deductHealth(player, playerMinion, opponentMinion.damage.current, attacker));
      animations.push(...gameHelpers.deductHealth(opponent, opponentMinion, playerMinion.damage.current, attacked));
    }

    if (
      playerMinion.health.current <= 0 ||
      (
        playerMinion.health.current === 1 &&
        opponentMinion.buffs.find((buff): boolean => buff.id === EffectId.EXECUTE)
      )
    ) {
      const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
      const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
      if (player.trap && player.trap.effect === EffectId.REFLECTION) {
        gameHelpers.effect.reflection({player, opponent, trap: player.trap});
      }

      animations.push(...gameHelpers.moveToGraveyard(player, playerMinion, attacker));

      if (hasSelfDescturctDebuff) {
        gameHelpers.effect.selfDestruct({player});
        if (await gameHelpers.isGameOver($game, animations)) {
          return;
        }
      }

      if (hasAcidicDeathBuff) {
        effect.acidicDeath({player, opponent});
      }

      (Object.keys(player.field) as Array<keyof typeof player.field>).forEach((key) => {
        const minion = player.field[key];
        if (!minion) { return; }
        if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
          gameHelpers.effect.risingFury({minionCard: minion});
        }
        if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
          if (playerMinion.klass === CardKlass.LIQUID) {
            const minion = gameHelpers.getRandomMinion(player);
            if (!minion) { return; }
            minion.health.current += 3;
          }
        }
      });
    } else {
      if (playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
        effect.rampage({minion: playerMinion});
      }
    }

    if (opponentMinion.health.current <= 0 || (opponentMinion.health.current === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
      if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
        animations.push(
          ...gameHelpers.effect.lastStand({
            opponent,
            opponentMinion,
            opponentMinionField: attacked,
            opponentTrap: opponent.trap
          })
        );
      } else {
        const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
        if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
          gameHelpers.effect.reflection({player: opponent, opponent: player, trap: opponent.trap});
        }

        animations.push(...gameHelpers.moveToGraveyard(opponent, opponentMinion, attacked));

        if (hasSelfDescturctDebuff) {
          gameHelpers.effect.selfDestruct({player});
          if (await gameHelpers.isGameOver($game, animations)) {
            return;
          }
        }

        if (hasAcidicDeathBuff) {
          effect.acidicDeath({player, opponent});
        }
      }

      (Object.keys(opponent.field) as Array<keyof typeof opponent.field>).forEach((key) => {
        const minion = opponent.field[key];
        if (!minion) { return; }
        if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
          gameHelpers.effect.risingFury({minionCard: minion});
        }
        if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
          if (opponentMinion.klass === CardKlass.LIQUID) {
            const minion = gameHelpers.getRandomMinion(opponent);
            if (!minion) {return; }
            minion.health.current += 3;
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

export {attackMinion};
