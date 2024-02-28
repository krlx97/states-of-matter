import {Ability, CardType, EffectId} from "@som/shared/enums";
import {gameHelpers} from "helpers";
import type {SocketRequest} from "@som/shared/types/backend";
import { Animations } from "@som/shared/types/game";

const useAbility: SocketRequest = (socket, error): void => {
  const socketId = socket.id;

  socket.on("useAbility", async (params) => {
    const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
    const animations: Animations = [];

    if (!getGameData) {
      return error(getGameError);
    }

    const {$game, player, opponent} = getGameData;
    const {name, hand, trap, field} = player;
    const {target} = params;

    const hero = field.hero;

    if (hero.ability === Ability.FORTIFY) {
      const minion = player.field[target];

      if (hero.mana.current < 5) {
        return error("Not enough mana.");
      }

      if (!minion) {
        return error("No minion on the field.");
      }

      player.field.hero.mana.current -= 5;

      animations.push({
        type: "MANA_CAPACITY",
        name: player.name,
        increment: undefined,
        decrement: 5
      });

      const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);

      if (shieldBuff) {
        shieldBuff.data.amount += 1;
      } else {
        minion.buffs.push({
          id: EffectId.SHIELD,
          data: {amount: 1}
        });
      }

      animations.push({
        type: "FLOATING_TEXT",
        name: player.name,
        field: target,
        text: "+1 Shield"
      });
    } else if (hero.ability === Ability.HEAL) {
      const minion = player.field[target];

      if (hero.mana.current < 5) {
        return error("Not enough mana.");
      }

      if (!minion) {
        return error("No minion on the field.");
      }

      player.field.hero.mana.current -= 5;
      minion.health.current += 1;

      animations.push({
        type: "MANA_CAPACITY",
        name: player.name,
        increment: undefined,
        decrement: 5
      }, {
        type: "FLOATING_TEXT",
        name: player.name,
        field: target,
        text: "Rejuvenate"
      }, {
        type: "HEALTH",
        field: target,
        name: player.name,
        increment: 1,
        decrement: undefined
      });
    } else if (hero.ability === Ability.NEUROTOXIN) {
      const minion = opponent.field[target];

      if (hero.mana.current < 5) {
        return error("Not enough mana.");
      }

      if (!minion) {
        return error("No minion on the field.");
      }

      player.field.hero.mana.current -= 5;

      const neurotoxinBuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);

      if (neurotoxinBuff) {
        return error("Target already infected.");
      }

      minion.debuffs.push({
        id: EffectId.NEUROTOXIN, data: {}
      })

      animations.push({
        type: "MANA_CAPACITY",
        name: player.name,
        increment: undefined,
        decrement: 5
      });
      animations.push({
        type: "FLOATING_TEXT",
        name: opponent.name,
        field: target,
        text: "Neurotoxin"
      });
    } else if (hero.ability === Ability.OVERCHARGE) {
      const minion = opponent.field[target as keyof typeof opponent.field];

      if (player.field.hero.mana.current < 5) {
        return error("Not enough mana.");
      }

      if (!minion) {
        return error("No minion on the field.");
      }

      player.field.hero.mana.current -= 5;

      animations.push({
        type: "MANA_CAPACITY",
        name: player.name,
        increment: undefined,
        decrement: 5
      });

      if (minion.type === CardType.MINION) {
        animations.push({
          type: "FLOATING_TEXT",
          name: opponent.name,
          field: target,
          text: "Electrocute"
        });

        animations.push(...gameHelpers.deductHealth(opponent, minion, 2, target));

        if (minion.health.current <= 0) {
          animations.push(...gameHelpers.moveToGraveyard(opponent, minion, target));
        }
      } else {
        minion.health.current -= 2;

        if (await gameHelpers.isGameOver($game, animations)) {
          return;
        }

        animations.push({
          type: "FLOATING_TEXT",
          name: opponent.name,
          field: "hero",
          text: "Electrocute"
        }, {
          type: "HEALTH",
          name: opponent.name,
          field: target,
          increment: undefined,
          decrement: 2
        });
      }
    }

    await gameHelpers.attackMinionSave($game, animations);
  });
};

export {useAbility};
