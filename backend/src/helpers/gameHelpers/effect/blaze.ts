import {EffectId} from "@som/shared/enums";
import type {GameMinionCard} from "@som/shared/types/mongo";

interface Blaze {
  minion: GameMinionCard;
}

const blaze = (params: Blaze) => {
  const blazeBuff = params.minion.buffs.find((buff) => buff.id === EffectId.BLAZE);

  if (!blazeBuff) {
    return [false, "Blaze buff not found."];
  }

  blazeBuff.data.hasAttackedTwice = false;

  return [true, ""];
};

export {blaze};
