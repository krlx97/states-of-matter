import {CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import type { Animations } from "@som/shared/types/game";

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
    const playerMinion = player.field[attacker];
    const opponentHero = opponent.field.hero;
    const animations: Animations = [];

    if (!playerMinion) {
      return;
    }

    if (playerMinion.type === CardType.HERO) {
      return error("Heroes can't attack");
    }

    const fields: ["hero", "a", "b", "c", "d"] = ["hero", "a", "b", "c", "d"];
    const selected = fields.find((field) => field === "hero");

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
          return error("Cannot attack this minion, other has taunt.");
        }
      }
    }

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

    const {trap} = opponent;

    const elusiveBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

    if (trap && trap.effect === EffectId.MIRRORS_EDGE && !elusiveBuff) {
      animations.push(...effect.mirrorsEdge({
        player,
        playerMinion,
        opponent,
        opponentTrap: trap
      }));

      if (await gameHelpers.isGameOver($game, animations)) { return; }

      isAttackNegated = true;
    }


    if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET && !elusiveBuff) {
      animations.push(...effect.ricochet({
        player,
        playerMinion,
        opponent,
        opponentTrap: opponent.trap
      }));

      isAttackNegated = true;
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
      effect.backstab({player, opponent, playerMinion, playerMinionField: attacker});
    }

    if (!isAttackNegated) {
      animations.push({
        type: "SHAKE",
        playerA: player.name,
        playerANumber: 0,
        playerAField: attacker,
        playerB: opponent.name,
        playerBNumber: playerMinion.damage.current,
        playerBField: "hero"
      });

      animations.push(
        ...gameHelpers.deductHeroHealth(opponent, playerMinion.damage.current)
      );
    }

    if (await gameHelpers.isGameOver($game, animations)) {
      return;
    }

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {attackHero};
