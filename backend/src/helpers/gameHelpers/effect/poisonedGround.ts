import {EffectId} from "@som/shared/enums";
import {insertDebuff} from "../insertDebuff";
import type {GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface PoisonedGround {
  player: GamePlayer;
  minion: GameMinionCard;
  trap: GameTrapCard;
}

const poisonedGround = (params: PoisonedGround) => {
  const {player, minion, trap} = params;

  insertDebuff(minion, EffectId.NEUROTOXIN);
  player.graveyard.push(trap);
  player.trap = undefined;

  return [true, ""];
};

export {poisonedGround};
