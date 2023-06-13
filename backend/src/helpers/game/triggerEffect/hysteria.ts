import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer} from "@som/shared/types/backend/game";

interface Hysteria {
  player: GamePlayer;
  field?: Field;
}

const hysteria: Effect<Hysteria> = (params) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = player.minion[field];

  if (!card) {
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
