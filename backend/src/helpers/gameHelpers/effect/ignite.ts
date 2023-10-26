import {CardType, EffectId} from "@som/shared/enums";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Field, GamePlayer} from "@som/shared/types/mongo";

interface Ignite {
  player: GamePlayer;
  opponent: GamePlayer;
  field?: Field;
}

const ignite = (params: Ignite) => {
  const {player, opponent, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = opponent.field[field];

  if (!card || card.type === CardType.HERO) {
    return [false, `Minion doesn't exist on the field ${field}.`];
  }

  if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
    return [false, "Ignite negated."];
  }

  card.health -= 2;

  if (card.health <= 0) {
    moveToGraveyard(opponent, card, field);

    const drawnCard = player.deck.pop();

    if (drawnCard) {
      player.hand.push(drawnCard);
    }
  }

  return [true, ""];
};

export {ignite};