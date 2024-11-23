import { CardType, EffectId } from "@som/shared/enums";
import { getAdjacentMinions } from "../getAdjacentMinions";
import { moveToGraveyard } from "../moveToGraveyard";
import { insertBuff } from "../insertBuff";
import type {Field, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface Reflection {
  player: GamePlayer;
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const reflection = (params: Reflection) => {
  const {player, opponent, trap} = params;
  const fields = Object.keys(player.field) as Array<keyof typeof player.field>;

  fields.forEach((field) => {
    const minion = player.field[field];

    if (minion && minion.type !== CardType.HERO) {
      insertBuff(minion, EffectId.OVERCHARGE);
    }
  });

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"];
};

export {reflection};
