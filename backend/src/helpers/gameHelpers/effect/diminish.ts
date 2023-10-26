import {EffectId} from "@som/shared/enums";
import type {Field, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Diminish {
  opponent: GamePlayer;
  field?: MinionField;
}

const diminish = (params: Diminish) => {
  const {opponent, field} = params;

  if (!field) {
    return [false, "Field for Effect not specified."];
  }

  const card = opponent.field[field];

  if (!card) {
    return [false, `Minion doesn't exist on the field ${field}.`];
  }



  if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE) !== undefined) {
    return [false, "Diminish negated."];
  }

  if (card.damage > 2) {
    card.damage -= 2;
  } else {
    card.damage = 0;
  }

  card.debuffs.push({
    id: EffectId.DIMINISH,
    data: {damage: -2}
  });

  return [true, `
    Player ${opponent.name} has played Diminish magic card, reducing your card on
    the field ${field} Damage by 2.
  `];
};

export {diminish};
