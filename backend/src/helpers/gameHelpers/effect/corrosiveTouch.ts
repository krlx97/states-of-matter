import {EffectId} from "@som/shared/enums";
import type {GamePlayer} from "@som/shared/types/mongo";

interface CorrosiveTouch {
  opponent: GamePlayer;
}

const corrosiveTouch = (params: CorrosiveTouch) => {
  const {opponent} = params;
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;
  let damageToHero = 0;

  minionKeys.forEach((key) => {
    const minion = opponent.field[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        const hasNeurotoxinDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);

        if (hasNeurotoxinDebuff) {
          damageToHero += 1;
        }
      }
    }
  });

  opponent.field.hero.health.current -= damageToHero;

  return [true, ""];
};

export {corrosiveTouch};
