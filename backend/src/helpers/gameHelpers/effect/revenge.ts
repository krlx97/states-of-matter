import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Revenge {
  player: GamePlayer;
  field: MinionField;
}

const revenge = (params: Revenge) => {
  const {player, field} = params;

  const handCard = player.hand.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;
  const deckCard = player.deck.find((card) => card.effect === EffectId.REVENGE) as GameMinionCard | undefined;

  if (!handCard && !deckCard) {
    return [false, "No copy of the card found."];
  }

  if (handCard) {
    const index = player.hand.indexOf(handCard);
    player.field[field] = handCard;
    player.hand.splice(index, 1);
  } else if (deckCard) {
    const index = player.deck.indexOf(deckCard);
    player.field[field] = deckCard;
    player.deck.splice(index, 1);
  }

  return [true, ""];
};

export {revenge};
