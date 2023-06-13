import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer} from "@som/shared/types/backend/game";

interface Corruption {
  player: GamePlayer;
  field?: Field;
}

const corruption: Effect<Corruption> = (params) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = player.minion[field];

  if (!card) {
    return [false, `Minion doesn't exist on the field ${field}.`];
  }

  if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
    return [false, "Corruption negated."];
  }

  card.health -= 2;

  if (card.health <= 0) {
    moveToGraveyard(player, card, field);
  } else {
    insertBuff(card, EffectId.OVERCHARGE);
  }

  return [true, ""];
};

export {corruption};
