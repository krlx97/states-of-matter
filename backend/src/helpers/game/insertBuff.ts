import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GameHeroCard} from "@som/shared/types/backend/game";

const insertBuff = (card: GameMinionCard | GameHeroCard, id: EffectId, data: any = {}) => {
  // switch (id) {
  //   case EffectId.BLAZE:
  //     const hasAttackedTwice = true;
  //     card.buffs.push({id, data: {hasAttackedTwice}});
  //     break;
  //   case EffectId.NECROMANCY:
  //     card.health -= 2;
  // }

  card.buffs.push({id, data});


  // card.buffs.push({id, data});
  return [true, `Acidic Death buff added.`];
};

export {insertBuff};
