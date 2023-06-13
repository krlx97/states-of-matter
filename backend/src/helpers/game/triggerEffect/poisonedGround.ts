import {EffectId} from "@som/shared/enums";
import {insertDebuff} from "../insertDebuff";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface PoisonedGround {
  player: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
}

const poisonedGround: Effect<PoisonedGround> = (params) => {
  const {player, minion, trap} = params;

  insertDebuff(minion, EffectId.NEUROTOXIN);
  player.graveyard.push(trap);
  player.trap = undefined;

  return [true, ""];
};

export {poisonedGround};
