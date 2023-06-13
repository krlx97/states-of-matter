import {EffectId} from "@som/shared/enums";
import {heartOfSteel} from "./triggerEffect/heartOfSteel";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

const deductHealth2 = (
  player: GamePlayer,
  minion: GameMinionCard,
  damage: number
): void => {
  const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);

  if (shieldBuff) { // has shield
    const amt = shieldBuff.data.amount;

    if (amt > damage) { // shield reduced
      shieldBuff.data.amount -= damage
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
};

export {deductHealth2};
