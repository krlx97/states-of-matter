import {EffectId} from "@som/shared/enums";
import {heartOfSteel} from "./effect/heartOfSteel";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

const deductHealth = (
  player: GamePlayer,
  minion: GameMinionCard,
  damage: number
): Animations => {
  const shieldBuff = minion.buffs.find(
    (buff): boolean => buff.id === EffectId.SHIELD
  );

  const animations: Animations = [];

  if (shieldBuff) { // has shield
    const amt = shieldBuff.data.amount;

    if (amt > damage) { // shield reduced
      shieldBuff.data.amount -= damage
      animations.push({
        type: "FLOATING_TEXT",
        field: "a",
        name: player.name,
        text: `-${damage} Shield`
      });
    } else if (amt <= damage) { // shield broken
      if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
        heartOfSteel({minion, player, trap: player.trap});
      }

      const remaining = shieldBuff.data.amount - damage;

      if (remaining < 0) {
        if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
          minion.health -= 1;
        } else {
          minion.health -= remaining;
        }
      }

      const index = minion.buffs.indexOf(shieldBuff);
      minion.buffs.splice(index, 1);
    }
  } else { // no shield
    if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
      minion.health -= 1;
    } else {
      minion.health -= damage;
    }
  }

  return animations;
};

export {deductHealth};
