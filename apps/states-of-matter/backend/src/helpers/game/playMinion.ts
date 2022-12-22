import {CardType} from "@som/shared/enums";
import type {GameMinion, GamePlayer} from "models/game";

const playMinion = (player: GamePlayer, gid: number, field: "a" | "b" | "c" | "d"): GameMinion | undefined => {
  const {hand, minion, hero} = player;
  const handCard = hand.find((card) => card.gid === gid) as GameMinion;

  if (!handCard) { return; } // hand card not found by gid
  if (handCard.type !== CardType.MINION) { return; } // hand card isn't minion
  if (minion[field]) { return; } // field already inhibits a minion
  if (handCard.manaCost > hero.mana) { return; } // hero doesn't have enough mana

  hero.mana -= handCard.manaCost;
  minion[field] = handCard;
  hand.splice(hand.indexOf(handCard), 1);

  return minion[field];
};

export {playMinion};
