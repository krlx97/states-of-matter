import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Valor {
  opponent: GamePlayer;
}

const valor = (params: Valor) => {
  const {opponent} = params;

  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;
  let totalDamage = 0;

  minionKeys.forEach((key) => {
    const minion = opponent.field[key];

    if (minion) {
      const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);

      if (shieldBuff) {
        totalDamage += shieldBuff.data.amount;
        minion.buffs.splice(minion.buffs.indexOf(shieldBuff, 1));
      }
    }
  });

  opponent.field.hero.health -= totalDamage;

  return [true, ""]
};

export {valor};
