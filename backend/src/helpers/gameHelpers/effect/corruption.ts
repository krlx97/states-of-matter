import {CardType, EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Field, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Corruption {
  player: GamePlayer;
  field?: MinionField;
}

const corruption = (params: Corruption) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = player.field[field];

  if (!card) {
    return [false, `Minion doesn't exist on the field ${field}.`];
  }

  if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
    return [false, "Corruption negated."];
  }

  card.health.current -= 2;

  if (card.health.current <= 0) {
    moveToGraveyard(player, card, field);
  } else {
    insertBuff(card, EffectId.OVERCHARGE);
  }

  return [true, ""];
};

export {corruption};
