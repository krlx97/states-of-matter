import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GameHeroCard} from "@som/shared/types/backend/game";

const insertDebuff = (card: GameMinionCard | GameHeroCard, id: EffectId, data: any = {}) => {
  card.debuffs.push({id, data});
  return [true, "Debuff added."];
};

export {insertDebuff};
