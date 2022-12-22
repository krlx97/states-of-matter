import {CardType, EffectId} from "@som/shared/enums";
import type {GameMinion, GamePlayer} from "models/game";

const spellweave = (minion: GameMinion, player: GamePlayer): void => {
  if (minion.effect === EffectId.SPELLWEAVE && !minion.hasTriggeredEffect) {
    const bonus = player.graveyard.reduce((sum, card): number => {
      if (card.type === CardType.MAGIC || card.type === CardType.TRAP) {
        return sum += 1;
      }

      return sum
    }, 0);

    minion.damage += bonus;
    minion.hasTriggeredEffect = true;
  }
};

export {spellweave};
