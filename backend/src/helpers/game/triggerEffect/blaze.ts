import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard} from "@som/shared/types/backend/game";

interface Blaze {
  minion: GameMinionCard;
}

const blaze: Effect<Blaze> = (params) => {
  const blazeBuff = params.minion.buffs.find((buff) => buff.id === EffectId.BLAZE);

  if (!blazeBuff) {
    return [false, "Blaze buff not found."];
  }

  blazeBuff.data.hasAttackedTwice = false;

  return [true, ""];
};

export {blaze};
