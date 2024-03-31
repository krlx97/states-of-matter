import {EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GameMinionCard, GameHeroCard} from "@som/shared/types/mongo";

// remove this?
// or better yet add a buff and return a BUFF/DEBUFF animation
const insertBuff = (
  card: GameMinionCard | GameHeroCard,
  id: EffectId,
  data: any = {}
): Animations => {
  card.buffs.push({id, data});
  return [];
};

export {insertBuff};
