import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { deductHealth2 } from "../deductHealth2";
import { insertBuff } from "../insertBuff";
import { moveToGraveyard } from "../moveToGraveyard";

interface Fortitude {
  player: GamePlayer;
  field: Field | undefined;
}

const fortitude: Effect<Fortitude> = (params) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field not specified."];
  }

  const minion = player.minion[field];

  if (!minion) {
    return [false, `No minion on the ${field} field.`];
  }

  deductHealth2(player, minion, 1);

  if (minion.health > 0) {
    insertBuff(minion, EffectId.TAUNT);
  } else {
    moveToGraveyard(player, minion, field);
  }

  return [true, ""];
};

export {fortitude};
