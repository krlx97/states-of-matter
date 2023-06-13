import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface CorrosiveTouch {
  opponent: GamePlayer;
}

const corrosiveTouch: Effect<CorrosiveTouch> = (params) => {
  const {opponent} = params;
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;
  let damageToHero = 0;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

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

  opponent.hero.health -= damageToHero;

  return [true, ""];
};

export {corrosiveTouch};
