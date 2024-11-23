import {EffectId} from "@som/shared/enums";
// import {heartOfSteel} from "./effect/heartOfSteel";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

const deductHealth = (
  player: GamePlayer,
  minion: GameMinionCard,
  damage: number,
  field: Field
): Animations => {
  const {name} = player;
  const animations: Animations = [];

  const shieldBuff = minion.buffs.find(
    (buff): boolean => buff.id === EffectId.SHIELD
  );

  const resilientBuff = minion.buffs.find(
    (buff): boolean => buff.id === EffectId.RESILIENT
  );

  if (shieldBuff) { // has shield
    const {amount} = shieldBuff.data;

    if (amount > damage) { // shield reduced
      shieldBuff.data.amount -= damage;

      animations.push({
        type: "FLOATING_TEXT",
        field,
        name,
        text: `-${damage} Shield`
      });
    } else if (amount <= damage) { // shield broken
      // if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
      //   animations.push(...heartOfSteel({opponentMinion: minion, opponent: player, opponentTrap: player.trap, field}));
      // }

      const remaining = damage - shieldBuff.data.amount;

      if (remaining > 0) {
        if (resilientBuff && remaining > 1) {
          minion.health.current -= 1;
        } else {
          minion.health.current -= remaining;
        }
      }

      animations.push({
        type: "FLOATING_TEXT",
        field,
        name,
        text: `-${shieldBuff.data.amount} Shield`
      }, {
        type: "HEALTH",
        field,
        name,
        decrement: remaining,
        increment: undefined,
      });

      minion.buffs.splice(minion.buffs.indexOf(shieldBuff), 1);
    }
  } else { // no shield
    if (resilientBuff && damage > 1) {
      minion.health.current -= 1;
    } else {
      minion.health.current -= damage;
    }

    animations.push({
      type: "HEALTH",
      field,
      name,
      decrement: damage,
      increment: undefined,
    });
  }

  return animations;
};

export {deductHealth};
