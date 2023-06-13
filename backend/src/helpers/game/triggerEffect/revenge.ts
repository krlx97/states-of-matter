import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Revenge {
  player: GamePlayer;
  field: Field;
}

const revenge: Effect<Revenge> = (params) => {
  const {player, field} = params;

  const handCard = player.hand.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;
  const deckCard = player.deck.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;

  if (!handCard && !deckCard) {
    return [false, "No copy of the card found."];
  }

  if (handCard) {
    const index = player.hand.indexOf(handCard);
    player.minion[field] = handCard;
    player.hand.splice(index, 1);
  } else if (deckCard) {
    const index = player.deck.indexOf(deckCard);
    player.minion[field] = deckCard;
    player.deck.splice(index, 1);
  }

  return [true, ""];
};

export {revenge};
