import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type { Animations } from "@som/shared/types/game";

interface Unity {
  player: GamePlayer;
}

const unity = (params: Unity): Animations => {
  const {player: {name, hand, deck}} = params;

  const handCard = hand.find(
    (card): boolean => card.effect === EffectId.UNITY
  ) as GameMinionCard | undefined;

  const deckCard = deck.find(
    (card): boolean => card.effect === EffectId.UNITY
  ) as GameMinionCard | undefined;

  if (handCard) {
    insertBuff(handCard, EffectId.TAUNT);
  } else if (deckCard) {
    insertBuff(deckCard, EffectId.TAUNT);
  }

  return [{
    type: "FLOATING_TEXT",
    name: name,
    field: "hero",
    text: "UNITY"
  }];
};

export {unity};
