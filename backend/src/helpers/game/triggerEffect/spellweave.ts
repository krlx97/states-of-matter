import {CardType, EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Spellweave {
  player: GamePlayer;
  minion: GameMinionCard;
}

const spellweave: Effect<Spellweave> = (params) => {
  const {player, minion} = params;

  const amount = player.graveyard.reduce((sum, card) => {
    if (card.type === CardType.MAGIC) {
      return sum += 1;
    }

    return sum;
  }, 0);

  insertBuff(minion, EffectId.SHIELD, {amount});

  return [true, ""];
};

export {spellweave};
