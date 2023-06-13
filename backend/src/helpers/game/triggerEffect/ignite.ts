import {EffectId} from "@som/shared/enums";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer} from "@som/shared/types/backend/game";

interface Ignite {
  player: GamePlayer;
  opponent: GamePlayer;
  field?: Field;
}

const ignite: Effect<Ignite> = (params) => {
  const {player, opponent, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = opponent.minion[field];

  if (!card) {
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
