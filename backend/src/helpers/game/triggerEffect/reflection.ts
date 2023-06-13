import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { getAdjacentMinions } from "../getAdjacentMinions";
import { moveToGraveyard } from "../moveToGraveyard";
import { insertBuff } from "../insertBuff";
import { EffectId } from "@som/shared/enums";

interface Reflection {
  player: GamePlayer;
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const reflection: Effect<Reflection> = (params) => {
  const {player, opponent, trap} = params;
  const fields = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  fields.forEach((field) => {
    const minion = player.minion[field];

    if (minion) {
      insertBuff(minion, EffectId.OVERCHARGE);
    }
  });

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"];
};

export {reflection};
