import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Valor {
  opponent: GamePlayer;
}

const valor: Effect<Valor> = (params) => {
  const {opponent} = params;

  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;
  let totalDamage = 0;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);

      if (shieldBuff) {
        totalDamage += shieldBuff.data.amount;
        minion.buffs.splice(minion.buffs.indexOf(shieldBuff, 1));
      }
    }
  });

  opponent.hero.health -= totalDamage;

  return [true, ""]
};

export {valor};
