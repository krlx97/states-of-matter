import {CardType, EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {Field, GamePlayer} from "@som/shared/types/mongo";

interface Hysteria {
  player: GamePlayer;
  field?: Field;
}

const hysteria = (params: Hysteria) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = player.field[field];

  if (!card || card.type === CardType.HERO) {
    return [false, `Minion doesn't exist on the field ${field}.`];
  }

  if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
    return [false, "Hysteria negated."];
  }

  card.damage *= 2;
  card.health = 1;

  insertBuff(card, EffectId.HYSTERIA);

  return [true, ""];
};

export {hysteria};
