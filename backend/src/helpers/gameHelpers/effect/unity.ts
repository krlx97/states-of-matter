import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface Unity {
  player: GamePlayer;
}

const unity = (params: Unity) => {
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
