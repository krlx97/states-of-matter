import {CardType, EffectId} from "@som/shared/enums";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";
import { deductHealth } from "../deductHealth";
import { insertBuff } from "../insertBuff";
import { moveToGraveyard } from "../moveToGraveyard";

interface Fortitude {
  player: GamePlayer;
  field: Field | undefined;
}

const fortitude = (params: Fortitude) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field not specified."];
  }

  const minion = player.field[field];

  if (!minion || minion.type === CardType.HERO) {
    return [false, `No minion on the ${field} field.`];
  }

  deductHealth(player, minion, 1);

  if (minion.health > 0) {
    insertBuff(minion, EffectId.TAUNT);
  } else {
    moveToGraveyard(player, minion, field);
  }

  return [true, ""];
};

export {fortitude};
