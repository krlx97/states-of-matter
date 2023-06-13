import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import {insertBuff} from "../insertBuff";

interface Unity {
  player: GamePlayer;
}

const unity: Effect<Unity> = (params) => {
  const {player} = params;

  const handCard = player.hand.find((card) => card.effect === EffectId.UNITY) as GameMinionCard | undefined;
  const deckCard = player.deck.find((card) => card.effect === EffectId.UNITY) as GameMinionCard | undefined;

  if (!handCard && !deckCard) {
    return [false, "No copy of the card found in hand or deck."];
  }

  if (handCard) {
    insertBuff(handCard, EffectId.TAUNT);
  } else if (deckCard) {
    insertBuff(deckCard, EffectId.TAUNT);
  }

  return [true, ""];
};

export {unity};
