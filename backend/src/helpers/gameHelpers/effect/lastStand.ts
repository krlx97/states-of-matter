import {EffectId} from "@som/shared/enums";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface LastStand {
  minion: GameMinionCard;
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const lastStand = (params: LastStand) => {
  const {minion, opponent, trap} = params;

  minion.health = 1;
  minion.buffs.push({id: EffectId.TAUNT, data: {}});
  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"];
};

export {lastStand};
